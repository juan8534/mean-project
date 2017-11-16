var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require("body-parser");


//LOGGER
var log4js = require('log4js');
//log4js.configure('../config/log4js.json');
var log = log4js.getLogger("server");


//STATIC FILES
app.use(express.static('public'));
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Body parser use JSON data

/*MY SQL Connection Info*/
var pool = mysql.createPool({
	connectionLimit : 25,
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'multas',
	port :'3306'
});

log.debug('Server is starting....');

//TEST CONNECTION
pool.getConnection(function (err, connection) {
	if (!err) {
		console.log("Conexion a la base de datos exitosa!!! ... ");
		log.info('La base de datos esta conectada!!! ... ');
		connection.release();
	} else {
		console.log("Error conectando a la base de datos ... ");
		log.error('Error connectando a la base de datos ... ');
	}
	console.log("Realizando conexion ... ");
});

// ROOT - Loads Angular App
app.get('/', function (req, res) {
	res.sendFile( __dirname + "/" + "index.html" );
});
/**
 * Functions Sanction
 */
// This responds a GET request for the /list page.
app.get('/api/list', function (req, res) {
	console.log("GET Request :: /list");
	log.info('GET Request :: /list');
	var data = {
        "error": 1,
        "multa": ""
    };
	
	pool.getConnection(function (err, connection) {
		connection.query('SELECT nombre,apellido,fecha_multa,id_placa,estado_multa,valor_multa from multa, propietario WHERE propietario.id_cedulapro = multa.id_cedula;', function (err, rows, fields) {
			connection.release();

			if (rows.length !== 0 && !err) {
				data["error"] = 0;
				data["multa"] = rows;
				res.json(data);
			} else if (rows.length === 0) {
				//Error code 2 = no rows in db.
				data["error"] = 2;
				data["multa"] = 'No hay calificaciones encontradas..';
				res.json(data);
			} else {
				data["multa"] = 'Error al realizar la consulta';
				res.json(data);
				console.log('Error al realizar la consulta: ' + err);
				log.error('Error al realizar la consulta: ' + err);
			}
		});
	
	});
});

//UPDATE sanction
app.put('/api/update', function (req, res) {
    var id = req.body.id;
    var nocontrol_alumno = req.body.nocontrol_alumno;
    var materia = req.body.materia;
    var calificacion = req.body.calificacion;
    var data = {
        "error": 1,
        "calificaciones": ""
    };
	console.log('PUT Request :: /update: ' + id);
	log.info('PUT Request :: /update: ' + id);
    if (!!id && !!nocontrol_alumno && !!materia && !!calificacion) {
		pool.getConnection(function (err, connection) {
			connection.query("UPDATE calificaciones SET nocontrol_alumno = ?, materia = ?, calificacion = ? WHERE id=?",[nocontrol_alumno,  materia, calificacion, id], function (err, rows, fields) {
				if (!!err) {
					data["calificaciones"] = "Error actualizando los datos!!";
					console.log(err);
					log.error(err);
				} else {
					data["error"] = 0;
					data["calificaciones"] = "Registro actualiado correctamente";
					console.log("Actualizado: " + [id, nocontrol_alumno, materia, calificacion]);
					log.info("Actualizado: " + [id, nocontrol_alumno, materia, calificacion]);
				}
				res.json(data);
			});
		});
    } else {
        data["calificaciones"] = "Porfavor llene todos los caampos (i.e : id, nocontrol, materia, calificacion)";
        res.json(data);
    }
});

//LIST sanction by ID
/* app.get('/api/list/:id', function (req, res) {
	var id = req.params.id;
	var data = {
        "error": 1,
        "calificaciones": ""
    };
	
	console.log("GET request :: /list/" + id);
	log.info("GET request :: /list/" + id);
	pool.getConnection(function (err, connection) {
		connection.query('SELECT * from calificaciones WHERE id = ?', id, function (err, rows, fields) {
			connection.release();
			
			if (rows.length !== 0 && !err) {
				data["error"] = 0;
				data["calificaciones"] = rows;
				res.json(data);
			} else {
				data["calificaciones"] = 'No product Found..';
				res.json(data);
				console.log('Error while performing Query: ' + err);
				log.error('Error while performing Query: ' + err);
			}
		});
	
	});
}); */ 

//INSERT new sanction
app.post('/api/insert', function (req, res) {
    var nocontrol_alumno = req.body.nocontrol_alumno;
    var materia = req.body.materia;
    var calificacion = req.body.calificacion;
    var data = {
        "error": 1,
        "calificaciones": ""
    };
	console.log('POST Request :: /insert: ');
	log.info('POST Request :: /insert: ');
    if (!!nocontrol_alumno && !!materia && !!calificacion) {
		pool.getConnection(function (err, connection) {
			connection.query("INSERT INTO calificaciones SET nocontrol_alumno = ?, materia = ?, calificacion = ?",[nocontrol_alumno,  materia, calificacion], function (err, rows, fields) {
				if (!!err) {
					data["calificaciones"] = "Error Adding data";
					console.log(err);
					log.error(err);
				} else {
					data["error"] = 0;
					data["calificaciones"] = "Registro añadido correctamente";
					console.log("Added: " + [nocontrol_alumno, materia, calificacion]);
					log.info("Added: " + [nocontrol_alumno, materia, calificacion]);
				}
				res.json(data);
			});
        });
    } else {
        data["calificaciones"] = "Todos los campos son obligatorios!!!";
        res.json(data);
    }
});

