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

  $scope.ocultarVista = function() {
    
    $location.path('/');
  }
});



// Aquí creamos el módulo principal que depende de los otros dos módulos
angular.module('mainApp', ['ObtenerDatos', 'registro']);




