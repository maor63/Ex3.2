angular.module('citiesApp')
    .controller('registerController', ['$scope','$http', function ($scope,$http) {
        let self = this;
        self.countries=['israel','usa','uk'];
        self.categories = {};
        self.questions ={};
        self.register = function () {
            // check to make sure the form is completely valid
            alert('our form is amazing');
            console.log('we ahave new user',self.user)
        };


        $http.get("http://localhost:8080/users/categories").then(function (answers) {
            let categories = answers.data;
            for (let i = 0; i < categories.length; i++) {
                let category = categories[i];
                        self.categories[i] =
                            {
                                id: category["categoryID"],
                                name: category["categoryName"]

                            }
            }

        }).catch(function (err) {
            console.log(err);
        });

        $http.get("http://localhost:8080/users/questions").then(function (answers) {
            let questions = answers.data;
            for (let i = 0; i < questions.length; i++) {
                let question = questions[i];
                self.questions[i] =
                    {
                        id: question["questionID"],
                        name: question["question"]

                    }
            }

        }).catch(function (err) {
            console.log(err);
        });

        self.register = function () {
            // register user
            $http.post( "http://localhost:8080/users/signup", user)
                .then(function (response) {
                    console.log("something went good 1")
                    //First function handles success
                    self.register.content = response.data;

                    user.username=content.userName;
                    user.password=content.password;
                    console.log("something went good 2")

                }, function (response) {
                    console.log("something went wrong 1")
                    self.reg.content = response.data
                    //Second function handles error
                    console.log("something went wrong 2")
                    // self.reg.content = "Something went wrong";
                });
        }




    }]);