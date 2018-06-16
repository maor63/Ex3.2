angular.module('citiesApp')
    .controller('LoginController', ['$scope', '$http', 'setHeadersToken','userManager', function ($scope, $http, setHeadersToken,userManager) {
        let self = this;
        let serverUrl = 'http://localhost:8080/';
        self.login = function () {
            // console.log(self.user.username);
            // console.log(self.user.password);
            $http.post(serverUrl + "users/login", self.user)
                .then(function (response) {
                    //First function handles success
                    if (response.data.success === true) {
                        self.login.content = response.data.token;
                        setHeadersToken.set(self.login.content);
                        userManager.setUser(self.user);
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
        self.recoverPassword = function () {
            // this function reciev the answer of the user and checks if it is equal to answer in the database
            //first we check if the user name exist
            //after we check the answer
            console.log(self.user);
            $http.post(serverUrl + "users/restore", self.user)
                .then(function (response) {
                    //First function handles success
                    if (response.data.success === true) {
                        alert('your answer has benn confirmed' + response.data.password.password);

                    }
                    else {
                        alert('password recovery failed please try again or register');
                    }
                    //    need to show him his password !!!!!!!!

                }, function (response) {
                    self.login.content = "Something went wrong";
                    alert('login failed');
                });
        };
        self.close = function () {
            document.getElementById("user_alert").close();
        };
        self.getQuestion = function () {
            // this function get the verification question for the user name that entered to the form
            $http.get(serverUrl + "users/verification_questions/" + self.user.userName)
                .then(function (response) {
                    //First function handles success
                    if (true) {
                        self.login.content = response.data;
                        console.log(self.login.content[0].question + '11111111111111111111111111111111111111');
                        console.log(self.login.content[0].questionID + '  11111111111111111111111111111111111111');
                        self.user.question = self.login.content[0].question;
                        self.user.question_id = self.login.content[0].questionID;

                    }
                    else {
                        self.login.content = "Something went wrong";
                        alert('password recovery failed please try again or register')
                    }

                }, function (response) {
                    console.log(response);
                    self.login.content = "Something went wrong";
                    alert('verification failed');
                });
        };
        self.showRecoveryQuestion = function () {
            //this function control the screen between recovery and login forms
            //checks weather a user name is added
            if (!self.user || !self.user.userName)
                document.getElementById("user_alert").showModal();
            else {
                self.recovery = !(self.recovery);
                if (self.recovery) {
                    alert('im im recovery');
                    alert(self.user.userName)
                    self.getQuestion();
                }
            }

        }

    }]);