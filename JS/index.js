$(document).ready(function () {
    // var showMenu = true;
    // var navbarSlideIn = {
    //     "left": "30px",
    //     "easing": "swing",
    //     "opacity": 1
    // };

    // var navbarSlideOut = {
    //     "left": "-300px",
    //     "easing": "swing",
    //     "opacity": 0
    // }

    // $("#mob-navbar-icon").click(function(){  
    //    if(showMenu) {   
    //         $("#mob-navbar-modal").animate(navbarSlideIn, 800);
    //         $(".main-title, .main-content, #read-more-btn").fadeOut();
    //         showMenu = false;
    //     } else {       
    //         $("#mob-navbar-modal").animate(navbarSlideOut, 800);
    //         $(".main-title, .main-content, #read-more-btn").fadeIn();
    //         showMenu = true;
    //     }
    // }); 
console.log("测试");
        //Open the other menu widndow: about us, contact page, our project
        var otherSlideIn = {
            "margin-top": "0",
            "easing": "swing",
            "opacity": "1"
        };
    
        var otherSlideOut = {
            "margin-top": "-100%",
            "easing": "swing",
            "opacity": "0"
        };
    
        $("#mob-navbar-icon").click(function () {
            $("#other-menu-modal-wrap").fadeIn();
        });
    
        $("#close-modal-btn").click(function () {
            $("#other-menu-modal-wrap").fadeOut();
        });

        //Click the logo will jump back to landing page
        $("#logo-icon").click(function() {
            window.location.replace("index.html");
        });

});