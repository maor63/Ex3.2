angular.module('citiesApp')
    .service('setHeadersToken', ['$http', function ($http) {

        let token = "";

        this.set = function (t) {
            token = t;
            $http.defaults.headers.common['x-access-token'] = t;
            // $httpProvider.defaults.headers.post[ 'x-access-token' ] = token
            console.log("set")

        };

        this.isUserConnected = function () {
            return token !== "";
        }
    }])

    .controller('LoginController', ['$scope', '$http', 'setHeadersToken', function ($scope, $http, setHeadersToken) {
        let self = this;
        let serverUrl = 'http://localhost:8080/';
        self.login = function () {
            // console.log(self.user.username);
            // console.log(self.user.password);
            $http.post(serverUrl + "users/login", self.user)
                .then(function (response) {
                    //First function handles success
                    if(response.data.success === true) {
                        self.login.content = response.data.token;
                        setHeadersToken.set(self.login.content);
                        alert('login succ')
                    }
                    else {
                        self.login.content = "Something went wrong";
                        alert('login failed')
                    }

                }, function (response) {
                    self.login.content = "Something went wrong";
                    alert('login failed')
                });
        }
    }]);