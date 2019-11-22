$(document).ready(function() {
    
    // $("#submit-btn").click(function() {
    //     $("#form-modal-wrap").fadeIn();
    // });


    $("form").submit(function(e) {
        $("#form-modal-wrap").show();
        e.preventDefault();

    });

    $("#return-contact-btn").click(function() {
        $("#form-modal-wrap").fadeOut();
        $('input[type="text"], textarea').val('');
    });
    
});