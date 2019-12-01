$(document).ready(function () {
    //Initialize firebase database
    var db = firebase.firestore();

    //Initialize budget and expense number
    var budgetStore = 0;
    var expenseUpdate = 0;
    var balanceUpdate = 0;

    //Merge user name and email to firebase
    firebase.auth().onAuthStateChanged(function (user) {
        db.collection("user")
            .doc(user.uid)
            .set({
                "name": user.displayName,
                "email": user.email,
            }, {
                merge: true
            });

        //Display user name on the home pgae
        db.collection("user").doc(user.uid).onSnapshot(function (snap) {
            document.getElementById("user-name").innerHTML = snap.data().name;
        });

        //Pull the budget and expense data from firebase
        db.collection("user").doc(user.uid).onSnapshot(function (snap) {
            //When budget > 0 which has previous data, readold data
            if (snap.data().BudgetStore > 0) {
                document.getElementById("budget_store").innerHTML = "$" + snap.data().BudgetStore;
                budgetStore = snap.data().BudgetStore;
                console.log("我有多少钱" + budgetStore);
                //If budget < 0 in firebase, initialize with 0
            } else {
                document.getElementById("budget_store").innerHTML = "$" + 0;
            }

            //When expense > 0 which has previous data, read previous data
            if (snap.data().ExpenseStore > 0) {
                document.getElementById("expense_store").innerHTML = "$" + snap.data().ExpenseStore;
                expenseUpdate = snap.data().ExpenseStore;
                console.log("我花了多少钱" + expenseUpdate);
                //If expense < 0 in firebase, initialize with 0
            } else {
                document.getElementById("expense_store").innerHTML = "$" + 0;
            }

            //When balance > 0 which has previous data, read previous data
            if (snap.data().BalanceStore > 0) {
                document.getElementById("balance_store").innerHTML = "$" + snap.data().BalanceStore;
                balanceUpdate = snap.data().BalanceStore;
                console.log("我还剩多少钱" + balanceUpdate);
                //If balance < 0 in firebase, initialize with 0
            } else {
                document.getElementById("balance_store").innerHTML = "$" + 0;
            }

            //If the percentage > 0, read previous data from firebase
            if (snap.data().PercentStore > 0) {
                $(".budget_percent_num").html(snap.data().PercentStore + "%");
                $(".water").css({
                    "transform": "translateY(" + snap.data().WaveHeight + "%)"
                });

                //If the percentage <= 0, initialize with 0
            } else {
                $(".budget_percent_num").html(100 + "%");
                $(".water").css({
                    "transform": "translateY(" + snap.data().WaveHeight + "%)"
                });
            }
        });

        //Append user expense item from firebase

        //Determine whether the item is left or right float
        var oldFlag = false;

        //Get all user past expense, order by Date from the newest to the oldest
        db.collection("user").doc(user.uid).collection("Expense").orderBy("Date", "desc")
            .get()
            .then(function (snap) {
                snap.forEach(function (doc) { //iterate thru collection
                    var oldCategory = doc.data().Category;
                    var oldDate = doc.data().Date;
                    var oldValue = doc.data().Value;
                    var oldNote = doc.data().Description;

                    //Read the old time line Block
                    var oldTimeLineBlock = $("<div></div>");

                    if (!oldFlag) {
                        oldFlag = true;
                        $(oldTimeLineBlock).addClass("timeline-block timeline-block-left");
                    } else {
                        oldFlag = false;
                        $(oldTimeLineBlock).addClass("timeline-block timeline-block-right");
                    }

                    //Creare new marker and content container
                    var oldMarker = $("<div class=marker></div>");
                    var oldTimeLineContent = $("<div class=timeline-content></div>");

                    //Create new Timeline details
                    var oldTimeLineTitle = $("<h3 class=category></h3>");
                    oldTimeLineTitle.append(oldCategory, oldValue);

                    //Create new data span
                    var oldTimeLineDate = $("<span class=date></span>");
                    oldTimeLineDate.append(oldDate);

                    //Create new note for the description
                    var oldTimeLineNote = $("<p class=description></p>");
                    oldTimeLineNote.append(oldNote);

                    //Append all the data pulled from firebase to the html page
                    oldTimeLineContent.append(oldTimeLineTitle, oldTimeLineDate, oldTimeLineNote);
                    oldTimeLineBlock.append(oldMarker, oldTimeLineContent);
                    $(".timeline-container").append(oldTimeLineBlock);
                });
            });
    });

    //Create new expense class
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


    ///////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////// 
    //save the new expense function: return to home page
    var flag = true;

    var expenseControl = $("#expense_store");

    //expense array list, hold the expense amount values
    var expenseList = [];

    //User click the save expense button
    $("#save-btn").click(function () {
        //Retrive value from the input type
        userExpense.date = document.getElementById('datepicker').value;
        userExpense.amount = document.getElementById('amount-field').value;
        userExpense.note = document.getElementById('note-field').value;

        //If the expense entered is less than 0 or empty value
        //之后有时间可以换成别的modal
        if (userExpense.amount < 0 || userExpense.amount == '' || userExpense.date == '' || userExpense.note == '') {
            $("#invalid-expense-modal").fadeIn();
            console.log('You forgot fill some fields');

            //Return back to enter page
            $("#invalid-expense-btn").click(function () {
                $("#invalid-expense-modal").fadeOut();
            });

            //If the expense is valid
        } else {
            //push the expense to the array and store the value
            expenseList.push(userExpense.amount);

            //Update expenses if greater than 0
            if (expenseUpdate > 0) {
                var expenseTotal = expenseUpdate;
            } else {
                expenseTotal = 0;
            }
            var expenseTotal = expenseUpdate;
            for (var i in expenseList) {
                expenseTotal += (1 * expenseList[i]);
                expenseList.shift();
            }
            console.log(expenseList);

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
                newTimeLineTitle.append(userExpense.category, parseFloat(userExpense.amount).toFixed(2));

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
                console.log('我还剩多少钱：' + budgetController);
                $("#balance_store").html("$" + (budgetController));

                //Update the water animation effect
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
                            "ExpenseStore": parseInt(expenseTotal),
                            "BalanceStore": parseInt(budgetController),
                        }, {
                            merge: true
                        });
                });

                //Exit enter slide animation
                $("#slideShow").animate(slideOut, 1000);
                $("#enter-slide").animate(infoSlideOut, 1000);
                $("body").css("overflow", "auto");

                //Write the data to firebase, all the value below are gather from UI
                function writeExpenseEvent() {
                    var docData = {
                        Category: userExpense.category,
                        Value: parseFloat(userExpense.amount).toFixed(2),
                        Date: userExpense.date,
                        Description: userExpense.note
                    };

                    //write to database for user
                    firebase.auth().onAuthStateChanged(function (user) {
                        db.collection("user").doc(user.uid).collection("Expense").add(docData);
                    });
                };

                writeExpenseEvent();
                $('input, textarea').val('');
            }


        }
    });

    //Set the budget number
    $("#submit-budget-btn").click(function () {

        var userInput = document.getElementById('user-budget').value;
        //If set the budget less or equal to 0
        if (userInput <= 0) {
            //pop up the warning modal
            console.log('Value cannot be negative or zero!');
            $("#budget-zero-modal").fadeIn();

            //click return back to budget setting modal
            $("#zero-budget-btn-expense").click(function () {
                $("#budget-zero-modal").fadeOut();
            });

            //If budget number is too large
        } else if (userInput > 10000) {
            //pop up the too rich modal 
            console.log('You are too rich!');
            $("#large-budget-modal").fadeIn();

            //click return back to budget setting modal
            $("#large-budget-btn").click(function () {
                $("#large-budget-modal").fadeOut();
            });

            //If set the budget less or equal to expense
        } else if (userInput < expenseUpdate) {
            console.log('The Budget is less than the expense, try it again!');
            $("#budget-less-expense-modal").fadeIn();

            //click return back to budget setting modal
            $("#budget-less-expense-btn").click(function () {
                $("#budget-less-expense-modal").fadeOut();
            });

            //If budget is greater than expense and not 0
        } else {
            $("#budget_store").html("$" + (userInput / 1));
            $("#setup-budget").fadeOut();
            budgetStore = userInput;

            firebase.auth().onAuthStateChanged(function (user) {
                db.collection("user").doc(user.uid).onSnapshot(function (snap) {
                    var expenseRefresh = snap.data().ExpenseStore;
                    var budgetRefresh = snap.data().BudgetStore;
                    var balanceRefresh = snap.data().BalanceStore;

                    var newBalance = budgetRefresh - expenseRefresh;

                    //Refresh the percentage
                    var newPercent = (1 - (expenseRefresh / budgetRefresh)) * 100;

                    if (expenseRefresh > 0) {
                        $(".budget_percent_num").html(newPercent.toFixed(1) + "%");
                    }

                    if (balanceRefresh > 0) {
                        $("#balance_store").html("$" + newBalance);
                    }

                    var newHeight = (newPercent * (-1)) + 88;
                    $(".water").css({
                        "transform": "translateY(" + newHeight + "%)"
                    });

                    db.collection("user").doc(user.uid).update({
                        "PercentStore": parseInt(newPercent)
                    });

                    db.collection("user").doc(user.uid).update({
                        "WaveHeight": parseInt(newHeight)
                    });
                });

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

    //Open the other menu widndow: about us, contact page, our project
    // var otherSlideIn = {
    //     "margin-top": "0",
    //     "easing": "swing",
    //     "opacity": "1"
    // };

    // var otherSlideOut = {
    //     "margin-top": "-100%",
    //     "easing": "swing",
    //     "opacity": "0"
    // };

    $("#other-icon").click(function () {
        // $("#other-menu-modal").animate(otherSlideIn, 1000);
        $("#tool-box-modal").fadeIn();
    });

    $("#return-tool").click(function () {
        $("#tool-box-modal").fadeOut();
    });

    //Expense Details Slide in: open category page
    $("#create-icon").click(function () {
        //if budget is 0 and trying to create new expense: throw error
        if (budgetStore == 0) {
            $("#nobudget-modal").fadeIn();
        } else {
            $("#slideShow").animate(slideIn, 1000);
            $("body").css("overflow", "hidden");
        }
    });

    //Reset all the budget, expense, and balance
    $("#reset-tool").click(function () {
        firebase.auth().onAuthStateChanged(function (user) {

            var resetWaveHeight = 100 * (-1) + 88;

            $(".water").css({
                "transform": "translateY(" + resetWaveHeight + "%)"
            });

            $(".budget_percent_num").html(100 + "%");

            db.collection("user")
                .doc(user.uid)
                .set({
                    "PercentStore": 100,
                    "WaveHeight": parseInt(resetWaveHeight),
                    "BudgetStore": 0,
                    "ExpenseStore": 0,
                    "BalanceStore": 0,
                }, {
                    merge: true
                });

                // db.collection("user").doc(user.uid).delete();
                // $(".timeline-content, .marker").remove();
                location.reload();
        });

       
    });

    //Different nav bar color for warning
    firebase.auth().onAuthStateChanged(function (user) {
        db.collection("user").doc(user.uid).onSnapshot(function (snap) {
            console.log(snap.data().PercentStore);
            // 75% - 100%
            if (snap.data().PercentStore <=100 && snap.data().PercentStore >= 75) {
                $("#header-wrap").css("background-color", "rgb(0, 153, 204)");
            // 50% - 75%
            } else if (snap.data().PercentStore >= 50 && snap.data().PercentStore < 75) {
                $("#header-wrap").css("background-color", "rgb(0, 190, 204)");
            // 25% - 50%
            } else if (snap.data().PercentStore < 50 && snap.data().PercentStore >= 25) {
                $("#header-wrap").css("background-color", "rgb(240, 218, 91)");
            // < 25%
            } else if (snap.data().PercentStore < 25) {
                $("#header-wrap").css("background-color", "rgb(204, 14, 0)");
            }
        });
    });

});