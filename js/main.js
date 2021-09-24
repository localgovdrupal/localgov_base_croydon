/**
 * @file JS file for the toggling.
 */

 (function (Drupal) {

  Drupal.behaviors.toggleServices = {
    attach: function (context, settings) {
      context = context || document;
      const homeExists = context.querySelectorAll('.path-frontpage');
      const serviceShow = context.querySelectorAll('.services-show');
      const serviceHide = context.querySelectorAll('.services-hide');
      let servicesBlock = context.querySelectorAll('.layout--threecol-33-34-33');
       /* Homepage only - services list show hide */
    if (homeExists) {  
      for (let i = 0; i < servicesBlock.length; i++) {
         if( i > 1) servicesBlock[i].style.display = 'none'
      }
      serviceShow.forEach(serviceShower => {
        serviceShower.addEventListener('click', function() {
            for (let i = 0; i < servicesBlock.length; i++) {
                servicesBlock[i].removeAttribute('style');
            }
            this.style.display = 'none'
          });
        });
      serviceHide.forEach(serviceHider => {
        serviceHider.addEventListener('click', function() {
            for (let i = 0; i < servicesBlock.length; i++) {
              if( i > 1) servicesBlock[i].style.display = 'none'
            }

            for (let i = 0; i < serviceShow.length; i++) {
               if( i > 1) serviceShow[i].style.display = 'block'
            }
          });
        });
      }
    }
  }
}(Drupal));

