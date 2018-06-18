angular.module('citiesApp')
    .controller('homeController', ['$http', 'userManager', function ($http, userManager) {
        self = this;
        self.sites = {};
        self.favorits = {};
        $http.get("http://localhost:8080/sites/popular").then(function (answers) {
            let sites = answers.data;
            let indexes = getRandomSubarray(sites, 3);
            for (let i = 0; i < indexes.length; i++) {
                let site = indexes[i];
                $http.get("http://localhost:8080/sites/photo_url/" + site.siteID)
                    .then(function (answer) {
                        let pic_url;
                        if (userManager.isFavorite(site.siteID))
                            pic_url = "pictures/star.png";
                        else
                            pic_url = "pictures/empty_star.png";
                        self.sites[site.siteID] =
                            {
                                id: site.siteID,
                                name: site["siteName"],
                                image: getRandomSubarray(answer.data, 1)[0].url,
                                favoritImgUrl: pic_url
                            }
                    });
            }

        }).catch(function (err) {
            console.log(err);
        });

        if (userManager.getUser() !== undefined) {
            $http.get("http://localhost:8080/reg/last_saved/" + userManager.getUser().userName)
                .then(function (answer) {
                    let favorits = answer.data;
                    for (let i = 0; i < favorits.length; i++) {
                        let site = favorits[i];
                        $http.get("http://localhost:8080/sites/photo_url/" + site.siteID)
                            .then(function (answer) {
                                self.favorits[site.siteID] =
                                    {
                                        id: site.siteID,
                                        name: site["siteName"],
                                        image: getRandomSubarray(answer.data, 1)[0].url,
                                        favoritImgUrl: "pictures/star.png"
                                    };

                                if (site.siteID in self.sites) {
                                    self.sites[site.siteID].favoritImgUrl = "pictures/star.png";
                                }
                            });
                    }
                })
                .catch(function (err) {
                    console.log(err);

                })
        }

        self.toggleImage = function (site) {
            if (site.favoritImgUrl === "pictures/star.png") {
                site.favoritImgUrl = "pictures/empty_star.png";
                userManager.deleteFavorite(site.id);
            }
            else {
                site.favoritImgUrl = "pictures/star.png";
                userManager.addFavorite(site.id);
            }
        };

        self.isLoggedIn = function () {
            return userManager.getUser() !== undefined;
        };

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

