(() => {
    const Tracker = {
        init: (config) => {
            Tracker.config = config;
            Tracker.log(`Initialised`, 'log');
            Tracker.nonce = crypto.randomUUID();
            window.onload = () => Tracker.setup();
        },
        refresh: () => {
            Tracker.setup();
        },
        setup: () => {
            Tracker.assignTracker();
            Tracker.getPageData();
            Tracker.eventBind();
        },
        assignTracker: () => {
            window.Tracker = Object.assign(Tracker, window.Tracker);
        },
        urlEvent: () => {
            if (!Tracker.config.watchers) {
                return;
            }
            const keys = Object.keys(Tracker.config.watchers.params);
            const searchParams = new URLSearchParams(window.location.search);
            keys.map((key) => {
                if (
                    searchParams.get(
                        Tracker.config.watchers.params[key].paramName
                    )
                ) {
                    Tracker.handlers[
                        Tracker.config.watchers.params[key].eventName
                    ]();
                    let url = new URL(window.location.href);
                    url.searchParams.delete(
                        Tracker.config.watchers.params[key].paramName
                    );
                    history.replaceState(history.state, '', url.href);
                }
            });
        },
        eventBind: () => {
            Tracker.urlEvent();
            const nodes = [
                ...document.querySelectorAll(
                    `[${Tracker.config.selectors.track}]`
                )
            ];
            nodes.map((node) => {
                let el = node,
                    handler = el.getAttribute(Tracker.config.selectors.track),
                    eventType = el.getAttribute(Tracker.config.selectors.type)
                        ? el
                              .getAttribute(Tracker.config.selectors.type)
                              .split('|')
                        : ['click'];
                if (typeof Tracker.handlers[handler] !== 'undefined') {
                    if (eventType[0] === 'impression') {
                        const observer = new IntersectionObserver((entries) => {
                            entries.forEach((entry) => {
                                if (entry.isIntersecting) {
                                    Tracker.handlers[handler](el);
                                }
                            });
                        });
                        observer.observe(el);
                    } else if (eventType[0] === 'onload') {
                        Tracker.handlers[handler](el);
                    } else {
                        el.addEventListener(
                            eventType,
                            Tracker.handlers[handler]
                        );
                    }
                } else {
                    Tracker.log(
                        `Hanlder ${handler} not found on element: %o`,
                        node
                    );
                }
            });
        },
        getPageData: () => {
            const currencyEl = document.querySelector(
                `[${Tracker.config.selectors.currency}]`
            );
            Tracker.page = {};
            if (currencyEl) {
                if (
                    window.Tracker.store.currency !==
                    currencyEl.getAttribute(
                        Tracker?.config?.selectors?.currency
                    )
                ) {
                    Tracker.store.set(
                        'currency',
                        currencyEl.getAttribute(
                            Tracker?.config?.selectors?.currency
                        )
                    );
                }
            } else {
                Tracker.log(
                    `Required attribute ${Tracker?.config?.selectors?.currency} not found. Include ${Tracker.config.selectors.currency}="GBP" (for e.g.) to an element in the DOM.`
                );
            }
        },
        getAttributes: (el) => {
            const target = el.currentTarget;
            const store = target?.getAttribute(Tracker.config.selectors.store);
            const type = target?.getAttribute(Tracker.config.selectors.type);
            const track = target?.getAttribute(Tracker.config.selectors.track);
            return { store, type, track };
        },
        push: (obj, config) => {
            if (!Tracker.enabled) return;
            Tracker.log(`Pushed event: ${JSON.stringify(obj)}`, 'log');
            if (config?.commerce) {
                window.dataLayer.push({ commerce: true });
            }
            if (window.dataLayer) {
                window.dataLayer.push(obj);
            }
        },
        marshalPubSub: (
            operationName,
            url,
            eventData,
            legacyRayId,
            experiments
        ) => {
            const rayId =
                legacyRayId || Tracker.store.get('rayId')?.value || 'unknown';
            const legacyData = {
                ...eventData,
                ray_ids: [rayId],
                nonce: Tracker.nonce,
                server: {
                    elysium_version:
                        Tracker.trackApiConfig.elysium_config.version
                },
                request: {
                    start_timestamp: Date.now(),
                    url: url
                },
                origin: {
                    referrer: document.referrer
                },
                property: {
                    site_id: Tracker.trackApiConfig.elysium_config.site_id,
                    channel: Tracker.trackApiConfig.elysium_config.channel,
                    subsite: Tracker.trackApiConfig.elysium_config.subsite,
                    locale: Tracker.store.get('locale')?.value
                },
                experiments
            };
            const basket = Tracker.store.get('basket');
            const cart = {
                items: basket?.items?.map((item) => {
                    return {
                        product_group: {
                            id: parseInt(item.id),
                            selected_variant: {
                                price: {
                                    currency: Tracker.store.get('currency'),
                                    value: parseFloat(
                                        item.product.price?.price?.amount
                                    )
                                },
                                sku: parseInt(item.product.product?.sku)
                            },
                            total_variants:
                                item.product.product?.variants?.length || null
                        },
                        quantity: item.quantity
                    };
                }),
                total_size: basket?.totalQuantity || 0,
                total_price: {
                    currency: Tracker.store.get('currency'),
                    value: parseFloat(basket?.chargePrice?.amount)
                }
            };

            if (cart.items?.length) {
                legacyData.cart = cart;
            }

            const payload = {
                operationName: operationName,
                metadata: {},
                path: url,
                version: 'altitude',
                rayId: rayId,
                currency:
                    Tracker.store.get('currency') ||
                    Tracker.store.get('curr')?.value,
                shippingDestination: Tracker.store.get('ship')?.value,
                locale: Tracker.store.get('locale')?.value
            };

            if (Object.keys(legacyData).length) payload.legacy = legacyData;
            return payload;
        },
        pushToTrackAPI: async (payload) => {
            if (!Tracker.enabled) return null;
            const trackUrl = Tracker.trackApiConfig.trackAPIUrl;
            if (!trackUrl) return;
            const dataBlob = new Blob([JSON.stringify(payload)], {
                type: 'application/json'
            });
            navigator.sendBeacon(trackUrl, dataBlob);
        },
        sendPubSubEvent: async (
            operationName,
            eventData,
            legacyRayId = null
        ) => {
            const experiments = [];
            if (window.__EXPERIMENTS__) {
                const chunks = window.__EXPERIMENTS__?.split(',');
                chunks?.forEach((pair) => {
                    const [name, value] = pair?.split(':');
                    if (name && value) {
                        experiments.push({ name, value });
                    }
                });
            }
            const payload = Tracker.marshalPubSub(
                operationName,
                window.location.pathname + window.location.search,
                eventData,
                legacyRayId,
                experiments
            );
            return Tracker.pushToTrackAPI(payload);
        },
        log: (message, type = 'warn') => {
            if (Tracker?.config?.debug) {
                type === 'warn' && console.warn('[Tracker]: %s', message);
                type === 'log' && console.log('[Tracker]: %s', message);
            }
        },
        translateTarget: (e) => {
            if (e instanceof Event) {
                return e.currentTarget.getAttribute(
                    Tracker.config.selectors.store
                );
            } else if (e instanceof HTMLElement) {
                return e.getAttribute(Tracker.config.selectors.store);
            } else if (e.store) {
                return e.store;
            } else {
                e;
            }
        },
        handlers: {
            performanceData: (CWVObject, perfDataObject) => {
                const experiments = [];
                if (window.__EXPERIMENTS__) {
                    const chunks = window.__EXPERIMENTS__?.split(',');
                    chunks?.forEach((pair) => {
                        const [name, value] = pair?.split(':');
                        if (name && value) {
                            experiments.push({ name, value });
                        }
                    });
                }
                const perfData = {
                    request: {
                        server_timestamp: null,
                        client_timestamp: new Date(Date.now()).toISOString(),
                        url: window.location.href
                    },
                    experiments: experiments,
                    errors: [
                        {
                            type: null,
                            label: null
                        }
                    ],
                    timing: {
                        backend_load_time:
                            perfDataObject?.navigationTiming?.backendLoadTime,
                        cache_time: perfDataObject?.navigationTiming?.cacheTime,
                        connection_time:
                            perfDataObject?.navigationTiming?.connectionTime,
                        dns_time: perfDataObject?.navigationTiming?.dnsTime,
                        dom_interactive_time:
                            perfDataObject?.navigationTiming
                                ?.domInteractiveTime,
                        dom_parsing_time:
                            perfDataObject?.navigationTiming?.domParsingTime,
                        dom_ready_time:
                            perfDataObject?.navigationTiming?.domReadyTime,
                        first_paint_time:
                            perfDataObject?.navigationTiming?.firstPaintTime,
                        frontend_load_time:
                            perfDataObject?.navigationTiming?.frontendLoadTime,
                        load_event_time:
                            perfDataObject?.navigationTiming?.loadEventTime,
                        navigation_time:
                            perfDataObject?.navigationTiming?.navigationTime,
                        redirect_time:
                            perfDataObject?.navigationTiming?.redirectTime,
                        first_contentful_paint_time: CWVObject?.fcp || null,
                        first_input_delay: CWVObject?.fid || null,
                        largest_contentful_paint_time: CWVObject?.lcp || null,
                        first_byte_time: CWVObject?.ttfb || null
                    },
                    score: {
                        cumulative_layout_shift: CWVObject?.cls || null
                    },
                    nonce: Tracker.nonce,
                    device: perfDataObject?.device,
                    page: perfDataObject?.page,
                    network: perfDataObject?.network,
                    abtasty: [
                        {
                            name: null,
                            time_to_first_byte: null,
                            transfer: null,
                            total: null,
                            encoded_file_size: null
                        }
                    ]
                };
                Tracker.pushToTrackAPI({
                    operationName: 'perfData',
                    metaData: { destination: 'performanceData' },
                    eventData: perfData
                });
            },
            // Page Load
            pageLoad: () => {
                const pageAttributesEntry = {
                    mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                        navigator.userAgent
                    )
                        ? 'yes'
                        : 'no'
                };

                const experiments = window.__EXPERIMENTS__;
                if (experiments) {
                    pageAttributesEntry.experiments = [experiments];
                }

                const payload = {
                    event: 'PageLoad',
                    platformType: 'Altitude',
                    pagePath: window.location.pathname,
                    pageAttributes: [pageAttributesEntry],
                    visitorLocation: window.__USRCOUNTRY__,
                    ...(Tracker?.store?.get('pageInfo') || {})
                };

                Tracker.push(payload);
            },

            // Cookie Consent
            cookieModalOpen: () => {
                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'Cookie Modal',
                        eventAction: 'Shown',
                        eventLabel: 'Accept Cookie Button',
                        eventPage: window?.location?.pathname
                    }
                };
                Tracker.push(elyEvent);
            },

            cookieModalClicked: () => {
                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'Cookie Modal',
                        eventAction: 'Clicked',
                        eventLabel: 'Accept Cookie Button',
                        eventPage: window?.location?.pathname
                    }
                };
                Tracker.push(elyEvent);
            },

            // ReEngagement Modal
            reEngOpen: () => {
                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'reEngagement Tooltip Modal',
                        eventAction: 'Shown',
                        eventLabel: 'reEngagement Modal Message',
                        eventPage: window?.location?.pathname
                    }
                };
                Tracker.push(elyEvent);
            },

            reEngClicked: (el) => {
                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'reEngagement Tooltip Modal',
                        eventAction: 'Clicked',
                        eventLabel: 'Continue Modal Button',
                        eventPage: window?.location?.pathname
                    }
                };
                Tracker.push(elyEvent);
            },

            reEngComplete: (el) => {
                const elyEvent = {
                    event: 'customEvent',
                    eventData: {
                        eventCategory: 'newsletter',
                        eventAction: 'successful sign-up',
                        eventPage: window?.location?.pathname
                    }
                };

                Tracker.push(elyEvent);
            },

            // Rewards and Loyalty
            rewardsOptIn: () => {
                const elyEvent = {
                    event: 'customEvent',
                    eventData: {
                        eventCategory: 'loyalty',
                        eventAction: 'successful sign-up',
                        eventPage: window?.location?.pathname
                    }
                };

                Tracker.push(elyEvent);
            },

            // Widget Track
            widgetTrack: (e) => {
                const widgetKey = e.parentElement.dataset.component;

                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'Widget Track',
                        eventAction: 'viewed',
                        eventLabel: widgetKey,
                        eventLabelValue:
                            Tracker.store.get('widgets')[widgetKey],
                        eventPage: window?.location?.pathname
                    }
                };

                Tracker.push(elyEvent);
            },

            widgetClick: (el) => {
                let widget = Tracker.translateTarget(el);

                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'Widget Track',
                        eventAction: 'clicked',
                        eventLabel: widget,
                        eventLabelValue: Tracker.store.get('widgets')[widget],
                        eventPage: window?.location?.pathname
                    }
                };
                if (widget !== 'ProductListWidget') {
                    Tracker.push(elyEvent);
                }
            },

            // Navigation
            navigationHeader: (el) => {
                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'Navigation Header',
                        eventAction: `Clicked ${window.tenantConfig?.application?.siteName}`,
                        eventLabel:
                            window.tenantConfig?.application?.livedomain,
                        eventPage: window?.location?.pathname
                    }
                };
                Tracker.push(elyEvent);
            },

            navigationMenu: (el) => {
                const mainCategory = el.target.innerText;

                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'Navigation Header',
                        eventAction: `Clicked ${mainCategory}`
                    }
                };
                Tracker.push(elyEvent);
            },

            navigationSubnav: (el) => {
                const subCategory = el.target.innerText;

                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'Navigation Header',
                        eventAction: `Clicked ${subCategory}`
                    }
                };
                Tracker.push(elyEvent);
            },

            navigationButton: (el) => {
                const button = Tracker.translateTarget(el);

                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'Navigation Header',
                        eventAction: `Clicked ${button}`
                    }
                };
                Tracker.push(elyEvent);
            },

            clickUSP: (el) => {
                let usp = Tracker.translateTarget(el);

                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'Widget Track',
                        eventAction: usp,
                        eventLabel: 'Responsive USP bar',
                        eventPage: window?.location?.pathname
                    }
                };
                Tracker.push(elyEvent);
            },

            // Search
            search: (e) => {
                const store = Tracker.translateTarget(e);
                // const searchInfo = window.Tracker.store.get('searchInfo')
                // const elyEvent = {
                //   event: 'elysiumEvent',
                //   eventData: {
                //     eventCategory: 'Navigation Header',
                //     eventAction: `Clicked ${searchInfo?.input ?? ''}`,
                //     eventLabel:
                //       window?.location?.pathname + window?.location?.search,
                //     eventPage: window?.location?.pathname
                //   }
                // }
                // Tracker.push(elyEvent)

                const pageData = Tracker.store.get(store);
                Tracker.sendPubSubEvent(
                    'Search',
                    {
                        event: {
                            type: 'search'
                        },
                        page: {
                            search: {
                                query: pageData.query || '',
                                total_results: pageData.total
                            },
                            items: pageData.products?.map((product) => {
                                return {
                                    product_group: {
                                        selected_variant: {
                                            price: {
                                                currency:
                                                    product?.defaultVariant
                                                        ?.price?.price
                                                        ?.currency,
                                                value: parseFloat(
                                                    product?.defaultVariant
                                                        ?.price?.price?.amount
                                                )
                                            },
                                            sku: parseInt(product?.sku)
                                        },
                                        total_variants:
                                            product?.variants?.length
                                    }
                                };
                            })
                        }
                    },
                    pageData.rayId
                );
            },
            suggestedSearchQueries: (el) => {
                let query = Tracker.translateTarget(el);

                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'Navigation Header',
                        eventAction: `Clicked ${query}`,
                        eventLabel: `/search/?q=${query}`,
                        eventPage: window?.location?.pathname
                    }
                };
                Tracker.push(elyEvent);
            },

            suggestedSearchProduct: (el) => {
                const sku = Tracker.translateTarget(el);
                const product = Tracker.store.get('suggestedProducts')[sku];

                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'Navigation Header',
                        eventAction: `Clicked ${product?.product_id}:${product?.product_name}`,
                        eventLabel: product?.url,
                        eventPage: window?.location?.pathname
                    }
                };
                Tracker.push(elyEvent);
            },

            // Basket
            goToBasket: (el) => {
                const key = Tracker.translateTarget(el);

                const quantity = Tracker.store.get(key);

                const elyEvent = {
                    event: 'Link',
                    eventData: {
                        eventCategory: 'Link',
                        eventAction: 'Go To Basket',
                        eventLabel: quantity,
                        eventPage: window?.location?.pathname
                    }
                };
                Tracker.push(elyEvent);
            },

            viewBasket: () => {
                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'Navigation Header',
                        eventAction: 'Clicked View Basket',
                        eventPage: window?.location?.pathname
                    }
                };
                Tracker.push(elyEvent);
            },

            addToCart: (e) => {
                let data = Tracker.store.get('products')[e];

                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'Product | AddToBasket',
                        eventAction: 'success',
                        eventLabel: data?.item_id,
                        eventLabelValue: data.item_name
                    },
                    eventPage: window?.location?.pathname
                };
                const ecommerceEvent = {
                    event: 'ecom_event',
                    event_name: 'add_to_cart',
                    ecommerce: {
                        currencyCode: data.currency ?? '',
                        value: data?.value,
                        items: [
                            {
                                item_id: data.item_id ?? '',
                                item_name: data.item_name ?? '',
                                item_brand: data.item_brand ?? '',
                                price: data.price ?? 'unknown',
                                index: data.index,
                                discount: data?.discount,
                                affiliation: data?.affiliation,
                                coupon: data.coupon,
                                item_category: data?.item_category,
                                item_list_name: data?.item_list_name,
                                item_variant: data?.variant,
                                quantity: data.quantity ?? 0
                            }
                        ]
                    }
                };
                Tracker.push(ecommerceEvent, { commerce: true });
                Tracker.push(elyEvent);
                const items = [data];
                Tracker.sendPubSubEvent('AddToCart', {
                    event: {
                        type: 'cart_interaction_event',
                        subtype: 'initial_add',
                        items: items.map((item) => ({
                            product_group: {
                                selected_variant: {
                                    price: {
                                        currency: Tracker.store.get('currency'),
                                        value:
                                            parseFloat(item.price) *
                                            item.quantity
                                    },
                                    sku: parseInt(item.item_id)
                                }
                            },
                            quantity: item.quantity
                        }))
                    }
                });
            },

            removeFromCart: (e) => {
                let data = Tracker.store.get('products')[e];
                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'Product | Remove From Basket',
                        eventAction: 'success',
                        eventLabel: data?.item_id,
                        eventLabelValue: data.item_name
                    },
                    eventPage: window?.location?.pathname
                };
                const ecommerceEvent = {
                    event: 'ecom_event',
                    event_name: 'remove_from_cart',
                    ecommerce: {
                        currencyCode: data?.currency ?? '',
                        value: data?.value,
                        items: [
                            {
                                item_id: data.item_id ?? '',
                                item_name: data.item_name ?? '',
                                item_brand: data.item_brand ?? '',
                                price: data.price ?? 'unknown',
                                index: data.index,
                                discount: data?.discount,
                                affiliation: data?.affiliation,
                                coupon: data.coupon,
                                item_category: data?.item_category,
                                item_list_name: data?.item_list_name,
                                item_variant: data?.variant,
                                quantity: data.quantity ?? 0
                            }
                        ]
                    }
                };
                Tracker.push(ecommerceEvent, { commerce: true });
                Tracker.push(elyEvent);
                const items = [data];
                Tracker.sendPubSubEvent('RemoveFromCart', {
                    event: {
                        type: 'cart_interaction_event',
                        subtype: 'trash',
                        items: items.map((item) => ({
                            product_group: {
                                selected_variant: {
                                    price: {
                                        currency: Tracker.store.get('currency'),
                                        value:
                                            parseFloat(item.price) *
                                            item.quantity
                                    },
                                    sku: parseInt(item.item_id)
                                }
                            },
                            quantity: item.quantity
                        }))
                    }
                });
            },

            goToCheckout: () => {
                const event = {
                    event: 'elysiumEvent',
                    event_name: 'go_to_checkout',
                    eventData: {
                        eventAction: 'Go To Checkout'
                    }
                };

                Tracker.push(event);
            },

            basketProductClick: (e) => {
                let clickedItem = Tracker.translateTarget(e);
                const item = Tracker.store.get('products')[clickedItem];

                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'Product | AddToBasket',
                        eventAction: 'success',
                        eventLabel: clickedItem,
                        eventLabelValue: item?.item_name
                    },
                    eventPage: window?.location?.pathname
                };

                Tracker.push(elyEvent);
            },

            viewFreeGift: (e) => {
                const id = Tracker.translateTarget(e);
                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'freeProductSelection',
                        eventAction: 'ViewedFreeGift',
                        eventLabel: id
                    },
                    eventPage: window?.location?.pathname
                };

                Tracker.push(elyEvent);
            },

            selectFreeGift: (e) => {
                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'freeProductSelection',
                        eventAction: 'Add Item',
                        eventLabel: e
                    },
                    eventPage: window?.location?.pathname
                };

                Tracker.push(elyEvent);
            },

            removeFreeGift: (e) => {
                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'freeProductSelection',
                        eventAction: 'Removing Item',
                        eventLabel: e
                    },
                    eventPage: window?.location?.pathname
                };
                Tracker.push(elyEvent);
            },

            applyCouponSuccess: (e) => {
                let coupon = Tracker.translateTarget(e);

                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'Discount codes',
                        eventAction: 'Valid',
                        eventLabel: coupon,
                        eventPage: window?.location?.pathname
                    }
                };

                Tracker.push(elyEvent);
                Tracker.handlers.applyDiscountCode({ message: e.message });
            },

            applyCouponFailure: (e) => {
                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'Discount codes',
                        eventAction: 'Inactive',
                        eventLabel: e.promoCode,
                        eventPage: window?.location?.pathname
                    }
                };
                Tracker.push(elyEvent);
                Tracker.handlers.applyDiscountCode({ message: e.errorMessage });
            },
            applyDiscountCode: (e) => {
                const messages = [e.message];

                Tracker.sendPubSubEvent('ApplyDiscountCodeToBasket', {
                    event: {
                        type: 'discount_code_event'
                    },
                    errors: messages
                        .filter(
                            (message) =>
                                message &&
                                ![
                                    'OFFER_APPLIED',
                                    'CODE_APPLIED',
                                    'SELECT_YOUR_SAMPLE_APPLIED',
                                    'REFERRAL_CODE_INSERTED',
                                    'UPSELL'
                                ].includes(message)
                        )
                        .map((message) => {
                            let label;
                            switch (message) {
                                case 'CODE_INVALID':
                                    label = 'not_found';
                                    break;
                                case 'CODE_EXPIRED':
                                    label = 'expired';
                                    break;
                                case 'CODE_VALID_BUT_NOT_APPLICABLE_TO_BASKET':
                                    label = 'not_applicable_to_basket_content';
                                    break;
                                case 'REFERRER_NOT_ELIGIBLE':
                                    label = 'invalid_referrer';
                                    break;
                                case 'PRODUCT_OUT_OF_STOCK':
                                    label = 'gift_not_in_stock';
                                    break;
                                case 'BETTER_OFFER_ALREADY_APPLIED':
                                    label = 'better_offer_applied';
                                    break;
                                case 'PROMO_CODE_ALREADY_USED':
                                    label = 'no_redemptions_left';
                                    break;
                                case 'REFERRAL_CODE_NEEDS_REGISTRATION':
                                    label = 'customer_not_logged_in';
                                    break;
                                case 'REFEREE_NOT_ELIGIBLE':
                                    label = 'customer_does_not_qualify';
                                    break;
                                default:
                                    label = 'unknown_error_type';
                            }
                            return {
                                type: 'discount_code_error',
                                label
                            };
                        })
                });
            },
            // Wish list
            wishlistLoggedout: (el) => {
                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'Wishlist Engagement',
                        eventAction: 'Clicked add to wishlist | Logged out',
                        eventLabel: el,
                        eventPage: window?.location?.pathname
                    }
                };
                Tracker.push(elyEvent);
            },

            wishlistLogin: (el) => {
                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'Wishlist Engagement',
                        eventAction: 'clicked login link',
                        eventLabel: productId,
                        eventPage: window?.location?.pathname
                    }
                };
                Tracker.push(elyEvent);
            },

            wishlistRegister: () => {
                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'Wishlist Engagement',
                        eventAction: 'clicked register link',
                        eventLabel: productId,
                        eventLabeValue: productName,
                        eventPage: window?.location?.pathname
                    }
                };
                Tracker.push(elyEvent);
            },

            wishlistAdded: (el) => {
                let productId;
                let productName;
                const productlist = window.Tracker.store.get('productList');
                if (productlist) {
                    productId = productlist.items[el].item_id;
                    productName = productlist.items[el].item_name;
                }

                if (window.Tracker.store.get(el)) {
                    productId = window.Tracker.store.get(el).item_id;
                    productName = window.Tracker.store.get(el).item_name;
                }

                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'Wishlist Engagement',
                        eventAction: 'added to wishlist',
                        eventLabel: productId,
                        eventPage: window?.location?.pathname
                    }
                };
                Tracker.push(elyEvent);
                Tracker.sendPubSubEvent('AddToWishlist', {
                    event: {
                        type: 'wishlist_interaction_event',
                        subtype: 'initial_add',
                        items: [
                            {
                                product_group: {
                                    id: parseInt(el)
                                },
                                quantity: 1
                            }
                        ]
                    }
                });
            },

            wishlistRemove: ({ sku, rayId }) => {
                let productId;
                let productName;
                const productlist = window.Tracker.store.get('productList');
                if (productlist) {
                    productId = productlist.items[sku].item_id;
                    productName = productlist.items[sku].item_name;
                }

                if (window.Tracker.store.get(sku)) {
                    productId = window.Tracker.store.get(sku).item_id;
                    productName = window.Tracker.store.get(sku).item_name;
                }

                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'Wishlist Engagement',
                        eventAction: 'removed from wishlist',
                        eventLabel: productId,
                        eventPage: window?.location?.pathname
                    }
                };
                Tracker.push(elyEvent);
                Tracker.sendPubSubEvent(
                    'RemoveFromWishlist',
                    {
                        event: {
                            type: 'wishlist_interaction_event',
                            subtype: 'trash',
                            items: [
                                {
                                    product_group: {
                                        id: parseInt(sku)
                                    },
                                    quantity: 1
                                }
                            ]
                        }
                    },
                    rayId
                );
            },

            // PLP
            viewItemList: () => {
                const list = window.Tracker.store.get('productList');

                const gaEvent = {
                    event: 'view_item_list',
                    currencyCode: Tracker.store.get('currency'),
                    ecommerce: {
                        item_list_id: list?.id ?? '',
                        item_list_name: list?.title ?? '',
                        items: list.items && Object.values(list.items)
                    }
                };
                Tracker.push(gaEvent);
            },

            ReadMoreClicked: () => {
                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'Read More Button',
                        eventAction: `Clicked`,
                        eventPage: window?.location?.pathname
                    }
                };
                Tracker.push(elyEvent);
            },

            selectItem: (el) => {
                const item = Tracker.translateTarget(el);
                const product = Tracker.store.get('productList').items;
                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'List Page Navigation',
                        eventAction: ` ${product[item]?.url}| Click product image`,
                        eventLabel: product[item]?.item_id,
                        eventPage: window?.location?.pathname
                    }
                };

                const gaEvent = {
                    event: 'select_item',
                    ecommerce: {
                        item_list_id: product[item].item_list ?? '',
                        item_list_name: product[item].title ?? '',
                        items: [
                            {
                                item_id: product[item].item_id,
                                item_list: product[item].item_list,
                                item_brand: product[item].brand,
                                price: product[item].price,
                                value: product[item].value,
                                discount: product[item].discount,
                                coupon: product[item].coupon,
                                affiliation: product[item].affiliation,
                                index: product[item].index,
                                item_list_id: product[item].item_id,
                                item_list_name: product[item].item_list,
                                item_variant: product[item].variant,
                                quantity: 1
                            }
                        ]
                    }
                };
                Tracker.push(elyEvent);
                Tracker.push(gaEvent);
            },

            showFilter: () => {
                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'responsiveFacets',
                        eventAction: 'Opens',
                        eventPage: window?.location?.pathname
                    }
                };
                Tracker.push(elyEvent);
            },

            closeFilter: () => {
                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'responsiveFacets',
                        eventAction: 'Closes',
                        eventPage: window?.location?.pathname
                    }
                };
                Tracker.push(elyEvent);
            },

            filterOpen: () => {
                const event = {
                    event: 'elysiumEvent',
                    event_name: 'filter_open',
                    eventData: {
                        eventCategory: 'responsiveFacets',
                        eventAction: 'Opens',
                        type: 'amino acids',
                        eventPage: window?.location?.pathname
                    }
                };

                Tracker.push(event);
            },

            filter: (e) => {
                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'responsiveFacets',
                        eventAction: 'add',
                        eventLabel: e,
                        eventPage: window?.location?.pathname
                    }
                };
                Tracker.push(elyEvent);
            },

            filterRemoved: (el) => {
                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'responsiveFacets',
                        eventAction: 'Removes',
                        eventLabel: el.eventCategory,
                        eventPage: window?.location?.pathname
                    }
                };
                Tracker.push(elyEvent);
            },

            filterClear: (e) => {
                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'responsiveFacets',
                        eventAction: 'remove',
                        eventLabel: 'all facets',
                        eventPage: window?.location?.pathname
                    }
                };
                Tracker.push(elyEvent);
            },

            sortByOpen: () => {
                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'Facet Engagement',
                        eventAction: 'Opens Sort By',
                        eventPage: window?.location?.pathname
                    }
                };
                Tracker.push(elyEvent);
            },

            sortByClose: (el) => {
                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'Facet Engagement',
                        eventAction: 'Closes Sort By',
                        eventPage: window?.location?.pathname
                    }
                };
                Tracker.push(elyEvent);
            },

            sortByClick: (el) => {
                const sortType = Tracker.translateTarget(el);

                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'Facet Engagement',
                        eventAction: 'Selects Sort By',
                        eventLabel: sortType,
                        eventPage: window?.location?.pathname
                    }
                };
                Tracker.push(elyEvent);
            },

            viewPromotion: (e) => {
                let promo = Tracker.translateTarget(e);

                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'Pap | papBanner',
                        eventAction: 'Viewed',
                        eventLabel: 'papBanner component',
                        eventPage: window?.location?.pathname
                    }
                };

                const gaEvent = {
                    event: 'ecom_event',
                    event_name: 'view_promotion',
                    ecommerce: {
                        items: [
                            {
                                promotion_id: '',
                                promotion_name: promo,
                                creative_name: '',
                                creative_slot: '',
                                location_id: ''
                            }
                        ]
                    }
                };

                Tracker.push(elyEvent);
                Tracker.push(gaEvent);
            },

            promoClick: (el) => {
                const promo = Tracker.translateTarget(el);
                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'Pap | papBanner',
                        eventAction: 'Clicked',
                        eventLabel: 'papBanner component',
                        eventPage: window?.location?.pathname
                    }
                };

                const gaEvent = {
                    event: 'ecom_event',
                    event_name: 'select_promotion',
                    ecommerce: {
                        items: [
                            {
                                promotion_id: '',
                                promotion_name: promo,
                                creative_name: '',
                                creative_slot: '',
                                location_id: ''
                            }
                        ]
                    }
                };
                Tracker.push(gaEvent);
                Tracker.push(elyEvent);
            },

            promoButtonClick: (e) => {
                const promo = Tracker.translateTarget(e);

                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'Pap | papDescriptionCTA',
                        eventAction: 'Clicked',
                        eventLabel: 'papDescription component',
                        eventPage: window?.location?.pathname
                    }
                };

                Tracker.push(elyEvent);
            },

            // PDP
            viewItem: (e) => {
                let itemSku = Tracker.translateTarget(e);
                let data = Tracker.store.get('products')[itemSku];

                const elyEvent = {
                    event: 'elysiumEvent',
                    event_name: 'view_item',
                    eventData: {
                        eventCategory: 'Product | Viewed',
                        eventAction: 'Viewed',
                        eventLabel: itemSku,
                        eventLabelValue: [Tracker.store.get(itemSku)],
                        eventPage: window?.location?.pathname
                    }
                };
                const gaEvent = {
                    event: 'ecom_event',
                    event_name: 'view_items',
                    ecommerce: {
                        currencyCode: Tracker.store.get('currency') ?? '',
                        value: data?.value,
                        items: [
                            {
                                item_id: data.item_id ?? '',
                                item_name: data.item_name ?? '',
                                item_brand: data.item_brand ?? '',
                                price: data.price ?? 'unknown',
                                index: data.index,
                                discount: data?.discount,
                                affiliation: data?.affiliation,
                                coupon: data?.coupon,
                                item_category: data?.item_category,
                                item_list_name: data?.item_list_name,
                                item_variant: data?.variant,
                                quantity: data.quantity ?? 0
                            }
                        ]
                    }
                };
                Tracker.push(gaEvent);
                Tracker.push(elyEvent);
            },

            productDesView: () => {
                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'Product | Description',
                        eventAction: 'Viewed',
                        eventLabel: 'productDescription component',
                        eventPage: window?.location?.pathname
                    }
                };
                Tracker.push(elyEvent);
            },

            productImageScrolled: (el) => {
                const imgInx = Tracker.translateTarget(el);
                const indexInfo = window.Tracker.store.get('imageIndex');

                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'ProductImageCarousel',
                        eventAction: 'scroll',
                        eventLabel: `Scrolled to image ${indexInfo?.index} `,
                        eventPage: window?.location?.pathname
                    }
                };
                Tracker.push(elyEvent);
            },

            productThumbnailClicked: (el) => {
                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'athenaProductImageCarousel',
                        eventAction: 'click',
                        eventLabel: `thumbnail`,
                        eventLabelValue: 'index',
                        eventPage: window?.location?.pathname
                    }
                };
                Tracker.push(elyEvent);
            },

            productDesClick: (el) => {
                const eventCategory = el.target.dataset.trackingPush;

                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'Product | Description',
                        eventAction: 'Clicked',
                        eventLabel: `productDescription component clicked tab ${eventCategory}`,
                        eventPage: window?.location?.pathname
                    }
                };
                Tracker.push(elyEvent);
            },

            reviewViewed: () => {
                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'Product | Review',
                        eventAction: 'Viewed',
                        eventLabel: 'athenaProductReviews component',
                        eventPage: window?.location?.pathname
                    }
                };
                Tracker.push(elyEvent);
            },

            reviewVoted: (el) => {
                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'Product | Voted',
                        eventAction: 'Voted',
                        eventLabel: `athenaProductReviews component voted ${el.voted} ${el.id}`,
                        eventPage: window?.location?.pathname
                    }
                };
                Tracker.push(elyEvent);
            },

            reviewReported: (el) => {
                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'Product | Reported',
                        eventAction: 'Reported',
                        eventLabel: `athenaProductReviews component reported ${el.id}`,
                        eventPage: window?.location?.pathname
                    }
                };
                Tracker.push(elyEvent);
            },

            reviewCreated: (el) => {
                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'Product | Reported',
                        eventAction: 'Reported',
                        eventLabel: `athenaProductReviews component reported ${el?.product_id}`,
                        eventPage: window?.location?.pathname
                    }
                };
                Tracker.push(elyEvent);
            },

            reviewPage: (el) => {
                const elyEvent = {
                    event: 'elysiumEvent',
                    eventData: {
                        eventCategory: 'Product | Review',
                        eventAction:
                            el === 'next'
                                ? 'Next Review Page'
                                : 'Previous Review Page',
                        eventLabel: `athenaProductReviews component go ${el} page`,
                        eventPage: window?.location?.pathname
                    }
                };
                Tracker.push(elyEvent);
            },

            // PDP
            productImageNav: (el) => {
                const gaEvent = {
                    event: 'product_image_nav',
                    eventData: {
                        action: `${el?.action} image`,
                        product_id: el.id,
                        product_name: el.title
                    }
                };

                const elyEvent = {
                    event: 'elysiumEvent',
                    category: 'ProductImageCarousel',
                    action: 'click',
                    label: `${el?.action} image`,
                    page: window?.location?.pathname
                };
                Tracker.push(elyEvent);
                Tracker.push(gaEvent);
            },

            sizeGuideClick: () => {
                const gaEvent = {
                    event: 'product_size_guide',
                    eventData: {
                        action: 'Clicked',
                        component: 'productSizeGuide component clicked button'
                    }
                };

                const elyEvent = {
                    event: 'elysiumEvent',
                    category: 'Product | Size Guide',
                    action: 'Clicked',
                    label: 'productSizeGuide',
                    page: window?.location?.pathname
                };
                Tracker.push(elyEvent);
                Tracker.push(gaEvent);
            },

            sizeGuideModalOpen: () => {
                const gaEvent = {
                    event: 'product_size_guide_viewed',
                    eventData: {
                        component: 'product size guide modal',
                        path: window?.location?.pathname
                    }
                };

                const elyEvent = {
                    event: 'elysiumEvent',
                    category: 'Product | Size Guide modal',
                    action: 'Shown',
                    label: 'productSizeGuide',
                    page: window?.location?.pathname
                };
                Tracker.push(elyEvent);
                Tracker.push(gaEvent);
            },

            sizeGuideModalClose: () => {
                const gaEvent = {
                    event: 'product_size_guide_closed',
                    eventData: {
                        component: 'product size guide modal',
                        path: window?.location?.pathname
                    }
                };

                const elyEvent = {
                    event: 'elysiumEvent',
                    category: 'Product | Size Guide modal',
                    action: 'Closed',
                    label: 'product Size Guide',
                    page: window?.location?.pathname
                };
                Tracker.push(elyEvent);
                Tracker.push(gaEvent);
            },
            updateMarketingPreferences: ({ rayId }) => {
                Tracker.sendPubSubEvent(
                    'MarketingPreferenceUpdated',
                    {
                        event: {
                            type: 'account_update',
                            subtype: 'communication_preferences'
                        }
                    },
                    rayId
                );
            },
            pageVisit: () => {
                Tracker.sendPubSubEvent('PageVisit', {
                    event: {
                        type: 'page_visit'
                    }
                });
            },
            productVisit: (e) => {
                const store = Tracker.translateTarget(e);
                const pageData = Tracker.store.get(store);
                const productData = Tracker.store.get('products')[pageData.sku];
                Tracker.sendPubSubEvent(
                    'ProductVisit',
                    {
                        event: {
                            type: 'product_visit'
                        },
                        page: {
                            items: [
                                {
                                    product_group: {
                                        id: parseInt(productData?.item_id),
                                        selected_variant: {
                                            price: {
                                                currency:
                                                    Tracker.store.get(
                                                        'currency'
                                                    ),
                                                value: parseFloat(
                                                    productData?.price
                                                )
                                            },
                                            sku: parseInt(productData?.item_id)
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    pageData.rayId
                );
            },
            // ---> MTA handlers <---
            loginSuccess: ({ loginMethod, rayId, visitorId }) => {
                const elyEvent = {
                    event: 'custom_event',
                    event_name: 'login',
                    method: loginMethod
                };
                if (visitorId) {
                    elyEvent.visitorId = visitorId;
                }
                Tracker.push(elyEvent);
                return Tracker.sendPubSubEvent(
                    'Login',
                    {
                        event: {
                            type: 'login',
                            subtype: 'existing_customer'
                        }
                    },
                    rayId
                );
            },

            loginFailed: ({ loginMethod, errorValue }) => {
                const elyEvent = {
                    event: 'custom_event',
                    event_name: 'login_failed',
                    method: loginMethod,
                    error_value: errorValue
                };
                Tracker.push(elyEvent);
            },

            logout: () => {
                const elyEvent = {
                    event: 'custom_event',
                    event_name: 'logout'
                };
                Tracker.push(elyEvent);
            },

            accountRegistrationSuccess: ({
                registrationMethod,
                userId,
                rayId,
                visitorId
            }) => {
                const elyEvent = {
                    event: 'custom_event',
                    event_name: 'sign_up',
                    method: registrationMethod,
                    user_id: userId
                };
                if (visitorId) {
                    elyEvent.visitorId = visitorId;
                }

                Tracker.push(elyEvent);
                Tracker.sendPubSubEvent(
                    'Login',
                    {
                        event: {
                            type: 'login',
                            subtype: 'account_creation'
                        }
                    },
                    rayId
                );
            },

            accountRegistrationFail: ({ validationErrors }) => {
                const elyEvent = {
                    event: 'custom_event',
                    event_name: 'sign_up_failed',
                    Validation_errors: validationErrors
                };
                Tracker.push(elyEvent);
            },

            checkoutStart: async (e) => {
                const items = Tracker.store.get('checkout_start_items') || [];
                const currency = Tracker.store.get('currency');

                const gaEvent = {
                    event_name: 'begin_checkout',
                    currencyCode: currency,
                    Items: items
                };

                Tracker.push(gaEvent);
                const store = Tracker.translateTarget(e);
                const data = Tracker.store.get(store);
                return Tracker.sendPubSubEvent(
                    'StartCheckout',
                    {
                        event: {
                            type: 'checkout_start',
                            subtype: 'standard_checkout'
                        }
                    },
                    data.rayId
                );
            },
            guestCheckoutStart: async (e) => {
                const elyEvent = {
                    event: 'elysiumEvent',
                    event_name: 'continue_as_guest',
                    category: 'Continue as guest',
                    action: 'Clicked'
                };
                Tracker.push(elyEvent);

                const store = Tracker.translateTarget(e);
                const data = Tracker.store.get(store);
                return Tracker.sendPubSubEvent(
                    'StartGuestCheckout',
                    {
                        event: {
                            type: 'checkout_start',
                            subtype: 'guest_checkout'
                        }
                    },
                    data.rayId
                );
            },
            // ---> MTA handlers <---
            pageNotFound: () => {
                const gaEvent = {
                    event: 'page_not_found'
                };
                const elyEvent = {
                    event: 'elysiumEvent',
                    category: 'Errors',
                    action: 'Page Not Found',
                    path: window?.location?.pathname
                };
                Tracker.push(gaEvent);
                Tracker.push(elyEvent);
            },
            emptyList: (el) => {
                const gaEvent = {
                    event: 'empty_page'
                };
                const elyEvent = {
                    event: 'elysiumEvent',
                    label: 'Empty List',
                    labelValue: el,
                    path: window?.location?.pathname
                };
                Tracker.push(gaEvent);
                Tracker.push(elyEvent);
            },
            noSearchResult: (el) => {
                const gaEvent = {
                    event: 'no_search_results',
                    eventData: {
                        input: el
                    }
                };
                const elyEvent = {
                    event: 'elysiumEvent',
                    label: 'No Search Results',
                    labelValue: el,
                    path: window?.location?.pathname + window?.location?.search
                };
                Tracker.push(gaEvent);
                Tracker.push(elyEvent);
            },
            startPageSize: (el) => {
                const key = Tracker.translateTarget(el);
                const size = Tracker.store.get(key);
                const gaEvent = {
                    event: 'start_page_size',
                    eventData: {
                        height: size.height,
                        width: size.width
                    }
                };
                const elyEvent = {
                    event: 'elysiumEvent',
                    label: 'Start Page Size',
                    labelValue: { height: size.height, width: size.width },
                    path: window?.location?.pathname + window?.location?.search
                };
                Tracker.push(gaEvent);
                Tracker.push(elyEvent);
            },
            outOfStock: (el) => {
                const item = window.Tracker.store.get(el);
                const gaEvent = {
                    event: 'sold_out_product',
                    eventData: item
                };
                const elyEvent = {
                    event: 'elysiumEvent',
                    label: 'Sold Out Product',
                    labelValue: item,
                    path: window?.location?.pathname + window?.location?.search
                };
                Tracker.push(gaEvent);
                Tracker.push(elyEvent);
            }
        },
        trackApiConfig: null,
        config: null,
        enabled: false,
        store: {
            get(k) {
                return Tracker.store[k];
            },
            set(k, v) {
                return (Tracker.store[k] = Tracker.store[k]
                    ? Object.assign(Tracker.store[k], v)
                    : v);
            }
        }
    };
    Tracker.assignTracker();
    if (typeof window.Tracker.load !== 'function') {
        Tracker.init({
            debug: false,
            selectors: {
                track: 'data-track',
                type: 'data-track-type',
                store: 'data-track-push',
                currency: 'data-track-currency'
            }
        });
    } else {
        window.Tracker.load();
    }
})();
