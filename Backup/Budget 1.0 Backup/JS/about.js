$(document).ready(function() {
   $("#yang, #read-more-yang-btn").click(function() {
        $("#yang-modal-wrap").fadeIn();
   });

   $(".team-modal").click(function() {
        $("#yang-modal-wrap").fadeOut();
   });

   $("#jonny, #read-more-jonny-btn").click(function() {
    $("#jonny-modal-wrap").fadeIn();
});

$(".team-modal").click(function() {
    $("#jonny-modal-wrap").fadeOut();
});
    
});