"use strict";

localStorage.clear();

angular.module('registro', [])
    
    .controller('reg', function($scope){
        $scope.registered = false;
        $scope.user = "";
        $scope.password = "";

        $scope.registrar = function(){
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "email": $scope.email,
                "password": $scope.password
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                mode: 'no-cors',
                body: raw,
                redirect: 'follow'
            };

            fetch("http://127.0.0.1:3000/api/auth/login", requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));
        };

    });

    


 