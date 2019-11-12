$(document).ready(function () {

    //Create new expense function
    class Expense {
        constructor(category, amount, date, note) {
        this.newCategory = category;
        this.newAmount = amount;
        this.newDate = date;
        this.newNote = note;
        }

        set category(category) {
            this.newCategory =category;
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
        $("#slideShow").animate(slideIn, 1000);
        $("body").css("overflow", "hidden");
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
    var flag = false;
    
    var expenseControl = $("#expense_store");
    var expenseList = [];

    $("#save-btn").click(function () {
        $("#enter-slide").animate(infoSlideOut, 1000);
        $("#slideShow").animate(slideOut, 500);
        $("body").css("overflow", "auto");
        
        //Retrive value from the input type
        userExpense.date = document.getElementById('datepicker').value;
        userExpense.amount = document.getElementById('amount-field').value;
        userExpense.note = document.getElementById('note-field').value;
        expenseList.push(userExpense.amount);

        //Create new Time line Block
        var newTimeLineBlock = $("<div></div>");

        if(!flag) {
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

        newTimeLineContent.append(newTimeLineTitle,newTimeLineDate,newTimeLineNote );
        newTimeLineBlock.append(newMarker, newTimeLineContent);

        $(".timeline-container").prepend(newTimeLineBlock);
        
        //Update expenses
        var expenseTotal = 0;
        for (var i in expenseList) {
            expenseTotal += (1 * expenseList[i]);
        }
        //Write the new expenses
        $(expenseControl).html("$" + (expenseTotal));

        //Update the percentage
        var updatePercent = (1 - (expenseTotal / budgetStore)) * 100;
        $(".budget_percent_num").html(updatePercent + "%");
    });
    
    //Open up the budget setup modal
    $("#home-icon").click(function () {
        $("#setup-budget").fadeIn();
    });

    //Set the budet number
    var budgetStore = 0;
    $("#submit-budget-btn").click(function () {
        var userInput = document.getElementById('user-budget').value;
        if (userInput < 0) {
            alert('wtf');
        } else {
            $("#budget_store").html("$" + (userInput / 1));
            $("#setup-budget").fadeOut();
            budgetStore = userInput;
        }
    });

    //Manually close the budget window
    $(".budget-cancel").click(function() {
        $("#setup-budget").fadeOut();
    });

});