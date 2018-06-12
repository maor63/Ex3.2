angular.module('citiesApp')
    .controller('indexController',['setHeadersToken', function (setHeadersToken) {

        self = this;
        self.userName = setHeadersToken.userName;
        self.show_register = true;
        self.show_login = true;
    }]);
