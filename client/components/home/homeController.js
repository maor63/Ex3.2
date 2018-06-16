angular.module('citiesApp')
    .controller('homeController', ['$http', 'userManager', 'setHeadersToken', function ($http, userManager, setHeadersToken) {
        self = this;
        self.cities = {};
        self.favorits = {};
        $http.get("http://localhost:8080/sites/popular").then(function (answers) {
            let sites = answers.data;
            let indexes = getRandomSubarray(sites, 3);
            for (let i = 0; i < indexes.length; i++) {
                let site = indexes[i];
                $http.get("http://localhost:8080/sites/photo_url/" + site.siteID)
                    .then(function (answer) {
                        self.cities[i] =
                            {
                                id: site.siteID,
                                name: site["siteName"],
                                image: getRandomSubarray(answer.data, 1)[0].url
                            }
                    });
            }

        }).catch(function (err) {
            console.log(err);
        });

        self.loggedIn = isLoggedIn();
        if (isLoggedIn()) {
            let token = setHeadersToken.getTokent();
            $http.get("http://localhost:8080/reg/last_saved/" + userManager.getUser().userName,{ headers: {'x-access-token': token} })
                .then(function (answer) {
                    let favorits = answer.data;
                    for (let i = 0; i < favorits.length; i++) {
                        let site = favorits[i];
                        $http.get("http://localhost:8080/sites/photo_url/" + site.siteID)
                            .then(function (answer) {
                                self.favorits[i] =
                                    {
                                        id: site.siteID,
                                        name: site["siteName"],
                                        image: getRandomSubarray(answer.data, 1)[0].url
                                    }
                            });
                    }
                })
                .catch(function (err) {
                    console.log(err);

                })
        }

        self.isContainFavorit = function (site_id) {
            return site_id in userManager.favorits;
        };

        function isLoggedIn() {
            return userManager.getUser() !== undefined;
        }

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
    }
    ])
;

