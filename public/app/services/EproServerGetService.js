app.factory('GetService', ['$http', function($http) {
    return {
        query: function (myUrl) {
            return $http.get(myUrl)
                .success(function (data) {
                    return data;
                })
                .error(function (data) {
                    return data;
                });
        }
    }
}]);