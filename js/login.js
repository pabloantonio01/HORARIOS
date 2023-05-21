"use strict";

localStorage.clear();

angular.module('registro', []).controller('reg', function($scope){

    $scope.cargar = function(){
        var email = $scope.email;
        var contraseña = $scope.password;
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
    
        var raw = JSON.stringify({
        "correo": email,
        "password": contraseña,
        });
    
        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };
    
        fetch("https://restlabingsoft-production-0999.up.railway.app/api/auth/login", requestOptions)
        .then(response => response.json())
        .then(
            result => {console.log(result.token)
            localStorage.setItem('Token', result.token)
            localStorage.setItem('Rol', result.usuario.rol)
            localStorage.setItem('Estado', result.usuario.estado)
            if(localStorage.getItem("Estado")=="true"){
    
                if(localStorage.getItem("Rol")== "USER_ROLE"){
                    window.location.href="/html/pagina_videos.html"
                }
                else{
                    window.location.href="/html/pagina_de_administrador.html"
                }
            }
            })
            .catch(error => console.log('error', error));
    };

 });

 