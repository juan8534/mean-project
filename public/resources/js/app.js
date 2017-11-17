
var app = angular.module('multas', []);

app.controller('multasController', function ($scope, $http) {
    
    $scope.loader = {
        loading: false
    };
    
    $scope.showCreateForm = function () {
        // clear form
        $scope.clearForm();

        // change modal title
        $('#modal-product-title').text('Añadir calificaciones');

        // hide update product button
        $('#btn-update-product').hide();

        // show create product button
        $('#btn-create-product').show();

    };

    // Clear form values
    $scope.clearForm = function () {
        $scope.id = "";
        $scope.nocontrol = "";
        $scope.materia = "";
        $scope.calificacion = "";
    };
    
    // Hide Form fields 
    $scope.hideFormFields = function () {
        $('#form-dinminder').hide();
    };
    
    // Show Form fields 
    $scope.showFormFields = function () {
        $('#form-dinminder').show();
    };

    //Read all entries
    $scope.getAll = function () {
        
        $scope.loader.loading = true;
        
        $http.get("api/list")
            .success(function (response) {
                if (response.error === 2) {
					//if error code is returned from node code, then there are no entries in db!
					$scope.statustext = "There are currently no products available!";
					$scope.loader.loading = false;
				} else {
					$scope.datos = response.multa;
					//Turn off spinner
					$scope.loader.loading = false;
					$scope.statustext = "";
				}
            })
            .error(function (data, status, headers, config) {
                $scope.loader.loading = false;
                $scope.statustext = "There was an error fetching data, please check database connection!";
            });
    };

    // Read product by ID
    $scope.readOne = function (id) {
        // clear modal content
        $scope.clearForm();
        $scope.hideFormFields();
        
        // change modal title
        $('#modal-product-title').text("Editar Calificacion");

        // show udpate product button
        $('#btn-update-product').show();

        // show create product button
        $('#btn-create-product').hide();
        
        $scope.loader.loading = true;

        // get id 
        $http.get('api/list/' + id)
            .success(function (data, status, headers, config) {
                //Show fields
                $scope.showFormFields();
                // put the values in form
                $scope.id = data.calificaciones[0].id;
                $scope.nocontrol_alumno = data.calificaciones[0].nocontrol_alumno;
                $scope.materia = data.calificaciones[0].materia;
                $scope.calificacion = data.calificaciones[0].calificacion;

                // show modal
                $('#myModal').modal('show');
                //Turn off spinner
                $scope.loader.loading = false;
            })
            .error(function (data, status, headers, config) {
                //Turn of spinner & display error
                $scope.loader.loading = false;
                $scope.modalstatustext = "There was an error fetching data";
            });
    };

    // Create Product
    $scope.createCalificacion = function () {
        
        $scope.loader.loading = true;
        
        $http.post('/api/insert', {
            'nocontrol_alumno' : $scope.nocontrol_alumno,
            'materia' : $scope.materia,
            'calificacion' : $scope.calificacion
        })
            .success(function (data, status, headers, config) {
                // close modal
                $('#myModal').modal('hide');

                // clear modal content
                $scope.clearForm();

                // refresh the product list
                $scope.getAll();
            })
            .error(function (data, status, headers, config) {
                $scope.loader.loading = false;
                $scope.modalstatustext = "No se pudieron insertar los datos!!!";
            });
    };
	
	// update product record / save changes
    $scope.updateCalificacion = function () {
        
        $scope.loader.loading = true;
        
        $http.put('/api/update', {
            'id' : $scope.id,
            'nocontrol_alumno' : $scope.nocontrol_alumno,
            'materia' : $scope.materia,
            'calificacion' : $scope.calificacion
        })
            .success(function (data, status, headers, config) {
                // close modal
                $('#myModal').modal('hide');

                // clear modal content
                $scope.clearForm();

                // refresh the product list
                $scope.getAll();
            })
            .error(function (data, status, headers, config) {
                $scope.loader.loading = false;
                $scope.modalstatustext = "Unable to Update data!";
            });
    };

    //Delete product
    $scope.deleteCalificacion = function (id) {
        $scope.loader.loading = true;
		
        $http.post('/api/delete', {
            'id' : id
        })
            .success(function (data, status, headers, config) {
				//The modal id is the #confirm + id ( d.id ) passed into function.
				//The confirm modal is unique to the ID (#confirm+ID) of the product.
                $('#confirm' + id).modal('hide');
                // refresh the list
                $scope.getAll();
            })
            .error(function (data, status, headers, config) {
                $scope.modalstatustext = "Unable to delete data!";
				// refresh the list
                $scope.getAll();
            });
    };



});
/**
 * Users Controller
 */
var app = angular.module('users', []);

