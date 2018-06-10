angular.module('citiesApp')
    .controller('homeController', ['$http', function ($http) {
        self = this;
        self.cities = {};
        $http.get("http://localhost:8080/sites/popular").then(function (answers) {
                let sites = answers.data;
                for (let i = 0; i < sites.length; i++) {
                    let site = sites[i];
                    self.cities[i] =
                        {
                            name: site["siteName"],
                            state: "France",
                            image: "https://media-cdn.tripadvisor.com/media/photo-s/0d/f5/7c/f2/eiffel-tower-priority.jpg"
                        }
                }

            }).catch(function (err) {
            console.log(err);
        });
    }])
;

