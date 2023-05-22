"use strict";

angular.module('Obtener_datos', []).controller('datos', function($scope){
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + localStorage.getItem("Token"));

    var raw = "";

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("https://restlabingsoft-production-0999.up.railway.app/api/usuarios?limite=60&desde=0", requestOptions)
        .then(response => response.json())
        .then(result => $scope.cargarUsuarios(result))
        .catch(error => console.log('error', error));

    fetch("https://restlabingsoft-production-0999.up.railway.app/api/categorias?limite=60&desde=0", requestOptions)
        .then(response => response.json())
        .then(result => $scope.cargarCategorias(result))
        .catch(error => console.log('error', error));

    fetch("https://restlabingsoft-production-0999.up.railway.app/api/videos?limite=120&desde=0", requestOptions)
        .then(response => response.json())
        .then(result => $scope.cargarVideos(result))
        .catch(error => console.log('error', error));
    
    $scope.cargarUsuarios = function(result){
        $scope.resUsuarios = result;
        console.log($scope.resUsuarios)
    }

    $scope.cargarCategorias = function(result){
        $scope.resCategorias = result;
        console.log($scope.resCategorias)
    }

    $scope.cargarVideos = function(result){
        $scope.resVideos = result;
        console.log($scope.resVideos)
    }

});