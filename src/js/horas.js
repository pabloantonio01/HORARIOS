"use strict";

var obtenerhora = angular.module('hora', []); 
obtenerhora.controller('datos', function($scope) {
    // Lista de horas
    $scope.horas = ['10:00-14:00 S', '14:00-16:00 S', '16:00-20:00 S', '10:00-14:00 D', '14:00-16:00 D', '16:00-20:00 D'];

    // Variables para controlar la selección
    $scope.selectedClass = null;
    $scope.selectedHora = null;

    // Variable para almacenar la selección en formato JSON
    $scope.seleccion = null; // Asegúrate de que esta variable esté en el scope

    // Función para seleccionar el aula y la hora
    $scope.selectClass = function(boton, hora) {
        if ($scope.selectedClass === boton && $scope.selectedHora === hora) {
            $scope.selectedClass = null;
            $scope.selectedHora = null;
        } else {
            $scope.selectedClass = boton;
            $scope.selectedHora = hora;
        }
    };

    // Función para guardar la selección en la variable JSON
    $scope.guardarSeleccion = function() {
        if ($scope.selectedClass && $scope.selectedHora) {
            $scope.seleccion = {  // Guardamos en $scope.seleccion
                aula: $scope.selectedClass,
                hora: $scope.selectedHora
            };

            // Muestra la selección en la consola
            console.log("Selección guardada:", $scope.seleccion);

            // Limpiar la selección
            $scope.selectedClass = null;
            $scope.selectedHora = null;
        } else {
            alert("Selecciona una hora y un aula antes de guardar.");
        }
    };

    // Función para enviar la selección al servidor (POST request)
    $scope.registrarHora = function() {
        console.log('HOLA MUNDO');
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem('Token'));
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify($scope.seleccion); // Asegúrate de convertirlo a JSON

        console.log(raw);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://127.0.0.1:3000/api/horario", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result);

                if (result.error) {
                    alert(result.error); // Mostrar el error al usuario
                } else {
                    // Manejo de éxito
                    console.log(result);
                    window.location.reload();
                }
            })
            .catch(error => {
                // En caso de un error inesperado
                
                console.log('error', error);
            });
    };


    $scope.pedirAula = function() {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem('Token'));
    
        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };
    
        fetch("http://localhost:3000/api/know/horario", requestOptions)
        .then((response) => response.json())
        .then(data => {
            console.log(data);
            // Asumiendo que el servidor devuelve un array de objetos con información sobre las aulas ocupadas
            $scope.ocupadas = data;  // Asegúrate de que esta sea la estructura correcta
            $scope.$apply();  // Descomentar si es necesario para forzar el ciclo digest
        })
        .catch((error) => console.error('Error al pedir las aulas:', error));
    };
    
    // Llama a la función para cargar las aulas ocupadas
    $scope.pedirAula();
    
    $scope.estaOcupada = function(aula, hora) {
        if (!$scope.ocupadas) {
            return false; // Si no se han cargado las aulas, por defecto no estará ocupada
        }
        return $scope.ocupadas.some(function(ocupada) {
            return ocupada.aulas === aula && ocupada.horario === hora;
        });
    };


    $scope.tuhorario = function(){

        console.log('LLegué aquí');
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem('Token'));

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        fetch("http://localhost:3000/api/know/horariotuyo", requestOptions)
        .then((response) => response.json())
        .then((result) => {
            $scope.tuhorario = result; // Guarda el resultado en $scope.tuhorario
            $scope.$apply(); // Asegúrate de que AngularJS detecte el cambio en el modelo
            console.log(result)})
        .catch((error) => console.error(error));


    }
    



    // $scope.borrarHorario = function(){
    //     const myHeaders = new Headers();
    //     myHeaders.append("Authorization", "Bearer " + localStorage.getItem('Token'));


    //     const requestOptions = {
    //     method: "DELETE",
    //     headers: myHeaders,
    //     redirect: "follow"
    //     };

    //     fetch("http://localhost:3000/api/know/horario/borrar", requestOptions)
    //     .then((response) => response.json())
    //     .then((result) => console.log(result))
    //     .catch((error) => console.error(error));



    // }



    $scope.horariosOcupados = [];  // Variable para almacenar el JSON recibido

            // Función para obtener el horario completo desde el servidor
            $scope.horarioCompleto = function(){
                const myHeaders = new Headers();
                myHeaders.append("Authorization", "Bearer " + localStorage.getItem('Token'));

                const requestOptions = {
                    method: "GET",
                    headers: myHeaders,
                    redirect: "follow"
                };

                fetch("http://localhost:3000/api/know/horario/completo", requestOptions)
                .then((response) => response.json())
                .then((result) => {

                    console.log(result);
                    // Ordenar y agrupar primero por el día (Sábado primero, luego Domingo), luego por aula, y finalmente por hora
                    result.sort((a, b) => {
                        // Extraer la última letra de la hora para identificar S (Sábado) y D (Domingo)
                        const dayA = a.horario.slice(-1); // S o D
                        const dayB = b.horario.slice(-1); // S o D
                
                        // Comparar días (Sábado primero, luego Domingo)
                        if (dayA === 'S' && dayB === 'D') return -1;
                        if (dayA === 'D' && dayB === 'S') return 1;
                
                        // Si los días son iguales, comparar las aulas
                        if (a.aulas < b.aulas) return -1;
                        if (a.aulas > b.aulas) return 1;
                
                        // Si las aulas son iguales, comparar las horas
                        if (a.horario < b.horario) return -1;
                        if (a.horario > b.horario) return 1;
                
                        // Si tanto los días, aulas y horas son iguales, son equivalentes
                        return 0;
                    });
                
                    // Guardamos el JSON recibido en $scope.horariosOcupados
                    $scope.horariosOcupados = result;

                    console.log($scope.horariosOcupados);
                    $scope.$apply();  // Forzamos a AngularJS a actualizar la vista
                })
                
                
                
                .catch((error) => console.error(error));
            };

            // Llamar a la función para cargar los datos cuando se inicie el controlador
            $scope.horarioCompleto();






    $(document).ready(function() {
        $('#borrarHorarioBtn').on('click', function() {
            Swal.fire({
                title: '¿Estás seguro?',
                text: "Una vez borrado, no podrás recuperar este horario.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Borrar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Lógica para borrar el horario
                    borrarHorario();
                } else {
                    Swal.fire('Operación cancelada.');
                }
            });
        });

        function borrarHorario() {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + localStorage.getItem('Token'));

            const requestOptions = {
                method: "DELETE",
                headers: myHeaders,
                redirect: "follow"
            };

            fetch("http://localhost:3000/api/know/horario/borrar", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    console.log(result);
                    Swal.fire('Horario borrado con éxito!', '', 'success');
                })
                .catch((error) => {
                    console.error('Error:', error);
                    Swal.fire('Error inesperado!', '', 'error');
                });
        }
    });
    


});







angular.module('mainApp', ['hora']);
