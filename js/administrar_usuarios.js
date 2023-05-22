"use strict";

angular.module("administracion_usuarios", []).controller("users", function($scope){

    $scope.registrarUsuario = function(){
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem('Token'));
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "nombre": $scope.name,
            "correo": $scope.email,
            "password": $scope.password
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://restlabingsoft-production-0999.up.railway.app/api/usuarios", requestOptions)
            .then(response => response.json())
            .then(result => {console.log(result)
            window.location.href="/html/pagina_de_administrador.html"})
            .catch(error => console.log('error', error));
    }

    $scope.modificarUsuario = function(){
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem('Token'));
        myHeaders.append("Content-Type", "application/json");
    
        var raw = JSON.stringify({
            "nombre": $scope.new_name
          });
          
          var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
          };
    
          fetch("https://restlabingsoft-production-0999.up.railway.app/api/usuarios/" + $scope.id_user, requestOptions)
            .then(response => response.json())
            .then(result => {console.log(result)
                window.location.href="/html/pagina_de_administrador.html"})
            .catch(error => console.log('error', error));
    }

    $scope.eliminarUsuario = function(){
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem('Token'));

        var raw = "";

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://restlabingsoft-production-0999.up.railway.app/api/usuarios/" + $scope.id_user)
            .then(response => response.text())
            .then(result => {console.log(result)
                window.location.href="/html/pagina_de_administrador.html"})
            .catch(error => console.log('error', error));
    }
    
});