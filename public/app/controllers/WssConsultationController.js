var rootPath = "http://localhost:3000/wsrest"

var wsList = [
    {path : rootPath+"/settingsinstance", params : []},
    {path : rootPath+"/study", params : {name:""}},
    {path : rootPath+"/sites", params : {studyname:""}},
    {path : rootPath+"/users", params : {studyname:"", sitenumber:""}},
    {path : rootPath+"/metadata", params : {studyname:""}}
]

var setWssModel = function getWssModel($scope,GetService, $wsElement,_baseValuesQuery) {
    GetService.query($wsElement.path).success(function(data) {
        $scope.data = data;
    });
    $scope.params = $wsElement.params
}


app.controller('WssInstanceController', ['PostService','GetService', '$scope', '$controller', function(PostService,GetService,$scope,$controller) {
    setWssModel($scope, GetService, wsList[0], undefined);
}]);


app.controller('WssStudyController', ['PostService','GetService', '$scope', '$controller', function(PostService,GetService,$scope,$controller) {
    setWssModel($scope, GetService, wsList[1], undefined);
}]);