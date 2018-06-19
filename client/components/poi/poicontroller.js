angular.module('citiesApp')
    .controller('poiCtrl', ['$http', 'userManager', function ($http, userManager) {
        let self = this;
        self.sites = [];
        $http.get("http://localhost:8080/sites/all").then(function (answers) {
            let sites = answers.data;
            for (let i = 0; i < sites.length; i++) {
                let site = sites[i];
                $http.get("http://localhost:8080/sites/photo_url/" + site.siteID)
                    .then(function (answer) {
                        let pic_url;
                        if (userManager.isFavorite(site.siteID))
                            pic_url = "pictures/star.png";
                        else
                            pic_url = "pictures/empty_star.png";
                        self.sites.push(
                            {
                                id: site.siteID,
                                name: site["siteName"],
                                image: getRandomSubarray(answer.data, 1)[0].url,
                                favoritImgUrl: pic_url,
                                category: site.categoryID,
                                rank: site.rank,
                                views: site.views
                            });
                    });
            }
        }).catch(function (err) {
            console.log(err);

        });

        self.categories = {};
        self.categories[""] = undefined;
        $http.get("http://localhost:8080/users/categories").then(function (answer) {
            let categories = answer.data;
            for (let i = 0; i < categories.length; i++) {
                self.categories[categories[i].categoryName] = categories[i].categoryID;
            }
        }).catch(function (err) {
            console.log(err);

        });

        self.isLoggedIn = function () {
            return userManager.getUser() !== undefined;
        };

        self.toggleImage = function (site) {
            userManager.updateFavorite(site);
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
    }]);