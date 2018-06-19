angular.module('citiesApp')
    .controller('homeController', ['$http', 'userManager','$routeParams', function ($http, userManager,routeParams) {
        self = this;

        var modal = document.getElementById('myModal');
        var span = document.getElementsByClassName("close")[0];


        let serverUrl = 'http://localhost:8080/';
        self.sites = {};
        self.favorits = {};
        self.poi={};
        self.poiUrls={};
        self.reviews={};
        self.categories= {};
        loadCategoriesFromApi();
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
            userManager.updateFavorite(site);
        };

        self.isLoggedIn = function () {
            return userManager.getUser() !== undefined;
        };
        
        self.showPoiModalFunc = function (name) {
            $http.get(serverUrl + "sites/search/" + name)
                .then(function (response) {
                    //First function handles success
                         self.poi = response.data;
                    //     self.poi.id = self.login.content[0].siteID;
                    self.getSiteReviews(self.poi[0].siteID);
                    self.getImagesModal(self.poi[0].siteID);
                    self.poiCategory= self.categories[self.poi[0].categoryID-1];
                self.poiCategoryName= self.poiCategory.categoryName
                }, function (response) {
                    console.log(response);
                    alert('No details on this site')
                });

            modal.style.display = "block";
        };
        self.openRankModal= function () {

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

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
         };

       span.onclick = function() {
            modal.style.display = "none";
        };

       self.getImagesModal= function (siteID) {
           $http.get(serverUrl + "sites/photo_url/" + siteID)
               .then(function (response) {
                   //First function handles success
                   self.poiUrls = response.data;
               }, function (response) {
                   console.log(response);
                   self.login.content = "Something went wrong";
                   alert('No details on this site')
               });
       };
        self.getSiteCategory= function (siteID) {
            $http.get(serverUrl + "sites/photo_url/" + siteID)
                .then(function (response) {
                    //First function handles success
                    self.poiUrls = response.data;
                }, function (response) {
                    console.log(response);
                    self.login.content = "Something went wrong";
                    alert('No details on this site')
                });
        };
        self.getSiteReviews= function (siteID) {
            $http.get(serverUrl + "sites/site_reviews/" + siteID)
                .then(function (response) {
                    //First function handles success
                    self.reviews = response.data;
                    if (self.reviews.length===0){
                        self.reviews[0]=
                        {
                            id: "",
                            userID: "",
                            review: "No reviews added yet",
                            date: "",
                        }
                    }
                }, function (response) {
                    console.log(response);
                    alert('No Reviews on this site')
                });
        };

        function loadCategoriesFromApi() {
            $http.get("http://localhost:8080/users/categories")
                .then(function (response) {
                    //First function handles success
                    self.categories = response.data;
                }, function (response) {
                    console.log(response);
                    alert('No details on this site')
                });
        }


    }
    ])
;

