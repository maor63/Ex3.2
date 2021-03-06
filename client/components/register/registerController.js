angular.module('citiesApp')
    .controller('registerController', ['$window','$scope','$http', function ($window,$scope,$http) {
        let self = this;
        self.countries=[];
        self.categories = {};
        self.questions ={};
        self.registeredsuccess=false;
        let checked_categories = {};
        self.selected_categories=[];
        self.selected_questionid=[];
        self.selected_answer=[];
        self.checked_categories_count = 0;
        self.updateChoise = function(category_id){
            if(category_id in checked_categories)
                delete checked_categories[category_id];
            else {
                checked_categories[category_id] = 1;
            }
            self.checked_categories_count = Object.keys(checked_categories).length;
            self.selected_categories=Object.keys(checked_categories);
            console.log(self.checked_categories_count);
        };


        loadCategoriesFromApi($http, self);

        loadQuestionsFromApi($http, self);

        loadCountriesFromApi($http, self);

        self.register = function () {
            // register user
            self.user.categories= self.selected_categories;
            self.user.verificationQuestions= [self.user.verificationQuestions.id];
            self.user.verificationAnswers= [self.user.verificationAnswers];
            $http.post( "http://localhost:8080/users/signup", self.user)
                .then(function (response) {
                    console.log("something went good 1");
                    //First function handles success
                    self.register.content = response.data;

                    self.user.userName=self.register.content.userName;
                    self.user.password=self.register.content.password;
                    alert('Congratulations you have registered successfully!!!');
                    alert('Here are your credentials\n User name: '+self.user.userName+'\n Password: ' +self.user.password)
                    self.registeredsuccess=true;
                    //document.getElementById("user_details").showModal();
                    $window.location.href = '#/login';

                }, function (response) {

                    self.reg.content = response.data;
                    //Second function handles error
                    alert('Something went wrong please try again to register');

                });
        }
        self.close=function(){
            document.getElementById("user_details").close();
        }

    }]);

function loadCategoriesFromApi($http, self) {
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
}

function loadQuestionsFromApi($http, self) {
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
}

function loadCountriesFromApi($http, self) {
    $http.get("components/register/countries.xml").then(function (data) {
        let x2js = new X2JS();
        let jsonData = x2js.xml_str2json(data.data);
        let countries = jsonData.Countries.Country;
        for (let i = 0; i < countries.length; i++) {
            self.countries.push(countries[i].Name);
        }

    });
}

