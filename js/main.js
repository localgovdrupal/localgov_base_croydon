/**
 * @file JS file for service toggling and external links.
 */

(function ($, Drupal, once) {
  Drupal.behaviors.oneTimeLoad = {
    attach: function (context, settings) {
      once('oneTimeLoad', 'html', context).forEach( function (element) {

        var homeExists = document.querySelector('.path-frontpage');

        $('.main a').filter(function() {
          if(this.hostname.indexOf("croydon.gov.uk") === -1){
            return this.hostname && this.hostname !== location.hostname;
          }
        }).addClass('external-link').attr('target', '_blank');


        /* Homepage only - services list show hide */
        if (homeExists) {

          var $servicesBlock = $(".layout--threecol-33-34-33");

          $servicesBlock.slice(2).hide();

          $('.services-show').on('click', function(e) {
            $(this).removeClass("d-flex").addClass("d-none"); // work around for BS4 d-flex using !important and overriding usual hide method
            $servicesBlock.show();
            e.preventDefault();
          });

          $('.services-hide').on('click', function(e) {
            $servicesBlock.slice(2).hide();
            $('.services-show').removeClass("d-none").addClass("d-flex"); // work around for BS4 d-flex using !important and overriding usual hide method
          });
        }


        /*Leaflet Map Marker Active State*/
        setTimeout(loadMap, 3000); /*Important gives map time to load into the DOM*/

        function loadMap() {
           $('.leaflet-div-icon').on('click', function(e) {
           $('.leaflet-div-icon-active').removeClass('leaflet-div-icon-active');
           $(this).addClass('leaflet-div-icon-active');
          });
        }

        /*Subsites nav*/
        $('.block-localgov-subsite-navigation').on( "click", "h3", function() {
          $('.block-localgov-subsite-navigation h3').toggleClass('menu-shown');
          $('.block-localgov-subsite-navigation .menu-item').toggleClass('menu-item--show');
        });

        // Directories Map Visibility
        $('.leaflet-map-visibility').on('click', function(e){
          $('.leaflet-map-visibility').toggleClass('leaflet-map-visibility--hide-map');
          $('#leaflet-map-view-localgov-directory-channel-embed-map').toggle();
          $('.leaflet-recenter-map').toggle();
          ($(this).text() === "Show map") ? $(this).text("Hide map") : $(this).text("Show map");
        });

        // By default we hide the facets block on mobile
        // devices. This is done using a media query.

        // Hide the facet filter block and set the button link to text.
        if ($('.facets-widget.facets-widget--checkbox').css('display') == 'none') {
          $('.facet-filter-visibility').toggleClass('facet-filter-visibility--hide-filter');
          $('.facet-filter-visibility.facet-filter-visibility--hide-filter').text("Show filters");
        }
        // Show the facet filter block and set the button link to text.
        if ($('.facets-widget.facets-widget--checkbox').css('display') == 'block') {
          $('.facet-filter-visibility.facet-filter-visibility--hide-filter').removeClass();
          $('.facet-filter-visibility').text("Hide filters");
        }

        // Display the Facet block if a facet is checked
        // when the window has loaded.
        $( window ).on( "load", function() {
          if ($('.facets-widget input[type=checkbox]').is(":checked")) {
            $('.facets-widget.facets-widget--checkbox').css('display','block');
            $('.facet-filter-visibility.facet-filter-visibility--hide-filter').removeClass('facet-filter-visibility--hide-filter');
            $('.facet-filter-visibility').text("Hide filters");
          }
        });

        // Facet filter show or hide button links.
        $('.facet-filter-visibility').on('click', function(e){
          $('.facet-filter-visibility').toggleClass('facet-filter-visibility--hide-filter');
          $('.facets-widget.facets-widget--checkbox').toggle();
          ($(this).text() === "Show filters") ? $(this).text("Hide filters") : $(this).text("Show filters");
        });

        // Recenter Map
        $('.leaflet-recenter-map').on('click', function(e){
          $("a.leaflet-bar-part.leaflet-bar-part-single")[0].click();
        });

        // handle mobile overlength guide navs set to toggle
        $(".lgd-guide-nav__content").on('click', function(e) {
          $(this).toggleClass("lgd-guide-nav__open");
          $(".lgd-guide-nav").toggleClass("hidden");

          e.preventDefault();
        });

        $(window).on( "resize", function() {
          var windowWidth = $(window).width();
              listLength = $('.lgd-guide-nav__list li').length;

          if (windowWidth <= 768 && listLength > 5) {
            $(".lgd-guide-nav").addClass("hidden");
            $(".lgd-guide-nav__content").css("display", "block");
          } else {
            $(".lgd-guide-nav").removeClass("hidden");
            $(".lgd-guide-nav__content").css();
          }
        }).resize();

      })
    }
  }
})(jQuery, Drupal, once);
