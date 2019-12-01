$(document).ready(function() {

    var darkMode = false;

    $("#dark-mode-icon").click(function() {
        if (!darkMode) {
        $("#mode-content").html("Light Mode");
        $("#mode-content-sub").html("Enable the light mode on your screen");
        $("body").css("background-color", "#121212");
        $("#welcome-user").css("color", "white");
        $(".timeline-content ").css("background-color", "white");
        $("#header-wrap").css("background-color", "white");
        $("#header-wrap").css("color", "#121212");
        $("#slideShow, #enter-slide").css("background-color", "#121212");
        $(".section-title").css("background-color", "white");
        $(".section-title").css("color", "#121212");
        $("label").css("color", "white");
        $("#back-to-top-btn").css("background-color", "rgb(50, 50, 50)");

        darkMode = true;
        } else {
            $("#mode-content").html("Dark Mode");
            $("#mode-content-sub").html("Enable the dark mode on your screen");
            $("body").css("background-color", "#e9f0f5");
            $("#welcome-user").css("color", "black");
            $(".timeline-content ").css("background-color", "#ace2ff");
            $("#header-wrap").css("background-color", "rgba(0, 153, 204, 1)");
            $("#header-wrap").css("color", "white");
            $("#slideShow, #enter-slide").css("background-color", "white");
            $(".section-title").css("background-color", "#09C");
            $(".section-title").css("color", "white");
            $("label").css("color", "#09C");
            $("#back-to-top-btn").css("background-color", "rgb(34, 146, 187)");
            darkMode = false;
        }
    });

    $("#home-tool").click(function() {
        window.open("index.html");
    });

    $("#contact-tool").click(function() {
        window.open("contact.html");
    });

    $("#project-tool").click(function() {
        window.open("Ourproject.html");
    });
});