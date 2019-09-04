const budgetController = (function () {



})();

let UIController = (function () {
    


})();

let appController = (function (budgetCtrl, UICtrl) {

    var controlAddItem = function () {
        
   //get input value from button
        //add to budget controller
        //add to UI
        //calculate budget
        //update UI with new budget

console.log("I am alive");

    }
    
    document.querySelector(".add__btn").addEventListener("click", controlAddItem)
    document.addEventListener("keydown", function (event) {
     
        event = event.which;
        if (event === 13 || event.keyCode === 13) {
         
            console.log(event); 
            controlAddItem();
        }
        
    })

})(budgetController, UIController);

