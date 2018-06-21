angular.module('citiesApp')
    .service('setHeadersToken', ['$http', 'localStorageModel', function ($http, localStorageModel) {
        let self = this;
        let token = "";
        self.recovery = false;

        this.set = function (t) {
            token = t;
            $http.defaults.headers.common['x-access-token'] = t;
            // $httpProvider.defaults.headers.post[ 'x-access-token' ] = token
            console.log("set");
            localStorageModel.updateLocalStorage("token", t);
        };

    }])
    .service('tools', [function () {
        this.getRandomSubarray = function (arr, size) {
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
    .service('userManager', ['$http', 'tools', 'localStorageModel', function ($http, tools, localStorageModel) {
        let self = this;
        self.user = undefined;
        self.nextPosition = 1;
        self.favorites = {};

        if (localStorageModel.getLocalStorage("user"))
            self.user = localStorageModel.getLocalStorage("user");

        if (localStorageModel.getLocalStorage("token")) {
            token = localStorageModel.getLocalStorage("token");
            $http.defaults.headers.common['x-access-token'] = token;
        }

        if (localStorageModel.getLocalStorage("favorites")) {
            loadFavoriets();
            self.favorites = localStorageModel.getLocalStorage("favorites");
        }

        self.getNextPosition = function () {
            return self.nextPosition++;
        };

        self.setUser = function (user) {
            self.user = user;
            self.favorites = {};
            loadFavoriets();
            localStorageModel.addLocalStorage("user", self.user);
            localStorageModel.addLocalStorage("favorites", self.favorites)
        };

        self.getUser = function () {
            return self.user;
        };

        self.clearUser = function () {
            self.user = undefined;
            localStorageModel.removeLocalStorage("user");
            localStorageModel.removeLocalStorage("favorites");
            localStorageModel.removeLocalStorage("token");
        };

        self.addFavorite = function (site_id, site) {
            site["position"] = self.getNextPosition();
            self.favorites[site_id] = site;
        };

        self.deleteFavorite = function (site_id) {
            delete self.favorites[site_id];
            // deleteFromArray(self.favorites, site_id);
        };

        self.isFavorite = function (site_id) {
            return site_id in self.favorites;
            // return self.favorites.indexOf(site_id) > -1;
        };

        self.updateFavorite = function (site) {
            if (site.favoritImgUrl === "pictures/star.png") {
                site.favoritImgUrl = "pictures/empty_star.png";
                self.deleteFavorite(site.id);
            }
            else {
                site.favoritImgUrl = "pictures/star.png";
                self.addFavorite(site.id, site);
            }
            localStorageModel.updateLocalStorage("favorites", self.favorites)
        };


        function loadFavoriets() {
            $http.get("http://localhost:8080/reg/favorites/" + self.user.userName).then(function (answer) {
                let favorits = answer.data;
                for (let i = 0; i < favorits.length; i++) {
                    let favorite = favorits[i];
                    if (self.isFavorite(favorite.siteID))
                        continue;
                    $http.get("http://localhost:8080/sites/site/" + favorite.siteID)
                        .then(function (answer) {
                            let site = answer.data[0];
                            $http.get("http://localhost:8080/sites/photo_url/" + favorite.siteID).then(function (answer) {
                                self.favorites[site.siteID] =
                                    {
                                        id: site.siteID,
                                        name: site["siteName"],
                                        image: tools.getRandomSubarray(answer.data, 1)[0].url,
                                        favoritImgUrl: "pictures/star.png",
                                        category: site.categoryID,
                                        position: self.getNextPosition()
                                    };
                            });
                        });
                }
            }).catch(function (err) {
                console.log(err);
            });
        }

    }])
    .service('localStorageModel', ['localStorageService', function (localStorageService) {

        var self = this;

        self.addLocalStorage = function (key, value) {
            var dataVal = localStorageService.get(key);
            console.log(dataVal)
            if (!dataVal)
                if (localStorageService.set(key, value)) {
                    console.log("data added")
                }
                else
                    console.log('failed to add the data');
        };


        self.getLocalStorage = function (key) {
            return localStorageService.get(key)
        };

        self.updateLocalStorage = function (key, value) {
            localStorageService.remove(key);
            localStorageService.set(key, value);
        };

        self.removeLocalStorage = function (key) {
            localStorageService.remove(key);
        }

    }]);

