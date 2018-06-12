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



    }]);