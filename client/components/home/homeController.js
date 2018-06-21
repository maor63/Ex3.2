angular.module('citiesApp')
    .controller('homeController', ['$rootScope', '$scope', '$http', 'userManager','tools' ,function ($rootScope, $scope, $http, userManager,tools) {
        self = this;



        let serverUrl = 'http://localhost:8080/';
        self.sites = {};
        self.favorits = [];
        self.poi={};
        self.poiUrls={};
        self.reviews={};
        self.userCategories = {};
        self.sitesForUserCategories = {};

        self.showPoiModalFunc = function(id){
            $rootScope.$broadcast('show-modal', {id: id});
        };

        function retriveSiteAndAddToSites(site) {
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
                            image: tools.getRandomSubarray(answer.data, 1)[0].url,
                            category: site.categoryID,
                            favoritImgUrl: pic_url

                        }
                });
        }

// loadCategoriesFromApi();
        $http.get("http://localhost:8080/sites/popular").then(function (answers) {
            let sites = answers.data;
            let indexes = tools.getRandomSubarray(sites, 3);
            for (let i = 0; i < indexes.length; i++) {
                let rawSite = indexes[i];
                retriveSiteAndAddToSites(rawSite);
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
                                self.favorits.push(
                                    {
                                        id: site.siteID,
                                        name: site["siteName"],
                                        image: tools.getRandomSubarray(answer.data, 1)[0].url,
                                        category: site.categoryID,
                                        favoritImgUrl: "pictures/star.png"
                                    });

                                if (site.siteID in self.sites) {
                                    self.sites[site.siteID].favoritImgUrl = "pictures/star.png";
                                }
                            });
                    }
                })
                .catch(function (err) {
                    console.log(err);

                });

            $http.get("http://localhost:8080/reg/categories/" + userManager.getUser().userName)
                .then(function (answer) {
                    let categoriesData = answer.data;
                    for (let i = 0; i < categoriesData.length; i++) {
                        self.userCategories[categoriesData[i].id] = categoriesData[i].categoryName;
                        $http.get("http://localhost:8080/sites/all_by_category_id/" + categoriesData[i].id)
                            .then(function (answer) {
                                let sites = answer.data;
                                let site = tools.getRandomSubarray(sites, 1)[0];
                                $http.get("http://localhost:8080/sites/photo_url/" + site.siteID)
                                    .then(function (answer) {
                                        let pic_url;
                                        if (userManager.isFavorite(site.siteID))
                                            pic_url = "pictures/star.png";
                                        else
                                            pic_url = "pictures/empty_star.png";
                                        self.sitesForUserCategories[categoriesData[i].id] =
                                            {
                                                id: site.siteID,
                                                name: site["siteName"],
                                                image: tools.getRandomSubarray(answer.data, 1)[0].url,
                                                category: site.categoryID,
                                                favoritImgUrl: pic_url

                                            }
                                    });
                            });
                    }
                })
                .catch(function (err) {
                    console.log(err);

                });
        }

        self.toggleImage = function (site) {
            userManager.updateFavorite(site);
        };

        self.isLoggedIn = function () {
            return userManager.getUser() !== undefined;
        };
        



    }
    ])
;

