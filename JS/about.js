$(document).ready(function () {
     //When user click yang
     $("#yang, #read-more-yang-btn").click(function () {
          $("#yang-modal-wrap").fadeIn();
     });

     //When user click outside yang modal
     $(".team-modal").click(function () {
          $("#yang-modal-wrap").fadeOut();
     });

     //When user click jonny
     $("#jonny, #read-more-jonny-btn").click(function () {
          $("#jonny-modal-wrap").fadeIn();
     });

     //When user click outside jonny modal
     $(".team-modal").click(function () {
          $("#jonny-modal-wrap").fadeOut();
     });

});