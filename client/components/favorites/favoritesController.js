angular.module('citiesApp')
    .controller('favoritesController', ['$http', 'userManager','tools', function ($http, userManager, tools) {
        self = this;
        self.favorites = [];
        if (userManager.getUser() !== undefined) {
            self.favorites = Object.values(userManager.favorites);
            // $http.get("http://localhost:8080/reg/favorites/" + userManager.getUser().userName).then(function (answer) {
            //     let favorits = answer.data;
            //     for (let i = 0; i < favorits.length; i++) {
            //         let favorite = favorits[i];
            //         if(userManager.isFavorite(favorite.siteID))
            //             continue;
            //         $http.get("http://localhost:8080/sites/site/" + favorite.siteID)
            //             .then(function (answer) {
            //                 let site = answer.data[0];
            //                 $http.get("http://localhost:8080/sites/photo_url/" + favorite.siteID).then(function (answer) {
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
            //
            // }).catch(function (err) {
            //     console.log(err);
            // });
        }

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

        self.removeSite = function (site, index) {
            userManager.updateFavorite(site);
            self.favorites.splice(index, 1);
        };

        function swap(index, index2) {
            let temp = self.favorites[index];
            self.favorites[index] = self.favorites[index2];
            self.favorites[index2] = temp;
        }

        self.swapUp = function (index) {
            if(index > 0){
                swap(index, index - 1);
            }
        };

        self.swapDown = function (index) {
            if(index < self.favorites.length - 1){
                swap(index, index + 1);
            }
        };
        self.saveFavorites = function () {
            let favorites = [];
            for(let i = 0; i <  self.favorites.length; i++){
                favorites.push(self.favorites[i].id);
            }
            let data = {userName: userManager.getUser().userName, favorites: favorites};
            $http.post('http://localhost:8080/reg/del_favorites', data);
            $http.post("http://localhost:8080/reg/add_favorite_sites", data)
        }

    }]);