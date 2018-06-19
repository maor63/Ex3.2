angular.module('citiesApp')
    .controller('poiCtrl', ['$http', 'userManager', 'tools', function ($http, userManager, tools) {
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
                                image: tools.getRandomSubarray(answer.data, 1)[0].url,
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
        self.categoryIdToCategory = {};
        self.categories[""] = undefined;
        $http.get("http://localhost:8080/users/categories").then(function (answer) {
            let categories = answer.data;
            for (let i = 0; i < categories.length; i++) {
                self.categories[categories[i].categoryName] = categories[i].categoryID;
                self.categoryIdToCategory[categories[i].categoryID] = categories[i].categoryName;
            }
        }).catch(function (err) {
            console.log(err);

        });

        self.getCategoryById = function (id) {
            return self.categoryIdToCategory[id];
        };

        self.isLoggedIn = function () {
            return userManager.getUser() !== undefined;
        };

        self.toggleImage = function (site) {
            userManager.updateFavorite(site);
        };

    }]);