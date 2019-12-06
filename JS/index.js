//Common js for index, contact, about, project page
$(document).ready(function () {

    console.log("Test my js");

    //Open up the menu
    $("#mob-navbar-icon").click(function () {
        $("#other-menu-modal-wrap").fadeIn();
    });

    //Close the menu
    $("#close-modal-btn").click(function () {
        $("#other-menu-modal-wrap").fadeOut();
    });

    //Click the logo will jump back to landing page
    $("#logo-icon").click(function () {
        window.location.replace("index.html");
    });

});