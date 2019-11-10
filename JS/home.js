$(document).ready(function () {

    //Category slide in animation
    var slideIn = {
        "margin-top": "0px",
        "easing": "swing",
        "opacity": "1"
    };

    //Category slide out animation
    var slideOut = {
        "margin-top": "-1500px",
        "easing": "swing",
        "opacity": "0"
    };

    //Expense Details Slide in: open category page
    $("#create-icon").click(function () {
        $("#slideShow").animate(slideIn, 1000);
        $("body").css("overflow", "hidden");
    });

    //Expense Details Slide out: return to home page
    $("#cancel-btn").click(function () {
        $("#slideShow").animate(slideOut, 1000);
        $("body").css("overflow", "auto");
    });

    //Details Page Slide in animation
    var infoSlideIn = {
        "margin-left": "0px",
        "easing": "swing",
        "opacity": "1"
    };
    
    //Details page slide out animation
    var infoSlideOut = {
        "margin-left": "-100%",
        "easing": "swing",
        "opacity": "0"
    };

    //After save jump to home stage animation
    var saveExpense = {
        "margin-top": "-100%",
        "easing": "swing",
        "opacity": "0"
    };

    //next button event: open expense fill info page
    $("#next-btn").click(function () {
        $("#enter-slide").animate(infoSlideIn, 1000);
        $("body").css("overflow", "hidden");
    });

    //go back to category page
    $("#back-btn").click(function () {
        $("#enter-slide").animate(infoSlideOut, 1000);
    });

    //save the new expense: return to home page
    $("#save-btn").click(function() {
        $("#enter-slide").animate(infoSlideOut, 1000);
        $("#slideShow").animate(slideOut, 500);
        $("body").css("overflow", "auto");
    });

    $("#home-icon").click(function() {
        $("html, body").animate({scrollTop: 0}, "fast");
    });

});