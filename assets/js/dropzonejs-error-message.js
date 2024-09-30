/**
 * @file
 * Gull site specific behaviors.
 */
(function ($, Drupal, once) {
  "use strict";

  Drupal.behaviors.DropZoneErrorMessage = {
    attach(context, settings) {

    // Select the node that will be observed for mutations
    const targetNode = document.getElementById("edit-documents");

    // Options for the observer (which mutations to observe)
    const config = { attributes: false, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = (mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type === "childList") {

          for (const node of mutation.addedNodes) {
            // Check if the added node is the one that contain the error message.
            if (node.nodeName === 'DIV' && node.childNodes.hasOwnProperty(7)) {

              let error_message = node.childNodes[7].innerText;

              var dz_static_error = document.getElementById('dz-static-error');

              dz_static_error.innerHTML += error_message;
              console.log(error_message);


            }
          }


        } else if (mutation.type === "attributes") {
          console.log(`The ${mutation.attributeName} attribute was modified.`);
        }
      }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

    // Later, you can stop observing
  //  observer.disconnect();



    },
  };
})(jQuery, Drupal, once);
