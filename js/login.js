"use strict";

localStorage.clear();

angular.module('registro', []).controller('reg', function($scope){

    $scope.cargar = function(){
        var email = $scope.email;
        console.log(email);
        var contraseña = $scope.password;
        console.log(contraseña);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
    
        var raw = JSON.stringify({
        "email": email,
        "password": contraseña,
        });
    
        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };
    
        
        fetch("http://127.0.0.1:3000/api/auth/login", requestOptions)
        .then(response => response.json())
        .then(data => {console.log(data)
            localStorage.setItem('Token', data.secret_token)
            localStorage.setItem('rol', data.role)
            if(localStorage.getItem('rol') == 'admin'){
                window.location.href="/html/pagina_de_administrador.html";
            }
        })
        .catch(error => console.log('error', error));
    };

 });

 