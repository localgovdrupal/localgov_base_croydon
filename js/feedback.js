(function ($) {
  $(document).ready(function () {

  	alert('fff');
    // open the feedback form in the footer if on the website-feedbak page
    if (window.location.href.indexOf("website-feedback") > -1) {
      setTimeout(function() { $('.reveal:first-child').click(); }, 100);
      $('#sidebar-second').hide();
      $('#content').hide();
    }


})(jQuery);