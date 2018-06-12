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

        let checked_categories = {};
        self.checked_categories_count = 0;
        self.updateChoise = function(category_id){
            if(category_id in checked_categories)
                delete checked_categories[category_id];
            else {
                checked_categories[category_id] = 1;
            }
            self.checked_categories_count = Object.keys(checked_categories).length;
            console.log(self.checked_categories_count);
        };


        loadCategoriesFromApi($http, self);

        loadQuestionsFromApi($http, self);

        loadCountriesFromApi($http, self);

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
