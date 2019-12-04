$(document).ready(function () {
    var db = firebase.firestore();

    //Submit the form
    $("form").submit(function (e) {
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

        //Test in console
        // console.log(firstName + lastName + emailAddress + category + subject);

        $("#form-modal-wrap").show();
        e.preventDefault();
        writeFeedback();
    });

    $("#return-contact-btn").click(function () {
        $("#form-modal-wrap").fadeOut();
        $('input[type="text"], textarea').val('');
    });

});