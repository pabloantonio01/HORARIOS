var app = angular.module('myApp', ['ngSanitize']);

app.controller('myCtrl', function($scope, $http, $sce) {
    var catchedtoken = localStorage.getItem('Token');
    var config = {
        headers: {
            'Authorization': 'Bearer ' + catchedtoken,
            'Content-Type': 'application/json'
        }
    };

    $http.get("http://localhost:3000/api/categorias", config).then(function(response) {
        console.log(response.data);
        $scope.categorias = response.data;
    });

    $http.get("http://localhost:3000/api/videos", config).then(function(response) {
        console.log(response.data);
        $scope.productos = response.data;
    });

    $scope.openVideo = function(url) {
        window.open(url);
    };

    
    

    $scope.getEmbedUrl = function(url) {
        return $sce.trustAsResourceUrl(url);
    };
});
