angular.module('citiesApp')
    .controller('favoritesController', ['$rootScope','$http', 'userManager','tools', function ($rootScope,$http, userManager, tools) {
        self = this;
        self.favorites = [];
        if (userManager.getUser() !== undefined) {
            self.favorites = Object.values(userManager.favorites);
        }
        self.showPoiModalFunc = function(id){
            $rootScope.$broadcast('show-modal', {id: id});
        };
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