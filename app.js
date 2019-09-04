const budgetController = (function() {})();

let UIController = (function() {
  var DOMStrings = {
    inputType: ".add__type",
    descType: ".add__description",
    valueType: ".add__value",
    inputBtn: ".add__btn"
  };
  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        desc: document.querySelector(DOMStrings.descType).value,
        value: document.querySelector(DOMStrings.valueType).value
      };
    },
    getDOMStrings: function() {
      return DOMStrings;
    }
  };
})();

let appController = (function (budgetCtrl, UICtrl) {
    
    var setUpEventListeners = function () {
        var DOM = UIController.getDOMStrings();
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
    }

  var controlAddItem = function() {
    //get input value from button

    var input = UIController.getInput();
 

    //add to budget controller
    //add to UI
    //calculate budget
    //update UI with new budget
  };

    return {
        init: function () {
            console.log("Application has started");
            setUpEventListeners();
    }
}
})(budgetController, UIController);

appController.init();
