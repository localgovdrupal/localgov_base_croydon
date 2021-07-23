/**
 * @file JS file for the toggling.
 */

 (function toggleScript(Drupal) {

 	alert('waa9');

  Drupal.behaviors.toggleContent = {
    attach(context) {
      context = context || document;
      const toggleContentElement = context.querySelectorAll('.toggle');
      if (!toggleContentElement.length) {
        //return;
        alert('waa');
      }
    }
  }
}(Drupal));