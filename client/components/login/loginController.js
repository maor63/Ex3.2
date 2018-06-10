angular.module('citiesApp')
    .controller('LoginController', ['$scope', function ($scope) {
        let self = this;
        self.submitForm = function () {
            // check to make sure the form is completely valid
            alert('our form is amazing');
        };
    }]);