//DELETE sanction
app.post('/api/delete', function (req, res) {
    var id = req.body.id;
    var data = {
        "error": 1,
        "calificaciones": ""
    };
	console.log('DELETE Request :: /delete: ' + id);
	log.info('DELETE Request :: /delete: ' + id);
    if (!!id) {
		pool.getConnection(function (err, connection) {
			connection.query("DELETE FROM calificaciones WHERE id=?",[id],function (err, rows, fields) {
				if (!!err) {
					data["calificaciones"] = "Error deleting data";
					console.log(err);
					log.error(err);
				} else {
					data["calificaciones"] = 0;
					data["calificaciones"] = "Registro eliminado correctamente";
					console.log("Deleted: " + id);
					log.info("Deleted: " + id);
				}
				res.json(data);
			});
		});
    } else {
        data["calificaciones"] = "Please provide all required data (i.e : id ) & must be a integer";
        res.json(data);
    }
});


/**
 * Functions User
 */

 //Create User
app.post('/api/insert/user', function (req, res) {
    var id_cedulapro = req.body.id_cedulapro;
    var nombre = req.body.nombre;
    var apellido = req.body.apellido;
    var data = {
        "error": 1,
        "propietario": ""
    };
	console.log('POST Request :: /insert: ');
	log.info('POST Request :: /insert: ');
    if (!!id_cedulapro && !!nombre && !!apellido) {
		pool.getConnection(function (err, connection) {
			connection.query("INSERT INTO propietario SET id_cedulapro = ?, nombre = ?, apellido = ?",[id_cedulapro,  nombre, apellido], function (err, rows, fields) {				
				if (!!err) {
					data["propieatario"] = "Error insertando registro";
					console.log(err);
					log.error(err);
				} else {
					data["error"] = 0;
					data["propieatario"] = "Registro añadido correctamente";
					console.log("Added: " + [id_cedulapro, nombre, apellido]);
					log.info("Added: " + [id_cedulapro, nombre, apellido]);					
				}
				res.json(data);
			});
        });
    } else {
        data["propietario"] = "Todos los campos son obligatorios!!!";
        res.json(data);
    }
});

 //List Users
app.get('/api/list/user', function (req, res) {
	console.log("GET Request :: /list");
	log.info('GET Request :: /list');
	var data = {
        "error": 1,
        "user": ""
    };
	
	pool.getConnection(function (err, connection) {
		connection.query('SELECT id_cedulapro,nombre,apellido from propietario;', function (err, rows, fields) {
		connection.release();

			if (rows.length !== 0 && !err) {
				data["error"] = 0;
				data["user"] = rows;
				res.json(data);
			} else if (rows.length === 0) {
			//Error code 2 = no rows in db.
				data["error"] = 2;
				data["user"] = 'No hay usuarios encontrados..';
				res.json(data);
			} else {
				data["user"] = 'Error al realizar la consulta';
				res.json(data);
				console.log('Error al realizar la consulta: ' + err);
				log.error('Error al realizar la consulta: ' + err);
			}
		});
	
	});

});

//DELETE User
app.post('/api/delete/user', function (req, res) {
    var id = req.body.id_cedulapro;
    var data = {
        "error": 1,
        "user": ""
    };
	console.log('DELETE Request :: /delete: ' + id);
	log.info('DELETE Request :: /delete: ' + id);
    if (!!id) {
		pool.getConnection(function (err, connection) {
			connection.query("DELETE FROM propietario WHERE id_cedulapro=?",[id],function (err, rows, fields) {
				if (!!err) {
					data["propietario"] = "Error deleting data";
					console.log(err);
					log.error(err);
				} else {
					data["propietario"] = 0;
					data["propietario"] = "Registro eliminado correctamente";
					console.log("Deleted: " + id);
					log.info("Deleted: " + id);
				}
				res.json(data);
			});
		});
    } else {
        data["propietario"] = "Please provide all required data (i.e : id ) & must be a integer";
        res.json(data);
    }
});

//LIST user by ID
app.get('/api/list/user:id_cedulapro', function (req, res) {
	var id = req.params.id_cedulapro;
	var data = {
        "error": 1,
        "user": ""
    };
	
	console.log("GET request :: /list/" + id);
	log.info("GET request :: /list/" + id);
	pool.getConnection(function (err, connection) {
		connection.query('SELECT id_cedulapro,nombre,apellido from propietario WHERE id_cedulapro = ?', id, function (err, rows, fields) {
			connection.release();
			
			if (rows.length !== 0 && !err) {
				data["error"] = 0;
				data["user"] = rows;
				res.json(data);
			} else {
				data["user"] = 'No user Found..';
				res.json(data);
				console.log('Error while performing Query: ' + err);
				log.error('Error while performing Query: ' + err);
			}
		});
	
	});
});

