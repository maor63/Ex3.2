angular.module('citiesApp')
    .service('setHeadersToken', ['$http', function ($http) {
        let self = this;
        let token = "";
        self.recovery = false;

        this.set = function (t) {
            token = t;
            $http.defaults.headers.common['x-access-token'] = t;
            // $httpProvider.defaults.headers.post[ 'x-access-token' ] = token
            console.log("set")

        };

        this.setCurrToken = function () {
            $http.defaults.headers.common['x-access-token'] = token;
        };

        this.getTokent = function () {
            return token;
        };

        this.isUserConnected = function () {
            return token !== "";
        }
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
    .service('userManager', ['$http', function ($http) {
        let self = this;
        self.user = undefined;
        self.nextPosition = 1;
        self.favorites = {};

        // $http.get("http://localhost:8000/reg/favorites/" + userManager.getUser().userName).then(function (answer) {
        //     let favorits = answer.data;
        //     for (let i = 0; i < favorits.length; i++) {
        //         let favorite = favorits[i];
        //         if (userManager.isFavorite(favorite.siteID))
        //             continue;
        //         $http.get("http://localhost:8000/sites/site/" + favorite.siteID)
        //             .then(function (answer) {
        //                 let site = answer.data[0];
        //                 $http.get("http://localhost:8000/sites/photo_url/" + favorite.siteID).then(function (answer) {
        //                     self.favorites.push(
        //                         {
        //                             id: site.siteID,
        //                             name: site["siteName"],
        //                             image: tools.getRandomSubarray(answer.data, 1)[0].url,
        //                             favoritImgUrl: "pictures/star.png",
        //                             category: site.categoryID,
        //                             position: userManager.getNextPosition()
        //                         });
        //                 });
        //             });
        //     }
        // }).catch(function (err) {
        //     console.log(err);
        // });

        self.getNextPosition = function () {
            return self.nextPosition++;
        };

        self.setUser = function (userName) {
            self.user = userName;
            self.favorites = {};
        };

        self.getUser = function () {
            return self.user;
        };

        self.clearUser = function () {
            self.user = undefined;
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
        };

        function deleteFromArray(array, element) {
            var index = array.indexOf(element);
            if (index > -1) {
                array.splice(index, 1);
            }
        }


    }])
;
