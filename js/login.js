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
            myHeaders.append("Cookie", "connect.sid=s%3AUzfNw9MpnLd_WGa1Q7OrbPlXlzUy9Z_x.wpMv0E4b4AfPFjqo8ci2l9mcfmiaFb7rvxsp7TCMNOI");

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
                .then(response => response.text())
                .then(result => {window.location.href="/html/pagina_de_administrador.html"})
                .catch(error => console.log('error', error));
        };

    });

    


 