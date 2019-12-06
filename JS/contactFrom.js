$(document).ready(function () {
    //Initialize firebase database
    var db = firebase.firestore();

    //Submit the form
    $("form").submit(function (e) {
        //Retrieve feedback value
        var firstName = $("#fname").val();
        var lastName = $("#lname").val();
        var emailAddress = $("#email").val();
        var category = $("#category").val();
        var subject = $("#subject").val();

        //Write the data to firebase, all the value below are gather from UI
        function writeFeedback() {
            var docData = {
                Category: category,
                EmailAddress: emailAddress,
                FirstName: firstName,
                LastName: lastName,
                Subject: subject
            };

            //write to database for feedback
            db.collection("feedback").add(docData);
        };

        $("#form-modal-wrap").show();
        e.preventDefault();
        writeFeedback();
    });

    //Return back to contact page, clear all the input value
    $("#return-contact-btn").click(function () {
        $("#form-modal-wrap").fadeOut();
        $('input[type="text"], textarea').val('');
    });

});