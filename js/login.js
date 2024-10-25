"use strict";

localStorage.clear();

angular.module('registro', []).controller('reg', function($scope){

    $scope.cargar = function(){
        var email = $scope.email;
        var contraseña = $scope.password;

        // Expresión regular para validar el correo electrónico
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Comprueba si se ingresaron el correo electrónico y la contraseña
        if (!email || !contraseña) {
            alert('Por favor, rellena ambos campos.');
            return;
        }

        // Comprueba si el correo electrónico es válido
        if (!emailRegex.test(email)) {
            alert('Por favor, introduce un correo electrónico válido.');
            return;
        }

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
    
        // fetch("http://127.0.0.1:3000/api/auth/login", requestOptions)
        // .then(response => response.json())
        // .then(
        //     result => {console.log(result.secret_token)
        //     localStorage.setItem('Token', result.secret_token)
        //     localStorage.setItem('Rol', result.role)

        //     if(localStorage.getItem("Rol")== "user"){
        //          window.location.href="/html/horarios.html"
        //     }
        //     else{
        //         window.location.href="/html/horarios.html"
        //     }
        //     })
        //     .catch(error => console.log('error', error));

        fetch("http://127.0.0.1:3000/api/auth/login", requestOptions)
        .then(response => response.json())
        .then(result => {
            // Verificamos si hay un error en la respuesta
            if (result.Error) {
                // Si hay un error, mostramos un mensaje al usuario
                alert(result.Error); // Muestra el mensaje de error
            } else {
                // Si el login fue exitoso, guardamos el token y redirigimos
                console.log(result.secret_token);
                localStorage.setItem('Token', result.secret_token);
                localStorage.setItem('role', result.role);

                if (localStorage.getItem("role") === "admin") {
                    window.location.href = "/html/horarios_administrador.html";
                } else {
                    window.location.href = "/html/horarios.html"; // Puedes ajustar esta parte según tus necesidades
                }
            }
        })
        .catch(error => console.log('error', error));






    };

});
