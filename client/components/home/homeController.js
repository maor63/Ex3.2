angular.module('citiesApp')
    .controller('homeController', ['$http', function ($http) {
        self = this;
        $http.get("http://localhost:9000/sites/popular")
            .then(function (answers) {
                for (let i = 0; i < answers.length; i++) {
                    let site = answers[i];
                    self.cities = {
                        i: {
                            name: site["siteName"],
                            state: "France",
                            image: "https://media-cdn.tripadvisor.com/media/photo-s/0d/f5/7c/f2/eiffel-tower-priority.jpg"
                        }
                    }
                }
            }).catch(function (err) {
            console.log(err);
        });
    }]);