//UPDATE Users
app.put('/api/update/user', function (req, res) {
    var id = req.body.id_cedulapro;
    var nombre = req.body.nombre;
    var apellido = req.body.apellido;    
    var data = {
        "error": 1,
        "user": ""
    };
	console.log('PUT Request :: /update: ' + id);
	log.info('PUT Request :: /update: ' + id);
    if (!!id && !!nombre && !!apellido) {
		pool.getConnection(function (err, connection) {
			connection.query("UPDATE propietario SET id_cedulapro = ?, nombre = ?, apellido = ? WHERE id_cedulapro=?",[id,  nombre, apellido,id], function (err, rows, fields) {
				if (!!err) {
					data["user"] = "Error actualizando los datos!!";
					console.log(err);
					log.error(err);
				} else {
					data["error"] = 0;
					data["user"] = "Registro actualiado correctamente";
					console.log("Actualizado: " + [id, nombre, apellido]);
					log.info("Actualizado: " + [id, nombre, apellido]);
				}
				res.json(data);
			});
		});
    } else {
        data["user"] = "Porfavor llene todos los caampos (i.e : id, nombre, apellido)";
        res.json(data);
    }
});


/**
 * Function Vehicle
 */


// List Vehicle
app.get('/api/list/vehicles', function (req, res) {
	console.log("GET Request :: /list");
	log.info('GET Request :: /list');
	var data = {
        "error": 1,
        "vehicles": ""
    };
	
	pool.getConnection(function (err, connection) {
		connection.query('SELECT placa,modelo,fecha_modelo, nombre,apellido from propietario, vehiculo where propietario.id_cedulapro = vehiculo.id_propietario;', function (err, rows, fields) {
		connection.release();

			if (rows.length !== 0 && !err) {
				data["error"] = 0;
				data["vehicles"] = rows;
				res.json(data);
			} else if (rows.length === 0) {
			//Error code 2 = no rows in db.
				data["error"] = 2;
				data["vehicles"] = 'No hay Vehiculos encontrados..';
				res.json(data);
			} else {
				data["vehicles"] = 'Error al realizar la consulta';
				res.json(data);
				console.log('Error al realizar la consulta: ' + err);
				log.error('Error al realizar la consulta: ' + err);
			}
		});
	
	});

});


 //Create Vehicle
 app.post('/api/insert/vehicle', function (req, res) {
    var placa = req.body.placa;
    var modelo = req.body.modelo;
	var fecha_modelo = req.body.fecha_modelo;
	var id_propietario = req.body.id_propietario;
    var data = {
        "error": 1,
        "vehicle": ""
    };
	console.log('POST Request :: /insert: ');
	log.info('POST Request :: /insert: ');
    if (!!placa && !!modelo && !!fecha_modelo && !!id_propietario) {
		pool.getConnection(function (err, connection) {
			connection.query("INSERT INTO vehiculo SET placa = ?, modelo = ?, fecha_modelo = ?, id_propietario = ?",[placa,  modelo, fecha_modelo, id_propietario], function (err, rows, fields) {				
				if (!!err) {
					data["vehiculo"] = "Error insertando registro";
					console.log(err);
					log.error(err);
				} else {
					data["error"] = 0;
					data["vehiculo"] = "Registro añadido correctamente";
					console.log("Added: " + [placa, modelo, fecha_modelo, id_propietario]);
					log.info("Added: " + [placa, modelo, fecha_modelo, id_propietario]);					
				}
				res.json(data);
			});
        });
    } else {
        data["propietario"] = "Todos los campos son obligatorios!!!";
        res.json(data);
    }
});

// Delete vehice
app.post('/api/delete/vehicle', function (req, res) {
    var id = req.body.placa;
    var data = {
        "error": 1,
        "vehicle": ""
    };
	console.log('DELETE Request :: /delete: ' + id);
	log.info('DELETE Request :: /delete: ' + id);
    if (!!id) {
		pool.getConnection(function (err, connection) {
			connection.query("DELETE FROM vehiculo WHERE placa=?",[id],function (err, rows, fields) {
				if (!!err) {
					data["vehicle"] = "Error deleting data";
					console.log(err);
					log.error(err);
				} else {
					data["vehicle"] = 0;
					data["vehicle"] = "Registro eliminado correctamente";
					console.log("Deleted: " + id);
					log.info("Deleted: " + id);
				}
				res.json(data);
			});
		});
    } else {
        data["vehicle"] = "Please provide all required data (i.e : id ) & must be a integer";
        res.json(data);
    }
});
/**
 * Function port
 */
var server = app.listen(8081, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("La aplicacion funciona por el: " + host + ":" + port);

});