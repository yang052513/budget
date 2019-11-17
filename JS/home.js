$(document).ready(function () {
    var db = firebase.firestore();

    // if the current user logged in user
    // is authenticated, then grab "uid" "displayName" and "email"
    // use "set()" with merge (if document did not exist it will be created)   
    function createUser() {
        firebase.auth().onAuthStateChanged(function (user) {
            db.collection("user")
                .doc(user.uid)
                .set({
                    "name": user.displayName,
                    "email": user.email,
                }, {
                    merge: true
                });

            //Get user name displayed
            db.collection("user").doc(user.uid).onSnapshot(function (snap) {
                document.getElementById("user-name").innerHTML = snap.data().name;
            });

            //Get user stored budget
            db.collection("user").doc(user.uid).onSnapshot(function (snap) {
                document.getElementById("budget_store").innerHTML = "$" + snap.data().BudgetStore;
                document.getElementById("expense_store").innerHTML = "$" + snap.data().ExpenseStore;
                $(".budget_percent_num").html(snap.data().PercentStore + "%");
                $(".water").css({
                    "transform": "translateY(" + snap.data().WaveHeight + "%)"
                });
            });

            var oldFlag = false;
            db.collection("user").doc(user.uid).collection("Expense")
                .get() //get collection of documents
                .then(function (snap) {
                    snap.forEach(function (doc) { //iterate thru collection
                        var oldCategory = doc.data().Category;
                        var oldDate = doc.data().Date;
                        var oldValue = doc.data().Value;
                        var oldNote = doc.data().Description;

                        //Create new Time line Block
                        var oldTimeLineBlock = $("<div></div>");

                        if (!oldFlag) {
                            oldFlag = true;
                            $(oldTimeLineBlock).addClass("timeline-block timeline-block-left");
                        } else {
                            oldFlag = false;
                            $(oldTimeLineBlock).addClass("timeline-block timeline-block-right");
                        }

                        var oldMarker = $("<div class=marker></div>");
                        var oldTimeLineContent = $("<div class=timeline-content></div>");

                        //Create new Timeline details
                        var oldTimeLineTitle = $("<h3 class=category></h3>");
                        oldTimeLineTitle.append(oldCategory, oldValue);

                        var oldTimeLineDate = $("<span class=date></span>");
                        oldTimeLineDate.append(oldDate);

                        var oldTimeLineNote = $("<p class=description></p>");
                        oldTimeLineNote.append(oldNote);

                        oldTimeLineContent.append(oldTimeLineTitle, oldTimeLineDate, oldTimeLineNote);
                        oldTimeLineBlock.append(oldMarker, oldTimeLineContent);

                        $(".timeline-container").append(oldTimeLineBlock);


                    });
                });

        });

    }
    createUser();

    //Create new expense function
    class Expense {
        constructor(category, amount, date, note) {
            this.newCategory = category;
            this.newAmount = amount;
            this.newDate = date;
            this.newNote = note;
        }

        set category(category) {
            this.newCategory = category;
        }

        get category() {
            return this.newCategory;
        }

        set amount(amount) {
            this.newAmount = amount;
        }

        get amount() {
            return this.newAmount;
        }

        set date(date) {
            this.newDate = date;
        }

        get date() {
            return this.newDate;
        }

        set note(note) {
            this.newNote = note;
        }

        get note() {
            return this.newNote;
        }
    }
    //Create new expense item object
    let userExpense = new Expense();

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
        //if budget is 0 an d trying to create new expense: throw error
        if (budgetStore == 0) {
            $("#nobudget-modal").fadeIn();
        } else {
            $("#slideShow").animate(slideIn, 1000);
            $("body").css("overflow", "hidden");
        }
    });

    //Open up the budget setup modal
    $("#home-icon").click(function () {
        $("#setup-budget").fadeIn();
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

    //Choose category event: open expense fill info page
    $(".category-card").click(function () {
        $("#enter-slide").animate(infoSlideIn, 1000);
        $("body").css("overflow", "hidden");
    });

    //Depends on which category being choosed
    $("#food-card").click(function () {
        userExpense.category = "Food: $";
    });

    $("#health-card").click(function () {
        userExpense.category = "Health: $";
    });

    $("#auto-card").click(function () {
        userExpense.category = "Autos: $";
    });

    $("#shopping-card").click(function () {
        userExpense.category = "Clothes: $";
    });

    $("#sport-card").click(function () {
        userExpense.category = "Sports: $";
    });

    $("#education-card").click(function () {
        userExpense.category = "Education: $";
    });

    $("#bill-card").click(function () {
        userExpense.category = "Bill: $";
    });

    $("#other-card").click(function () {
        userExpense.category = "Other: $";
    });

    //go back to category page
    $("#back-btn").click(function () {
        $("#enter-slide").animate(infoSlideOut, 1000);
    });

    //save the new expense: return to home page
    var flag = true;

    var expenseControl = $("#expense_store");
    var expenseList = [];

    $("#save-btn").click(function () {

        //Retrive value from the input type
        userExpense.date = document.getElementById('datepicker').value;
        userExpense.amount = document.getElementById('amount-field').value;
        userExpense.note = document.getElementById('note-field').value;
        expenseList.push(userExpense.amount);

        //Update expenses
        var expenseTotal = 0;
        for (var i in expenseList) {
            expenseTotal += (1 * expenseList[i]);
        }

        //Write total expense to firebase
        firebase.auth().onAuthStateChanged(function (user) {
            db.collection("user")
                .doc(user.uid)
                .set({
                    "ExpenseStore": parseInt(expenseTotal),
                }, {
                    merge: true
                });
        });

        //Write the new expenses
        if (expenseTotal > budgetStore) {
            //Open up the alert modal
            $("#expense-error-modal").css("display", "flex");
            $("#setup-btn-expense").click(function () {
                $("#expense-error-modal").css("display", "none");
            });
            expenseList.pop(); //remove the last value
        } else {

            //Create new Time line Block
            var newTimeLineBlock = $("<div></div>");

            if (!flag) {
                flag = true;
                $(newTimeLineBlock).addClass("timeline-block timeline-block-left");
            } else {
                flag = false;
                $(newTimeLineBlock).addClass("timeline-block timeline-block-right");
            }

            var newMarker = $("<div class=marker></div>");
            var newTimeLineContent = $("<div class=timeline-content></div>");

            //Create new Timeline details
            var newTimeLineTitle = $("<h3 class=category></h3>");
            newTimeLineTitle.append(userExpense.category, userExpense.amount);

            var newTimeLineDate = $("<span class=date></span>");
            newTimeLineDate.append(userExpense.date);

            var newTimeLineNote = $("<p class=description></p>");
            newTimeLineNote.append(userExpense.note);

            newTimeLineContent.append(newTimeLineTitle, newTimeLineDate, newTimeLineNote);
            newTimeLineBlock.append(newMarker, newTimeLineContent);

            $(".timeline-container").prepend(newTimeLineBlock);

            //write the new expense
            $(expenseControl).html("$" + (expenseTotal));

            //Update the percentage
            var updatePercent = (1 - (expenseTotal / budgetStore)) * 100;

            var budgetController = budgetStore;
            budgetController -= expenseTotal;
            // console.log("show expnese" + expenseList);

            var water = $(".water");
            var calPercent = updatePercent * (-1);
            var waveHeight = calPercent + 88;

            $(water).css({
                "transform": "translateY(" + waveHeight + "%)"
            });

            $(".budget_percent_num").html(updatePercent.toFixed(1) + "%");

            //Write total expense to firebase
            firebase.auth().onAuthStateChanged(function (user) {
                db.collection("user")
                    .doc(user.uid)
                    .set({
                        "PercentStore": parseInt(updatePercent),
                        "WaveHeight": parseInt(waveHeight),
                    }, {
                        merge: true
                    });
            });

            //Exit enter slide animation
            $("#enter-slide").animate(infoSlideOut, 1000);
            $("#slideShow").animate(slideOut, 500);
            $("body").css("overflow", "auto");
        }

        //Write the data to firebase, all the value below are gather from UI
        function writeExpenseEvent() {
            var docData = {
                Category: userExpense.category,
                Value: userExpense.amount,
                Date: userExpense.date,
                Description: userExpense.note
            };

            //write to database for user
            firebase.auth().onAuthStateChanged(function (user) {
                db.collection("user").doc(user.uid).collection("Expense").add(docData);
            });
        };

        writeExpenseEvent();
    });

    //Set the budet number
    var budgetStore = 0;
    $("#submit-budget-btn").click(function () {
        var userInput = document.getElementById('user-budget').value;

        if (userInput < 0) {
            alert('Value cannot be negative, change to modal later');
        } else {
            $("#budget_store").html("$" + (userInput / 1));
            $("#setup-budget").fadeOut();
            budgetStore = userInput;
            firebase.auth().onAuthStateChanged(function (user) {
                db.collection("user")
                    .doc(user.uid)
                    .set({
                        "BudgetStore": parseInt(userInput),
                    }, {
                        merge: true
                    });
            });
        }
    });

    //Direct to the setting budget function
    $("#setup-btn-error").click(function () {
        $("#setup-budget").fadeIn();
        $("#nobudget-modal").fadeOut();
    });

    //Manually close the budget window
    $(".budget-cancel").click(function () {
        $("#setup-budget").fadeOut();
    });

    $("#mob-cancel-btn").click(function () {
        $("#setup-budget").fadeOut();
    });

    //Open the other menu widndow
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

    $("#other-icon").click(function () {
        $("#other-menu-modal").animate(otherSlideIn, 1000);
    });

    $("#close-modal-btn").click(function () {
        $("#other-menu-modal").animate(otherSlideOut, 1000);
    });

});