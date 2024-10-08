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

      // DIV within the dropsonetemplate that will contain the the error message
      const pageTemplateDivId = document.getElementById("dz-static-error");

      var error_messages = [];



      // Callback function to execute when mutations are observed
      const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
          if (mutation.type === "childList") {
            for (const node of mutation.addedNodes) {
              // Check if the file added to DropZone triggers an error message.
              if (node.nodeName === "DIV" && node.childNodes.hasOwnProperty(7) &&node.childNodes[7].childNodes[0].innerHTML !== "") {

                // Detect the dynmically created DIV that contains the error messsage
                let file_has_error = node.childNodes[7].innerText;

                error_messages.push(file_has_error);


                // Adds the last error message to the top of the dropzone
                pageTemplateDivId.innerHTML = error_messages.slice(-1) + "</br>";

                // Add error styling to paarent DIV form-item
                $('#edit-documents').parent('div').addClass("form-item--error");

                // Disable the Next
                $('input.form-submit[type="submit"]').prop('disabled', true);

                console.log(error_messages);


                // // Dropzone edit document Div
                // $('#edit-documents').addClass('error');

                // Prevent moving forward or submitting the
                // form if there are file upload errors;
              }
            }
          } else if (mutation.type === "attributes") {
            console.log( `The ${mutation.attributeName} attribute was modified.`);
          }

          if ($('#edit-documents').has('div.dz-success.dz-complete').length != 0 &&
            (!$('#edit-documents').has('div.dz-error.dz-complete').length != 0)) {
            console.log("No Upload Errors");
            // Remove error styling
            $('#dz-static-error').html("");

            $('.form-item--error-message').html("");

            $('#edit-documents').removeClass("error");

            $('#edit-documents').parent('div').removeClass("form-item--error");

            $('input.form-submit[type="submit"]').prop('disabled', false);
          }

          if($('#edit-documents').has('div.dz-error.dz-complete').length != 0) {
            console.log("There are Upload Errors");

            // Disable the next page or submit button
            // $('form-submit').prop('disabled', true);


          }

          if(!$('#edit-documents').has('div.dz-preview').length != 0) {
            console.log("No Files Uploaded yet");
            $('#dz-static-error').html("");
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
