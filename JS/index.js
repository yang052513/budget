$(document).ready(function () {
    var showMenu = true;
    var navbarSlideIn = {
        "left": "30px",
        "easing": "swing",
        "opacity": 1
    };

    var navbarSlideOut = {
        "left": "-300px",
        "easing": "swing",
        "opacity": 0
    }

    $("#mob-navbar-icon").click(function(){  
       if(showMenu) {   
            $("#mob-navbar-modal").animate(navbarSlideIn, 800);
            $(".main-title").fadeOut();
            showMenu = false;
        } else {       
            $("#mob-navbar-modal").animate(navbarSlideOut, 800);
            $(".main-title").fadeIn();
            showMenu = true;
        }
    }); 

});