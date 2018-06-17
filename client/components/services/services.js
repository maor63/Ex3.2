angular.module('citiesApp')
    .service('setHeadersToken', ['$http', function ($http) {
        let self = this;
        let token = "";
        self.recovery=false;

        this.set = function (t) {
            token = t;
            $http.defaults.headers.common[ 'x-access-token' ] = t;
            // $httpProvider.defaults.headers.post[ 'x-access-token' ] = token
            console.log("set")

        };

        this.setCurrToken = function () {
            $http.defaults.headers.common[ 'x-access-token' ] = token;
        };

        this.getTokent = function () {
            return token;
        };
        
        this.isUserConnected = function () {
            return token !== "";
        }
    }])
    .service('userManager', [function () {
        let self = this;
        self.user = undefined;
        self.favorites = [];

        self.setUser = function (userName) {
            self.user = userName;
            self.favorites = [];
        };

        self.getUser = function () {
            return self.user;
        };

        self.clearUser = function () {
            self.user = undefined;
        };

        self.addFavorite = function (site_id) {
            self.favorites.push(site_id);
        };

        self.deleteFavorite = function (site_id) {
            deleteFromArray(self.favorites, site_id);
        }

        self.isFavorite = function (site_id) {
            return self.favorites.indexOf(site_id) > -1;
        }

        function deleteFromArray(array, element) {
            var index = array.indexOf(element);
            if (index > -1) {
                array.splice(index, 1);
            }
        }
    }])
    .service('localStorageModel', ['$localStorage', function($localStorage) {

        var self=this;

        self.addLocalStorage = function (key, value) {
            var dataVal = $localStorage.get(key);
            console.log(dataVal)
            if (!dataVal)
                if ($localStorage.set(key, value)) {
                    console.log("data added")
                }
                else
                    console.log('failed to add the data');
        }



        self.getLocalStorage= function (key)
        {
            return  $localStorage.get(key)
        }

        self.updateLocalStorage = function (key,value)
        {
            $localStorage.remove(key);
            $localStorage.set(key,value);
        }



    }])
;
