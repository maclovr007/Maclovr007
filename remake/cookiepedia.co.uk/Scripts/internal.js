jQuery(document).ready(function ($) {
	
    $('#search-type').change(function () {
        $('#search-query').prop('placeholder', $(this).children(":selected").attr("title"));
    });
	
    /* prepend menu icon */
    $('#nav-wrap').prepend('<div id="menu-icon">Menu</div>');

    /* toggle nav */
    $("#menu-icon").on("click", function () {
        $("#nav").slideToggle();
        $(this).toggleClass("active");
    });

    $("#search-form").submit(function (e) {
        e.preventDefault();

        /* uri encode search-query input value if containing # character */
        $("#search-query").val(encodeURIComponent($("#search-query").val()));

        var searhType = $("#search-type").val();
        var searchQuery = $("#search-query").val();

        if (searhType == "website") {
            window.location = "/website/" + searchQuery;
        } else if (searhType == "3rd party host") {
            window.location = "/host/" + searchQuery;
        } else {
            window.location = "/cookies/" + searchQuery;
        }
    });

    $('#stats-cycle').cycle({
        fx: 'scrollLeft',
        timeout: 6000,
        delay: -1000
    });

    //ACCORDION BUTTON ACTION (ON CLICK DO THE FOLLOWING)
    $('.accordion-button').click(function () {
        //NO MATTER WHAT WE CLOSE ALL OPEN SLIDES
        $('.accordion-content').slideUp('normal');
        $('div.accordion-button').addClass('accordion-collapsed').removeClass('accordion-expanded');
        //IF THE NEXT SLIDE WASN'T OPEN THEN OPEN IT
        if ($(this).next().is(':hidden') == true) {
            //ADD THE ON CLASS TO THE BUTTON
            $(this).addClass('accordion-expanded').removeClass('accordion-collapsed');
            
            //OPEN THE SLIDE
            $(this).next().slideDown('normal');
        }
    });

    $('.accordion-content').hide();
    
    // Create contribution
    $('.c-contr').editable('/Contributions/CreateContribution', {
        method: 'POST',
        type: 'textarea',
        rows: 2,
        columns: 100,
        cancel: 'Cancel',
        submit: 'OK',
        tooltip: 'Click to create...',
        callback: function () {
            //TODO: remove reload. use on() or live() or etc.
            window.location.reload();
        }
    });

    // Update contribution
    $('.e-contr').editable('/Contributions/UpdateContribution',
        {
            loadurl: '/Contributions/GetContribution',
            method: 'POST',
            type: 'textarea',
            rows: 2,
            columns: 100,
            cancel: 'Cancel',
            submit: 'OK',
            tooltip: 'Click to edit...'
        }
    );
    
    // Update IccCategory
    $('.e-icc').editable('/Contributions/UpdateIccCategory',
        {
            loadurl: '/Contributions/GetIccCategory',
            method: 'POST',
            type: 'select',
            cancel: 'Cancel',
            submit: 'OK',
            tooltip: 'Click to edit...'
        }
    );

    // Website search results switch between cookie and host stats
    $('.website-results-switch .switch-link').on('click', function (e) {
        var isCookies = $('.website-results-switch .switch-label').text() == 'host';
        if (isCookies) {
            $('.website-results-cookies').hide();
            $('.website-results-hosts').show();
            $('.website-results-switch .switch-label').text('cookie');
        } else {
            $('.website-results-cookies').show();
            $('.website-results-hosts').hide();
            $('.website-results-switch .switch-label').text('host');
        }
        e.preventDefault();
    });
});
