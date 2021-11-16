const {Schema, model} = require('mongoose');

const temperatura = Schema({
	_id: Schema.Types.ObjectId,
	codigo_estacion: Number,
	nombre_estacion: String,
	departamento: String,
	municipio: String,
	descripcion: String,
	fecha: Date,
	valor: Number
}, {collection:"temp_historica"});

module.exports = model("temp_historica",temperatura);