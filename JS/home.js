$(document).ready(function () {
    //Initialize firebase database
    var db = firebase.firestore();

    //Initialize budget and expense number
    var budgetStore = 0;
    var expenseUpdate = 0;
    var balanceUpdate = 0;

    //Generate time obeject with 24 hour format
    var today = new Date();
    var time = today.getHours();
    var date = today.getDate();
    console.log("What day is today?" + date);

    //Show different welcome message regarding current time
    if (time > 5 && time <= 11) {
        $("#time-welcome").html("Good morning!");
    } else if (time > 11 && time <= 15) {
        $("#time-welcome").html("Good afternoon!");
    } else if (time > 15 && time <= 18) {
        $("#time-welcome").html("How's your day?");
    } else if (time > 18 && time <= 21) {
        $("#time-welcome").html("Good evening!");
    } else if (time > 21 && time <= 23) {
        $("#time-welcome").html("Good night~");
    } else {
        $("#time-welcome").html("Sleep is important!");
    }

    //Merge user name and email to firebase
    firebase.auth().onAuthStateChanged(function (user) {
        db.collection("user")
            .doc(user.uid)
            .set({
                "name": user.displayName,
                "email": user.email,
                "darkMode": false,
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
                console.log("My goal budget: " + budgetStore);

                //If budget < 0 in firebase, initialize with 0
            } else {
                document.getElementById("budget_store").innerHTML = "$" + 0;
            }

            //When expense > 0 which has previous data, read previous data
            if (snap.data().ExpenseStore > 0) {
                document.getElementById("expense_store").innerHTML = "$" + snap.data().ExpenseStore;
                expenseUpdate = snap.data().ExpenseStore;
                console.log("How much I spent" + expenseUpdate);

                //If expense < 0 in firebase, initialize with 0
            } else {
                document.getElementById("expense_store").innerHTML = "$" + 0;
            }

            //When balance > 0 which has previous data, read previous data
            if (snap.data().BalanceStore > 0 && snap.data().BudgetStore > 0) {
                document.getElementById("balance_store").innerHTML = "$" + snap.data().BalanceStore;
                balanceUpdate = snap.data().BalanceStore;
                console.log("How much is available?" + balanceUpdate);

                //If balance < 0 in firebase, initialize available with 0
            } else {
                document.getElementById("balance_store").innerHTML = "$" + 0;
            }

            //Total days minus current date = how many days left
            var daysOut = snap.data().TotalDays - date;

            //If days left greater than 0, write the data to html
            if (daysOut > 0) {
                //How many days out for the budget
                $("#date-left").html(daysOut + " days left, ");
                $("#motivation").html("Keep it up!");

                console.log("我还剩多少穷日子" + snap.data().Duration);
                console.log("我目标的天数" + snap.data().TotalDays);

                //If days left < 0 in firebase, initialize with 0之后换成modal 百分比相对应的文字提示
            } else {
                // document.getElementById("date-left").innerHTML = 0;
                //Do nothing
            }

            //days meet deadline, have some budget store value, and expense is valid
            if (daysOut == 0 && snap.data().BudgetStore >= 0 && snap.data().ExpenseStore >= 0) {
                document.getElementById("motivation").innerHTML = "Congratulation! You achieve your goal!";
            }

            //budget store > 0, expense > 0, but spend all the money
            if (snap.data().BudgetStore > 0 && snap.data().ExpenseStore > 0 && snap.data().PercentStore == 0) {
                $("#date-left").html('');
                document.getElementById("motivation").innerHTML = "Maybe save a bit more next time!";
            }

            //If the percentage > 0, read previous data from firebase
            if (snap.data().PercentStore >= 0) {
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

        ///////Append user old expense item data to firebase///////////
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

                    //Read the old time line Block & create element
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

        //Setter and getter of expense class
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

    //Category slide in animation variable
    var slideIn = {
        "margin-top": "0px",
        "easing": "swing",
        "opacity": "1"
    };

    //Category slide out animation variable
    var slideOut = {
        "margin-top": "-1500px",
        "easing": "swing",
        "opacity": "0"
    };

    //Click the setup budget icon: open up the budget setup modal
    $("#home-icon").click(function () {
        firebase.auth().onAuthStateChanged(function (user) {
            db.collection("user").doc(user.uid).get().then(function (doc) {
                //If available = 0, expense, and budget > 0 in firebse: no money left
                if (doc.data().BalanceStore == 0 && doc.data().ExpenseStore > 0 && doc.data().BudgetStore > 0) {
                    //Open the reset modal
                    $("#reset-journey-modal").fadeIn();
                    //Reset budget button
                    $("#reset-journey-btn").click(function () {
                        //Call the reset function
                        resetBudget();
                    });
                    //Open up the setup budget number modal
                } else {
                    $("#setup-budget").fadeIn();
                }
            });
        });
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

    //When user choose food category: category = food
    $("#food-card").click(function () {
        userExpense.category = "Food: $";
    });

    //When user choose food category: category = health
    $("#health-card").click(function () {
        userExpense.category = "Health: $";
    });

    //When user choose food category: category = auto
    $("#auto-card").click(function () {
        userExpense.category = "Autos: $";
    });

    //When user choose food category: category = clothes
    $("#shopping-card").click(function () {
        userExpense.category = "Clothes: $";
    });

    //When user choose food category: category = sports
    $("#sport-card").click(function () {
        userExpense.category = "Sports: $";
    });

    //When user choose food category: category = eudcation
    $("#education-card").click(function () {
        userExpense.category = "Education: $";
    });

    //When user choose food category: category = bills
    $("#bill-card").click(function () {
        userExpense.category = "Bill: $";
    });

    //When user choose food category: category = other
    $("#other-card").click(function () {
        userExpense.category = "Other: $";
    });

    //Click the back button: go back to category page
    $("#back-btn").click(function () {
        $("#enter-slide").animate(infoSlideOut, 1000);
    });

    /////////Save the expense function section////////////////
    //save the new expense function: return to home page

    //Decide the expense item whether left or right
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
        if (userExpense.amount < 0) {
            $("#invalid-expense-modal").fadeIn();
            console.log('You forgot fill some fields');

            //Return back to enter page
            $("#invalid-expense-btn").click(function () {
                $("#invalid-expense-modal").fadeOut();
            });

            //If the expense input is empty value or equal to 0
        } else if (userExpense.amount == '' || userExpense.amount == 0) {
            $("#zero-amount-modal").fadeIn();
            console.log('Nothing is free');

            //Return back to enter page
            $("#zero-amount-btn").click(function () {
                $("#zero-amount-modal").fadeOut();
            });

            //If the expense note section is empty value
        } else if (userExpense.note == '') {
            $("#no-note-modal").fadeIn();
            console.log('What did you buy');

            //Return back to enter page
            $("#no-note-btn").click(function () {
                $("#no-note-modal").fadeOut();
            });

            //If the expense date section is empty value
        } else if (userExpense.date == '') {
            $("#no-date-modal").fadeIn();
            console.log('When tho');

            //Return back to enter page
            $("#no-date-btn").click(function () {
                $("#no-date-modal").fadeOut();
            });

            //If input: (date, amount, note) are valid and not empty >>>> Create the expense
        } else {
            //push the expense to the array and store the value
            expenseList.push(userExpense.amount);

            //Update expenses if greater than 0
            if (expenseUpdate > 0) {
                var expenseTotal = expenseUpdate;
            } else {
                expenseTotal = 0;
            }
            //Total expense number
            var expenseTotal = expenseUpdate;

            //For all the valid expense in the array, add to the expense total
            for (var i in expenseList) {
                expenseTotal += (1 * expenseList[i]);
                expenseList.shift();
            }
            //Test the expense list
            console.log(expenseList);

            ///////////Write the new expenses//////////////
            //If expense greater than budget: pop up not enough money modal
            if (expenseTotal > budgetStore) {
                //Open up the expense > budget modal: "you dont have that much money bro"
                $("#expense-error-modal").css("display", "flex");
                //Go back to create expense slide
                $("#setup-btn-expense").click(function () {
                    $("#expense-error-modal").css("display", "none");
                });

                //remove the last invalid value from array list
                expenseList.pop();

                //If expense total < budget, store and write the value
            } else {

                //Create new Time line Block
                var newTimeLineBlock = $("<div></div>");

                //If last expense is left, next will be right
                if (!flag) {
                    flag = true;
                    $(newTimeLineBlock).addClass("timeline-block timeline-block-left");
                } else {
                    flag = false;
                    $(newTimeLineBlock).addClass("timeline-block timeline-block-right");
                }

                //Create html elemnt for the expense content, add class name to it
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

                //Add the expense item to the html to the top
                $(".timeline-container").prepend(newTimeLineBlock);

                //If dark mode is true, style the new appended block
                firebase.auth().onAuthStateChanged(function (user) {
                    db.collection("user").doc(user.uid).onSnapshot(function (snap) {
                        if (snap.data().darkMode == true) {
                            $(newTimeLineTitle).css("color", "rgb(34, 146, 187)");
                            $(newTimeLineContent).css("background-color", "#393838");
                            $(newTimeLineContent).css("color", "rgba(255, 255, 255, 0.8");
                            $(newMarker).css("background", "#393838");
                        } else {
                            $(newTimeLineTitle).css("color", "rgb(91, 91, 91)");
                            $(newTimeLineContent).css("background-color", "#ace2ff");
                            $(newTimeLineContent).css("color", "#666");
                            $(newMarker).css("background", "rgb(34, 146, 187)");
                        }
                    });
                });

                //Write the new expense number
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

                //Write total expense and wave animation data to firebase
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

                //Exit enter slide animation， finish the create expense part
                $("#slideShow").animate(slideOut, 1000);
                $("#enter-slide").animate(infoSlideOut, 1000);
                $("body").css("overflow", "auto");

                //If after create expense and has no money left
                firebase.auth().onAuthStateChanged(function (user) {
                    db.collection("user").doc(user.uid).onSnapshot(function (snap) {
                        var daysleft = snap.data().TotalDays - date;
                        if (daysleft > 0 && snap.data().BalanceStore == 0 && snap.data().ExpenseStore > 0) {
                            // alert('You spend all your budget!! 你没钱了！！');
                            $("#zero-balance-modal").fadeIn();

                            $("#zero-balance-btn").click(function () {
                                $("#zero-balance-modal").fadeOut();
                            });
                        }
                    });
                });

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

                //Clear the input value
                $('input, textarea').val('');
            }
        }
    });
    /////////////Save the expense function section ends////////////////


    //Set the budget number or create a budget
    $("#submit-budget-btn").click(function () {

        //Store user budget input and days duration value
        var userInput = document.getElementById('user-budget').value;
        var userDays = document.getElementById('budget-duration').value;

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

            //If the duration of days is empty
        } else if (userDays == '') {
            $("#no-duration-modal").fadeIn();
            $("#no-duration-btn").click(function () {
                $("#no-duration-modal").fadeOut();
            });

            //If budget is greater than expense and not 0
        } else {
            //Write data to html
            $("#budget_store").html("$" + (userInput / 1));
            //Write days to the html
            $("#date-left").html((userDays / 1) + " days ");

            //Return to home page
            $("#setup-budget").fadeOut();

            budgetStore = userInput;

            //Real time refresh all the data after change the budget and time
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

                    //Refresh the available number
                    if (budgetRefresh > 0 && expenseRefresh > 0) {
                        db.collection("user").doc(user.uid).update({
                            "BalanceStore": parseInt(newBalance)
                        });

                        $("#balance_store").html("$" + newBalance);
                    } else {
                        db.collection("user").doc(user.uid).update({
                            "BalanceStore": budgetStore
                        });
                        balanceRefresh = budgetRefresh;
                        $("#balance_store").html("$" + balanceRefresh);
                    }

                    //Refresh the wave animation height 
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

                //Set the new data to the firebase 
                db.collection("user")
                    .doc(user.uid)
                    .set({
                        "BudgetStore": parseInt(userInput),
                        "Duration": parseInt(userDays),
                        "TotalDays": parseInt(userDays) + parseInt(date),
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

    //Mobile version button to close the set up budget modal
    $("#mob-cancel-btn").click(function () {
        $("#setup-budget").fadeOut();
    });

    //Open up the tool kit panel
    $("#other-icon").click(function () {
        $("#tool-box-modal").fadeIn();
    });

    //Exist the tool kit panel
    $("#return-tool").click(function () {
        $("#tool-box-modal").fadeOut();
    });

    //page 2
    $("#other-tool").click(function () {
        $("#other-box-modal").fadeIn();
        $("#tool-box-modal").fadeOut();
    });

    //page 2 tool kit return
    $("#return-tool2").click(function () {
        $("#other-box-modal").fadeOut();
        $("#tool-box-modal").fadeIn();
    });

    //Cretea a new expense: Expense Details Slide in: open category page
    $("#create-icon").click(function () {
        firebase.auth().onAuthStateChanged(function (user) {
            db.collection("user").doc(user.uid).get().then(function (doc) {
                //if budget is 0 and trying to create new expense: throw error
                if (doc.data().BudgetStore > 0 && doc.data().BalanceStore > 0) {
                    $("#slideShow").animate(slideIn, 1000);
                    $("body").css("overflow", "hidden");

                    //If expense is valid, but no money left
                } else if (doc.data().ExpenseStore > 0 && doc.data().BalanceStore == 0) {
                    //Pop up the reset budget modal
                    $("#reset-journey-modal").fadeIn();

                    //Reset budget: recall the reset function
                    $("#reset-journey-btn").click(function () {
                        resetBudget();
                    });
                } else {
                    $("#nobudget-modal").fadeIn();
                }
            });
        });
    });

    //Back to home page
    $("#reset-budget-cancel").click(function () {
        $("#reset-journey-modal").fadeOut();
    });

    //Reset all the budget, expense, and balance
    $("#reset-tool").click(function () {
        resetBudget();
    });

    //Rest all the budget, balance, expense, water, and days from firebase
    function resetBudget() {
        firebase.auth().onAuthStateChanged(function (user) {

            //Reset wave height to full
            var resetWaveHeight = 100 * (-1) + 88;

            $(".water").css({
                "transform": "translateY(" + resetWaveHeight + "%)"
            });

            $(".budget_percent_num").html(100 + "%");

            //Reset all the value to 0
            db.collection("user")
                .doc(user.uid)
                .set({
                    "PercentStore": 100,
                    "WaveHeight": parseInt(resetWaveHeight),
                    "BudgetStore": 0,
                    "ExpenseStore": 0,
                    "BalanceStore": 0,
                    "Duration": 0,
                    "TotalDays": 0,
                }, {
                    merge: true
                });

            //Delete all the current container
            $(".timeline-content, .marker").remove();
            $("#date-left").html('');
            $("#motivation").html('');

            //Delete all the expense docs 我最喜欢的部分哈哈哈
            db.collection("user").doc(user.uid).collection("Expense").get().then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    doc.ref.delete().then(function () {
                        console.log("成啊！！!");
                        location.reload();
                    }).catch(function (error) {
                        console.error("错误！ ", error);
                    });
                })
            })
        });
    }

    //Change the nav bar color regarding different balance level
    firebase.auth().onAuthStateChanged(function (user) {
        db.collection("user").doc(user.uid).onSnapshot(function (snap) {
            console.log(snap.data().PercentStore);

            if (snap.data().darkMode == true) {
                $("#header-wrap").css("background-color", "#393838");
                $("#header-wrap").css("color", "rgb(34, 146, 187)");
                $(".budget_percent_num").css("color", "grey");
            } else {
                // 75% - 100% balance: blue theme nav bar
                if (snap.data().PercentStore <= 100 && snap.data().PercentStore >= 75) {
                    $("#header-wrap").css("background-color", "rgb(0, 153, 204)");
                    $(".budget_percent_num").css("color", "rgb(3, 110, 145)");
                    // 50% - 75% balance: organge theme nav bar
                } else if (snap.data().PercentStore >= 50 && snap.data().PercentStore < 75) {
                    $("#header-wrap").css("background-color", "rgb(245, 132, 66)");
                    $(".budget_percent_num").css("color", "rgb(245, 132, 66)");
                    // 25% - 50% balance: yellow theme nav bar
                } else if (snap.data().PercentStore < 50 && snap.data().PercentStore >= 25) {
                    $("#header-wrap").css("background-color", "rgb(240, 218, 91)");
                    $(".budget_percent_num").css("color", "rgb(240, 218, 91)");
                    // < 25% balance: red theme nav bar
                } else if (snap.data().PercentStore < 25) {
                    $("#header-wrap").css("background-color", "rgb(204, 14, 0)");
                    $(".budget_percent_num").css("color", "rgb(204, 14, 0)");
                }
            }
        });
    });

    //Update Dark Mode settings to firebase
    var darkMode = false;
    $("#dark-mode-icon").click(function () {
        firebase.auth().onAuthStateChanged(function (user) {
            if (!darkMode) {
                db.collection("user")
                    .doc(user.uid)
                    .set({
                        "darkMode": true,
                    }, {
                        merge: true
                    });
                darkMode = true;
            } else {
                db.collection("user")
                    .doc(user.uid)
                    .set({
                        "darkMode": false,
                    }, {
                        merge: true
                    });
                darkMode = false;
            }
        });
    });

    //Sign out the user from firebase
    $("#home-tool").click(function () {
        firebase.auth().onAuthStateChanged(function (user) {
            firebase.auth().signOut().then(function () {
                // Sign-out successful. Open up the login page
                window.location.replace("login.html");

            }).catch(function (error) {
                console.log("Erros...！");
            });
        });
    });

    /////////Ends///////////////////
});