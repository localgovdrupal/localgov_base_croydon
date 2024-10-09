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

      // Maximun number of file uploads
      const maxFileUploads = settings.dropzonejs.instances["edit-documents"].maxFiles;

      var error_messages = [];

      // Callback function to execute when mutations are observed
      const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
          if (mutation.type === "childList") {
            for (const node of mutation.addedNodes) {
              // Check if the file added to DropZone triggers an error message.
              if (node.nodeName === "DIV" && node.childNodes.hasOwnProperty(7) && node.childNodes[7].childNodes[0].innerHTML !== "") {

                // Detect the dynmically created file preview divs
                // that contain the error messsages
                let file_has_error = node.childNodes[7].innerText;

                error_messages.push(file_has_error);

               // console.log(error_messages);

              }

            }
          } else if (mutation.type === "attributes") {
            console.log( `The ${mutation.attributeName} attribute was modified.`);
          }
          // If there are no file upload errors we clear down
          // any previous error messages and error styling
          // from the dropszone
          if ($('#edit-documents').has('div.dz-success.dz-complete').length != 0 &&
            (!$('#edit-documents').has('div.dz-error.dz-complete').length != 0)) {

            // No Upload Errors
            // Remove the form-item--error styling which presents as
            // the vertical red msrgin arround the field
            $('#edit-documents').parent('div').removeClass("form-item--error");

            // Remove error wording from
            // dz-static-error div
            $('#dz-static-error').html("");

            // Remove error wording from
            $('.form-item--error-message').html("");

            $('#edit-documents').removeClass("error");

            // Disable the next nd submit button
            $('input.form-submit[type="submit"]').prop('disabled', false);
          }

          //
          if($('#edit-documents').has('div.dz-error.dz-complete').length != 0) {
            // There are Upload Errors
            // Add the last error message to the dz-static-error div top of the  dropzone
            pageTemplateDivId.innerHTML = error_messages.slice(-1) + "</br>";

            // Add error styling to paarent DIV form-item
            $('#edit-documents').parent('div').addClass("form-item--error");

            // Because there are file upload errors,
            // disable the next and submit button so the files cannot be uploaded
            $('input.form-submit[type="submit"]').prop('disabled', true);

          }

          // Reset the dz-static-error div
          // because the dropzone is empty
          if(!$('#edit-documents').has('div.dz-preview').length != 0) {
          // No Files Uploaded yet
            $('#dz-static-error').html("");
          }

          // If we have reached the maximum number of file uploads allowed
          // we need to place that error message in the
          // dz-static-error div and add some errror styling
          if ($('#edit-documents').hasClass('dz-max-files-reached')) {
          // File Upload limit reached

            // Clear down the previous error message
            $('.form-item--error-message').html("");

            // Add error styling to paarent DIV form-item
            $('#edit-documents').parent('div').addClass("form-item--error");

            pageTemplateDivId.innerHTML = error_messages.slice(-1) + "</br>";

          }

          if ($('#edit-documents').hasClass('dz-max-files-reached') &&  $('#edit-documents').parent('div').has("form-item--error")) {
          // Max file upload reached

            $('#dz-static-error').html("");
            pageTemplateDivId.innerHTML = "You have reached the maximum file upload limit" + "</br>";

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
