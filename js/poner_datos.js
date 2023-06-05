"use strict";

var obtenerDatos = angular.module('ObtenerDatos', []);  // Cambia 'Obtener datos' a 'ObtenerDatos'
obtenerDatos.controller('datos', function($scope){
  // Código del controlador
});


var registro = angular.module('registro', ['ngRoute']);
registro.config(function($routeProvider) {
  $routeProvider
    .when('/registro_usuario', {
      
      templateUrl : '/html/registro_usuario.html',
      controller  : 'RegistroController'
    })
    .otherwise({
      redirectTo: '/'
    });
});

registro.config(function($routeProvider) {
  $routeProvider
    .when('/registro_categoria', {
      
      templateUrl : '/html/registro_categoria.html',
      controller  : 'RegistroController'
    })
    .otherwise({
      redirectTo: '/'
    });
});

registro.config(function($routeProvider) {
  $routeProvider
    .when('/registro_video', {
      
      templateUrl : '/html/registro_video.html',
      controller  : 'RegistroController'
    })
    .otherwise({
      redirectTo: '/'
    });
});

registro.config(function($routeProvider) {
  $routeProvider
    .when('/modificar_usuario', {
      
      templateUrl : '/html/modificar_usuario.html',
      controller  : 'RegistroController'
    })
    .otherwise({
      redirectTo: '/'
    });
});


registro.config(function($routeProvider) {
  $routeProvider
    .when('/modificar_categoria', {
      
      templateUrl : '/html/modificar_categoria.html',
      controller  : 'RegistroController'
    })
    .otherwise({
      redirectTo: '/'
    });
});

registro.config(function($routeProvider) {
  $routeProvider
    .when('/modificar_video', {
      
      templateUrl : '/html/modificar_video.html',
      controller  : 'RegistroController'
    })
    .otherwise({
      redirectTo: '/'
    });
});

registro.config(function($routeProvider) {
  $routeProvider
    .when('/eliminar_usuario', {
      
      templateUrl : '/html/eliminar_usuario.html',
      controller  : 'RegistroController'
    })
    .otherwise({
      redirectTo: '/'
    });
});

registro.config(function($routeProvider) {
  $routeProvider
    .when('/eliminar_categoria', {
      
      templateUrl : '/html/eliminar_categoria.html',
      controller  : 'RegistroController'
    })
    .otherwise({
      redirectTo: '/'
    });
});

registro.config(function($routeProvider) {
  $routeProvider
    .when('/eliminar_video', {
      
      templateUrl : '/html/eliminar_video.html',
      controller  : 'RegistroController'
    })
    .otherwise({
      redirectTo: '/'
    });
});
registro.controller('RegistroController', function($scope, $location){
  // código del controlador

  // Para cargar información sobre usuarios
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + localStorage.getItem('Token'));

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch("http://127.0.0.1:3000/api/users", requestOptions)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log('error', error));

  //Para cargar información sobre categorías
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + localStorage.getItem('Token'));

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch("http://127.0.0.1:3000/api/categorias", requestOptions)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log('error', error));

  //Para cargar información sobre vídeos
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + localStorage.getItem('Token'));

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch("http://127.0.0.1:3000/api/videos", requestOptions)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log('error', error));

  $scope.ocultarVista = function() {
    
    $location.path('/');
  }
});



// Aquí creamos el módulo principal que depende de los otros dos módulos
angular.module('mainApp', ['ObtenerDatos', 'registro']);




