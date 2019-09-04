const budgetController = (function () {
    var x = 23;
    var add = function (a) {
        return x + a
    }

    return {
        publicTest: function (b) {
            return (add(b));
            
        }
    }
})();

let UIController = (function () {
    

    
})();

let appController = (function (budgetCtrl, UICtrl) {
    
    let z = budgetCtrl.publicTest(5);
    return {
        pubMethod: function () {
            console.log(z);
            
        }
    }

})(budgetController, UIController);