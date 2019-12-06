//Scroll to top button anumation
var scroll_btn = $('#back-to-top-btn');

//If the position of user is under certain position
$(window).scroll(function() {
  if ($(window).scrollTop() > 300) {
    scroll_btn.addClass('show');
  } else {
    scroll_btn.removeClass('show');
  }
});

//When click the scroll btn, return to top
scroll_btn.on('click', function(e) {
  e.preventDefault();
  $('html, body').animate({scrollTop:0}, '300');
});