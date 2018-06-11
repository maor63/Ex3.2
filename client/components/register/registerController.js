angular.module('citiesApp')
    .controller('registerController', ['$scope', function ($scope) {
        let self = this;
        self.countries=['israel','usa','uk'];
        self.categories=['1','2','3'];

        self.register = function () {
            // check to make sure the form is completely valid
            alert('our form is amazing');
            console.log('we ahave new user',self.user)
        };
    }]);