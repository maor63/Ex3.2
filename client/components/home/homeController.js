angular.module('citiesApp')
    .controller('homeController', ['$http', 'userManager','tools' ,function ($http, userManager,tools) {
        self = this;

        var modal = document.getElementById('myModal');
        var modalRank =document.getElementById('rankModal');
        var span = document.getElementsByClassName("close")[0];
        var span2 = document.getElementsByClassName("close")[1];
        $(':radio').change(function() {
            self.rank=this.value;
        });

        let serverUrl = 'http://localhost:8080/';
        self.sites = {};
        self.favorits = [];
        self.poi={};
        self.poiUrls={};
        self.reviews={};
        self.categories= {};

        loadCategoriesFromApi();
        $http.get("http://localhost:8080/sites/popular").then(function (answers) {
            let sites = answers.data;
            let indexes = tools.getRandomSubarray(sites, 3);
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
                                image: tools.getRandomSubarray(answer.data, 1)[0].url,
                                category: site.categoryID,
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
            modalRank.style.display = "block";
        };

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
         };

       span.onclick = function() {
            modal.style.display = "none";
        };
        span2.onclick = function() {
            modalRank.style.display = "none";
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
        self.submitRanking= function (review) {
            if(!review|| !self.rankedStar)
            {
                alert('You must enter a literal review and rank the stars to submit');
                return;
            }
            modalRank.style.display = "none";// close the ranking and review modal
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();

            if(dd<10) {
                dd = '0'+dd
            }

            if(mm<10) {
                mm = '0'+mm
            }
            self.reviewObject=
                {
                    userName: userManager.getUser().userName,
                    siteID: self.poi[0].siteID,
                    review: review,
                    date: today,
                }
            self.rankObject=
                {
                    siteID: self.poi[0].siteID,
                    rank: self.rankedStar,

                }
                self.submitTextReview();
             self.submitRankReview();

        };
        self.submitTextReview= function () {
            $http.post(serverUrl + "reg/review/", self.reviewObject)
                .then(function (response) {
                    //First function handles success
                    self.content = response.data;
                }, function (response) {
                    console.log(response);
                    alert('no success posting review')

                });

        };
        self.submitRankReview= function () {
            $http.post(serverUrl + "reg/rank/",self.rankObject)
                .then(function (response) {
                    //First function handles success
                    self.content = response.data;
                    alert('Review and Rank posted successfully');
                }, function (response) {
                    console.log(response);
                    alert('no success posting rank')
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

