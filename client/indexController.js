angular.module('citiesApp')
    .controller('indexController', ['$scope', 'userManager', '$http', function ($scope, userManager, $http) {

        let self = this;
        self.show_register = true;
        self.show_login = true;
        self.getUser = userManager.getUser;
        let serverUrl = 'http://localhost:8080/';
        self.sites = {};
        self.favorits = [];
        self.poi = {};
        self.poiUrls = {};
        self.reviews = {};
        self.categories = {};
        var mymap;
        self.loadCategoriesFromApi = function () {
            $http.get("http://localhost:8080/users/categories")
                .then(function (response) {
                    //First function handles success
                    self.categories = response.data;
                }, function (response) {
                    console.log(response);
                    alert('No details on this site')
                });
        }


        $scope.$on('show-modal', function (ev, args) {
            self.showPoiModalFunc(args.id);
        });

        self.loadCategoriesFromApi();

        var modal = document.getElementById('myModal');
        var modalRank = document.getElementById('rankModal');
        var span = document.getElementsByClassName("close")[0];
        var span2 = document.getElementsByClassName("close")[1];
        $(':radio').change(function () {
            self.rank = this.value;
        });

        self.isLoggedIn = function () {
            return userManager.getUser() !== undefined;
        };

        self.logout = function () {
            userManager.clearUser();
        };

        self.getFavoritesCount = function () {
            return Object.keys(userManager.favorites).length;
        };


        self.showPoiModalFunc = function (id) {
            $http.get(serverUrl + "sites/site/" + id)
                .then(function (response) {
                    //First function handles success
                    self.poi = response.data;

                    //--------------------------------------------

                    mymap = L.map('mapid').setView(JSON.parse(self.poi[0].location), 13);
                    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYXNhZndsbyIsImEiOiJjamllZTRmMTMwbDltM3ZxbGhlM29kZDBpIn0.-0ZZJdMhqW_KMr0jixoh7A', {
                        attribution: '',
                        maxZoom: 18,
                        id: 'mapbox.streets'
                    }).addTo(mymap);
                    L.marker(JSON.parse(response.data[0].location)).addTo(mymap)
                        .openPopup();
                    //--------------------------------------------
                    if (userManager.isFavorite(self.poi[0].siteID))
                        self.poi[0].favoritImgUrl = "pictures/star.png";
                    else
                        self.poi[0].favoritImgUrl = "pictures/empty_star.png";
                    self.getSiteReviews(self.poi[0].siteID);
                    self.getImagesModal(self.poi[0].siteID);
                    self.poiViews = self.poi[0].views;
                    self.poiCategory = self.categories[self.poi[0].categoryID - 1];
                    self.poiCategoryName = self.poiCategory.categoryName;
                    self.siteVIEWS =
                        {
                            siteID: self.poi[0].siteID,
                        };
                    $http.post(serverUrl + "sites/views/", self.siteVIEWS)
                        .then(function (response) {
                            //First function handles success
                        }, function (response) {
                            console.log(response);
                        });
                }, function (response) {
                    console.log(response);
                    alert('No details on this site')
                });

            modal.style.display = "block";
            //add view to site


        };
        self.openRankModal = function (siteID, openRankModal) {
            if (openRankModal) {
                self.poi = [];
                self.poi[0] = {siteID: siteID};
            }
            //self.poi[0].siteID=siteID;
            modalRank.style.display = "block";
        };

        window.onclick = function (event) {
            if (event.target == modal) {
                clearMap();
            }
        };

        span.onclick = function () {
            clearMap();
        };

        span2.onclick = function () {
            modalRank.style.display = "none"
            // clearMap();
        };

        function clearMap() {
            modal.style.display = "none";
            mymap.off();
            mymap.remove();
        }

        self.getImagesModal = function (siteID) {
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
        self.getSiteCategory = function (siteID) {
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
        self.getSiteReviews = function (siteID) {
            $http.get(serverUrl + "sites/site_reviews/" + siteID)
                .then(function (response) {
                    //First function handles success
                    self.reviews = response.data;
                    if (self.reviews.length === 0) {
                        self.reviews[0] =
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
        self.submitRanking = function (review) {
            if (!review && !self.rankedStar) {
                alert('You must enter at least a numerical review');
                return;
            }
            if (review && !self.rankedStar) {
                alert('You must enter a numerical review');
                return;
            }
            if (review && self.rankedStar) {
                modalRank.style.display = "none";// close the ranking and review modal
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth() + 1; //January is 0!
                var yyyy = today.getFullYear();

                if (dd < 10) {
                    dd = '0' + dd
                }

                if (mm < 10) {
                    mm = '0' + mm
                }
                self.reviewObject =
                    {
                        userName: userManager.getUser().userName,
                        siteID: self.poi[0].siteID,
                        review: review,
                        date: today,
                    }
                self.rankObject =
                    {
                        siteID: self.poi[0].siteID,
                        rank: self.rankedStar,

                    }
                self.submitTextReview();
                self.submitRankReview();

            }
            else if (!review && self.rankedStar) {
                self.rankObject =
                    {
                        siteID: self.poi[0].siteID,
                        rank: self.rankedStar,

                    }
                self.submitRankReview();
            }
        };
        self.submitTextReview = function () {
            $http.post(serverUrl + "reg/review/", self.reviewObject)
                .then(function (response) {
                    //First function handles success
                    self.content = response.data;
                }, function (response) {
                    console.log(response);
                    alert('no success posting review')

                });
        };
        self.submitRankReview = function () {
            $http.post(serverUrl + "reg/rank/", self.rankObject)
                .then(function (response) {
                    //First function handles success
                    self.content = response.data;
                    alert('Your Rank posted successfully');
                    document.getElementById("reviewText").value = "";
                    document.getElementById("myForm").reset();
                    self.review = undefined;
                    self.rankedStar = undefined;

                }, function (response) {
                    console.log(response);
                    alert('no success posting rank')
                });

        };


    }]);
