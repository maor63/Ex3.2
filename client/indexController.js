angular.module('citiesApp')
    .controller('indexController',['userManager', function (userManager) {

        let self = this;
        self.show_register = true;
        self.show_login = true;
        self.getUser = userManager.getUser;

        self.isLoggedIn = function () {
            return userManager.getUser() !== undefined;
        }

        self.logout = function () {
            userManager.clearUser();
        }
    }]);
