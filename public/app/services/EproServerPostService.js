app.factory('PostService', ['$http', function($http) {
    return {
        query : function($url,$data) {
            return $http(
                {
                    url : $url,
                    method : 'POST',
                    headers : {'Content-Type': 'application/json'},
                    data : JSON.stringify($data)
                })
                .success(function(data, status, headers, config) {
                    return data;
                })
                .error(function(data, status, headers, config) {
                    return data;
                });
        }
    }
}]);