app.controller('usersController', function ($scope, $http) {
    
    $scope.loader = {
        loading: false
    };

    $scope.clearForm = function () {
        $scope.id_cedulapro = "";
        $scope.nombre = "";
        $scope.apellido = "";        
    };

    $scope.hideFormFields = function () {
        $('#form-dinminder').hide();
    };

    /**
    * Functions angular Users
    */

    $scope.getAllUsers = function () {
        
        $scope.loader.loading = true;
    
    //List Users
    $http.get('api/list/user')
        .success(function (response) {
            if (response.error === 2) {
			    //if error code is returned from node code, then there are no entries in db!
				$scope.statustext = "There are currently no products available!";
				$scope.loader.loading = false;
			} else {
				$scope.datos = response.user;
				//Turn off spinner
				$scope.loader.loading = false;
				$scope.statustext = "";
				}
            })
            .error(function (data, status, headers, config) {
                $scope.loader.loading = false;
                $scope.statustext = "There was an error fetching data, please check database connection!";
            });
    };


    //Create USers
    $scope.createUser = function () {
        
        $scope.loader.loading = true;
        
        $http.post('/api/insert/user', {
            'id_cedulapro' : $scope.id_cedulapro,
            'nombre' : $scope.nombre,
            'apellido' : $scope.apellido
        })
            .success(function (data, status, headers, config) {                
                window.location.href = '/index.html';
            })
            .error(function (data, status, headers, config) {
                $scope.loader.loading = false;
                $scope.modalstatustext = "No se pudieron insertar los datos!!!";
            });
    };

    //Delete Users
    $scope.deleteUser = function (id) {
        $scope.loader.loading = true;
		
        $http.post('/api/delete/user', {
            'id_cedulapro' : id
        })
            .success(function (data, status, headers, config) {
				//The modal id is the #confirm + id ( d.id ) passed into function.
				//The confirm modal is unique to the ID (#confirm+ID) of the product.
                $('#confirm' + id).modal('hide');
                // refresh the list
                $scope.getAllUsers();
            })
            .error(function (data, status, headers, config) {
                $scope.modalstatustext = "Unable to delete data!";
				// refresh the list
                $scope.getAllUsers();
            });
    };

    //Read One
    $scope.readOneUser = function (id) {
        
        // clear modal content
        $scope.clearForm();
       // $scope.hideFormFields();
        
        // change modal title
        $('#modal-product-title').text("Editar Usuario");

        // show udpate product button
        $('#btn-update-product').show();

        // show create product button
        $('#btn-create-product').hide();
        
        $scope.loader.loading = true;

        // get id 
        $http.get('api/list/user' + id)
            .success(function (data, status, headers, config) {                
                // put the values in form
                $scope.id_cedulapro = data.user[0].id_cedulapro;
                $scope.nombre = data.user[0].nombre;
                $scope.apellido = data.user[0].apellido;                

                // show modal
                $('#myModal').modal('show');
                //Turn off spinner
                $scope.loader.loading = false;
            })
            .error(function (data, status, headers, config) {
                //Turn of spinner & display error
                $scope.loader.loading = false;
                $scope.modalstatustext = "There was an error fetching data";
            });
    };

    // update product record / save changes
    $scope.updateUser = function () {
        
        $scope.loader.loading = true;
        
        $http.put('/api/update/user', {
            'id_cedulapro' : $scope.id_cedulapro,
            'nombre' : $scope.nombre,
            'apellido' : $scope.apellido            
        })
            .success(function (data, status, headers, config) {
                window.location.href = '/usuarios.html';                
            })
            .error(function (data, status, headers, config) {
                $scope.loader.loading = false;
                $scope.modalstatustext = "Unable to Update data!";
            });
    };

});

/**
 * Vehicles Contorller
 */

var app = angular.module('vehicles', []);

app.controller('vehiclesController', function ($scope, $http) {

$scope.loader = {
    loading: false
};

$scope.getAllVehicles = function () {
        
        $scope.loader.loading = true;


    //List Vehicles
    $http.get('api/list/vehicles')
            .success(function (response) {
                if (response.error === 2) {
                    //if error code is returned from node code, then there are no entries in db!
                    $scope.statustext = "There are currently no products available!";
                    $scope.loader.loading = false;
                } else {
                    $scope.datos = response.vehicles;
                    //Turn off spinner
                    $scope.loader.loading = false;
                    $scope.statustext = "";
                    }
                })
                .error(function (data, status, headers, config) {
                    $scope.loader.loading = false;
                    $scope.statustext = "There was an error fetching data, please check database connection!";
                });
    };

    //Create Vehicles
    $scope.createVehicle = function () {
        
        $scope.loader.loading = true;
        
        $http.post('/api/insert/vehicle', {
            'placa' : $scope.placa,
            'modelo' : $scope.modelo,
            'fecha_modelo' : $scope.fecha_modelo,
            'id_propietario' : $scope.id_propietario
        })
            .success(function (data, status, headers, config) {                
                window.location.href = '/vehiculos.html';
            })
            .error(function (data, status, headers, config) {
                $scope.loader.loading = false;
                $scope.modalstatustext = "No se pudieron insertar los datos!!!";
            });
    };
    
    //Delete Users
    $scope.deleteVehicle = function (id) {
        $scope.loader.loading = true;
		
        $http.post('/api/delete/vehicle', {
            'placa' : id
        })
            .success(function (data, status, headers, config) {
				//The modal id is the #confirm + id ( d.id ) passed into function.
				//The confirm modal is unique to the ID (#confirm+ID) of the product.
                $('#confirm' + id).modal('hide');
                // refresh the list
                $scope.getAllVehicles();
            })
            .error(function (data, status, headers, config) {
                $scope.modalstatustext = "Unable to delete data!";
				// refresh the list
                $scope.getAllVehicles();
            });
    };

});