angular.module('citiesApp')
    .service('setHeadersToken', ['$http', function ($http) {

        let token = "";

        this.set = function (t) {
            token = t;
            $http.defaults.headers.common['x-access-token'] = t;
            // $httpProvider.defaults.headers.post[ 'x-access-token' ] = token
            console.log("set")

        };
    }])

    .controller('LoginController', ['$scope', '$http','setHeadersToken', function ($scope, $http) {
        let self = this;
        let serverUrl = 'http://localhost:8080/';
        self.submitForm = function () {
            // check to make sure the form is completely valid
            alert('our form is amazing');
        };

        self.login = function () {
            // register user
            // let user = {
            //     "username": $scope.username,
            //     "password": $scope.password
            // };
            console.log(self.user.username);
            console.log(self.user.password);
            $http.post(serverUrl + "users/login", self.user)
                .then(function (response) {
                    //First function handles success
                    self.login.content = response.data.token;
                    setHeadersToken.set(self.login.content)


                }, function (response) {
                    //Second function handles error
                    self.login.content = "Something went wrong";
                });
        }
    }]);