"use strict";

localStorage.clear();

angular.module('registro', [])
    
    .controller('reg', function($scope){
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
                body: raw,
                mode: 'no-cors',
                redirect: 'follow'
            };

            fetch("http://127.0.0.1:3000/api/auth/login", requestOptions)
                .then(response => console.log(response))
                .then(result => {console.log(result)})
                .catch(error => console.log('error', error));
        };

    });

    


 