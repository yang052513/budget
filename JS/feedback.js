$(document).ready(function () {
    //Initialize firebase database
    var db = firebase.firestore();

    //Get all user past expense, order by Date from the newest to the oldest
    db.collection("feedback").get().then(function (snap) {
        snap.forEach(function(doc) {
            var category = doc.data().Category;
            var email = doc.data().EmailAddress;
            var fname = doc.data().FirstName;
            var lname = doc.data().LastName;
            var subject = doc.data().Subject;

            var info_modal = $("<div class=info-modal></div>");
            var category_sec = $(" <p><span class=info-title>Category: </span><span class=category>" + category + "</span></p>");
            var name_sec = $("<p><span class=info-title>Name: </span><span class=name>" + fname + lname + "</span></p>");
            var email_sec = $("<p><span class=info-title>Email: </span><span class=email>" + email + "</span></p>");
            var subject_sec = $("<p><span class=info-title>Subject: </span><span class=subject>" + subject + "</span></p>");

            info_modal.append(category_sec, name_sec, email_sec, subject_sec);
            $(".container").append(info_modal);
        });
    });
    
});