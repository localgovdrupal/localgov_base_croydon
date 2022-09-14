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

        /*Subsites nav*/
        $('.block-localgov-subsite-navigation').on( "click", "h3", function() {
          $('.block-localgov-subsite-navigation h3').toggleClass('menu-shown');
          $('.menu-item').toggleClass('menu-item--show');
        });
      })
    }
  }
})(jQuery, Drupal, once);
