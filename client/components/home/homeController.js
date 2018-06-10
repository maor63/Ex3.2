angular.module('citiesApp')
    .controller('homeController', ['$http', function ($http) {
        self = this;
        self.cities = {};
        //todo : need to load img from DB url
        $http.get("http://localhost:8080/sites/popular").then(function (answers) {
                let sites = answers.data;
                let indexes = getRandomSubarray(sites, 3);
                for (let i = 0; i < indexes.length; i++) {
                    let site = indexes[i];
                    $http.get("http://localhost:8080/sites/photo_url/" + site.siteID)
                        .then(function (answer) {
                            self.cities[i] =
                                {
                                    name: site["siteName"],
                                    state: getRandomSubarray(answer.data, 1)[0],
                                    image: "https://media-cdn.tripadvisor.com/media/photo-s/0d/f5/7c/f2/eiffel-tower-priority.jpg"
                                }
                        });
                }

            }).catch(function (err) {
            console.log(err);
        });

        function getRandomSubarray(arr, size) {
            let shuffled = arr.slice(0), i = arr.length, min = i - size, temp, index;
            while (i-- > min) {
                index = Math.floor((i + 1) * Math.random());
                temp = shuffled[index];
                shuffled[index] = shuffled[i];
                shuffled[i] = temp;
            }
            return shuffled.slice(min);
        }
    }])
;
