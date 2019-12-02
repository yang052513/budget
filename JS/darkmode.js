$(document).ready(function () {

    function DarkMode() {
        var darkMode = false;
        //Primary color: #121212
        //Secondary color on surface: #393838
        //Title text color: rgb(34, 146, 187)
        //Normal text: rgba(255, 255, 255, 0.7

        $("#dark-mode-icon").click(function () {
            if (!darkMode) {
                $("#mode-content").html("Light Mode");
                $("#mode-content-sub").html("Enable the light mode on your screen");
                $("body").css("background-color", "#121212");
                $("#welcome-user").css("color", "white");
                $("#header-wrap").css("background-color", "#393838");
                $("#header-wrap").css("color", "white");
                $("#slideShow, #enter-slide").css("background-color", "#121212");
                $(".section-title").css("background-color", "#393838");
                $(".section-title").css("color", "rgba(255, 255, 255, 0.7");
                $("label").css("color", "white");
                $("#back-to-top-btn").css("background-color", "rgb(50, 50, 50)");
                $("#tool-box-content").css("background-color", "#121212");
                $(".tool-box-content").css("color", "white");
                $("#setup-budget-content").css("background-color", "#121212");
                $(".warning-modal").css("background-color", "#121212");
                $(".warning-modal-text").css("color", "white");

                $(".timeline-content").css("background-color", "#393838");
                $(".timeline-content").css("color", "rgba(255, 255, 255, 0.8");
                $(".marker").css("background", "#393838");
                
                $(".mob-nav-bar").css("background-color", "#393838");
                $(".mob-nav-text").css("color", "rgb(34, 146, 187)");
                $(".wave-fill").css("background", "#202020");
                $("#welcome-user").css("color", "rgb(34, 146, 187)");
                $(".category-card").css("background-color", "#393838");
                $(".category-card").css("filter", "none");
                $(".category").css("color", "rgb(34, 146, 187)");

                $(".category-card").mouseover(function () {
                    $(this).css("background-color", "rgba(255, 255, 255, 0.5");
                });
                $(".category-card").mouseleave(function () {
                    $(this).css("background-color", "#393838");
                });

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
                $("#tool-box-content").css("background-color", "white");
                $(".tool-box-content").css("color", "black");
                $("#setup-budget-content").css("background-color", "white");
                $(".warning-modal").css("background-color", "white");
                $(".warning-modal-text").css("color", "black");
                $(".timeline-content").css("background-color", "#ace2ff");
                $(".timeline-content").css("color", "#666");
                $(".mob-nav-bar").css("background-color", "white");
                $(".mob-nav-text").css("color", "rgb(109, 109, 109)");
                $(".marker").css("background", "rgb(34, 146, 187)");
                $(".wave-fill").css("background", "white");
                $("#welcome-user").css("color", "black");
                $(".category-card").css("background-color", "white");
                $(".category-card").css("filter", "drop-shadow(2px 2px 2px #676666)");
                $(".category-card").mouseover(function () {
                    $(this).css("background-color", "rgb(48, 179, 223)");
                });
                $(".category-card").mouseleave(function () {
                    $(this).css("background-color", "white");
                });
                $(".category").css("color", "rgb(91, 91, 91)");
                darkMode = false;
            }
        });

        $("#home-tool").click(function () {
            window.open("about.html");
        });

        $("#contact-tool").click(function () {
            window.open("contact.html");
        });

        $("#project-tool").click(function () {
            window.open("Ourproject.html");
        });
    }

    DarkMode();

});