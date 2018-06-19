angular.module('citiesApp')
    .controller('favoritesController', ['$http', 'userManager', function ($http, userManager) {
        self = this;
        self.favorits = [];
        if (userManager.getUser() !== undefined) {
            self.favorits = Object.values(userManager.favorites);
            $http.get("http://localhost:8080/reg/favorites/" + userManager.getUser().userName).then(function (answer) {
                let favorits = answer.data;
                for (let i = 0; i < favorits.length; i++) {
                    let favorite = favorits[i];
                    if(userManager.isFavorite(favorite.siteID))
                        continue;
                    $http.get("http://localhost:8080/sites/site/" + favorite.siteID)
                        .then(function (answer) {
                            let site = answer.data;
                            self.favorits.push(
                                {
                                    id: site.siteID,
                                    name: site["siteName"],
                                    image: getRandomSubarray(answer.data, 1)[0].url,
                                    favoritImgUrl: "pictures/star.png",
                                    position: userManager.getNextPosition()
                                });
                        });
                }

            }).catch(function (err) {
                console.log(err);
            });


        }

        self.removeSite = function (site) {
            userManager.updateFavorite(site);
        };

    }]);