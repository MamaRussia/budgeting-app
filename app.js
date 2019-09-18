const budgetController = (function() {
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var calcualteTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(function(c) {
      sum += c.value;
    });
    data.totals[type] = sum;
  };
  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };

  return {
    addItem: function(type, desc, val) {
      var newItem, ID;

      //create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      //create new item based on type
      if (type === "exp") {
        newItem = new Expense(ID, desc, val);
      } else if (type === "inc") {
        newItem = new Income(ID, desc, val);
      }
      //push into data structure
      data.allItems[type].push(newItem);

      //return new element
      return newItem;
    },

    deleteItem: function(type, id) {
      var ids, index;
      ids = data.allItems[type].map(function(current) {
        return current.id;
      });
      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function() {
      //calculate total income & expenses

      calcualteTotal("exp");
      calcualteTotal("inc");

      //calculate budget inc - exp
      data.budget = data.totals.inc - data.totals.exp;

      //calculate percentage of income spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }

      console.log(data.percentage);
    },

    calculatePercentages: function() {
      data.allItems.exp.forEach(function(cur) {
        cur.calcPercentage(data.totals.inc);
      });
    },

    getPercentage: function() {
      var allPercentages = data.allItems.exp.map(function(cur) {
        return cur.getPercentage();
      });
      return allPercentages;
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },
    testing: function() {
      console.log(data);
    },
    addMonth: function(month) {}
  };
})();

let UIController = (function() {
  var DOMStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expenseContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expenseLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    expensePercentage: ".item__percentage",
    container: ".container",
    dateLabel: ".budget__title--month"
    // deleteBtn: ".item__delete--btn"
    // budgetExpensePercentage: ".budget__expenses--percentage"
  };

  var formatNum = function(num, type) {
    var numSplit, int, dec;
    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split(".");
    int = numSplit[0];

    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3);
    }

    dec = numSplit[1];

    return (type === "exp" ? "-" : "+") + " " + int + "." + dec;
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value, //will be inc or exp
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
      };
    },

    addListItem: function(obj, type) {
      var html, newHTML, element;
      //create HTML string with placeholder
      if (type === "inc") {
        element = DOMStrings.incomeContainer;
        html =
          '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMStrings.expenseContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      //Replace the placeholder text with data
      newHTML = html.replace("%id%", obj.id);
      newHTML = newHTML.replace("%description%", obj.description);
      newHTML = newHTML.replace("%value%", formatNum(obj.value, type));

      console.log(newHTML);

      //Insert HTML into DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHTML);
    },

    deleteListItem: function(selectorID) {
      document.getElementById(selectorID).remove();
      // el.parentNode.removeChild(el);
      // element.parentNode.removeChild();
    },

    clearFields: function() {
      var fields, fieldsArray;
      fields = document.querySelectorAll(
        DOMStrings.inputDescription + ", " + DOMStrings.inputValue
      );
      fieldsArray = Array.prototype.slice.call(fields);
      fieldsArray.forEach(function(c) {
        c.value = "";
      });
      fieldsArray[0].focus();
    },
    displayBudget: function(obj) {
      var type;
      obj.budget > 0 ? (type = "inc") : (type = "exp");
      document.querySelector(DOMStrings.budgetLabel).textContent = formatNum(
        obj.budget,
        type
      );
      document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMStrings.expenseLabel).textContent =
        obj.totalExp;

      if (obj.percentage > 0) {
        document.querySelector(DOMStrings.percentageLabel).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOMStrings.percentageLabel).textContent = "---";
      }
    },

    displayPercentage: function(percentages) {
      var fields = document.querySelectorAll(DOMStrings.expensePercentage);

      var nodeListForEach = function(list, cb) {
        for (let i = 0; i < list.length; i++) {
          cb(list[i], i);
        }
      };
      nodeListForEach(fields, function(current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + "%";
        } else {
          current.textContent = "---";
        }
      });
    },

    displayMonth: function() {
      var now, day, days, year, month, months;
      now = new Date();
      year = now.getFullYear();
      days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
      day = now.getDay();
      months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      month = now.getMonth();

      document.querySelector(DOMStrings.dateLabel).textContent =
        days[day] + " " + months[month] + " " + " " + year;
    },

    getDOMStrings: function() {
      return DOMStrings;
    }
  };
})();

let appController = (function(budgetCtrl, UICtrl) {
  var setUpEventListeners = function() {
    var DOM = UICtrl.getDOMStrings();
    document
      .querySelector(DOM.inputBtn)
      .addEventListener("click", controlAddItem);
    document.addEventListener("keydown", function(event) {
      event = event.which;
      if (event === 13 || event.keyCode === 13) {
        console.log(event);
        controlAddItem();
      }
    });

    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);
  };

  var updatePercentage = function() {
    budgetCtrl.calculatePercentages();
    var percentages = budgetCtrl.getPercentage();
    console.log(percentages);
    UICtrl.displayPercentage(percentages);
  };

  var updateBudget = function() {
    var budget;
    //calculate budget
    budgetCtrl.calculateBudget();

    //return budget

    budget = budgetCtrl.getBudget();

    //update UI with new budget
    UICtrl.displayBudget(budget);
  };

  var controlAddItem = function() {
    //get input value from button
    var input, newItem;
    input = UICtrl.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      // add to UI

      UICtrl.addListItem(newItem, input.type);
      UICtrl.clearFields();

      //calculate and update budget

      updateBudget();

      //calculate percentages

      updatePercentage();
    }
    // //add to budget controller
  };

  var ctrlDeleteItem = function(event) {
    var itemId, splitID, type, ID;
    itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemId) {
      splitID = itemId.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]);

      //delete from data structure
      budgetCtrl.deleteItem(type, ID);
      //delete from UI
      UICtrl.deleteListItem(itemId);
      //update and show new budget
      updateBudget();
      //calculate percentages

      updatePercentage();
    }
  };

  return {
    init: function() {
      console.log("Application has started");
      UICtrl.displayMonth();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });

      setUpEventListeners();
    }
  };
})(budgetController, UIController);

appController.init();
