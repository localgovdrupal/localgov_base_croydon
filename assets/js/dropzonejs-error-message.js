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
              // Check if the file added to DropZone triggers an error message.
              if (node.nodeName === "DIV" && node.childNodes.hasOwnProperty(7) &&node.childNodes[7].childNodes[0].innerHTML !== "") {

                // Detect the dynmically created DIV that contains the error messsage
                let file_has_error = node.childNodes[7].innerText;

                var error_messages = [file_has_error];

                // DIV within the dropsonetemplate that will contain the the error message
                var pageTemplateDivId = document.getElementById("dz-static-error");

                // Adds the error message to the top of the dropzone
                pageTemplateDivId.innerHTML += file_has_error + "</br>";

                // Prevent moving forward or submitting the
                // form if there is a file upload error
                $('.form-submit').prop('disabled', true);


                //console.log(error_messages);
              }
            }
          } else if (mutation.type === "attributes") {
            console.log( `The ${mutation.attributeName} attribute was modified.`);
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
