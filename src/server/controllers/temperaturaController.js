const Temperatura = require('../models/temperatura');
const {Types} = require('mongoose');


// - - - > HELPERS

function searchDateRange(min, max)
{
	try
	{
		const minDate = new Date(min);
		const maxDate = new Date(max);

		if (!minDate || !maxDate) throw new Error("Las fechas ingresadas no son validas.");

		return Temperatura.find({fecha: {$gte: minDate, $lt: maxDate}}).sort({fecha:"asc"});			
	}
	catch (err)
	{
		console.log("[SERVER] " + err.stack);
		return undefined;
	}
}

async function heatmapData()
{
	const days = {
		 1: 31,  2: 28,  3: 31,
		 4: 30,  5: 31,  6: 30,
		 7: 31,  8: 31,  9: 30,
		10: 31, 11: 30, 12: 31
	};

	let promedios = [];

	for (let i = 0; i < 6; i++)
	{
		let anio = {values:[]};
		for (let mes = 1; mes <= 12; mes++)
		{
			const year = 2015 + i;
			const min = `${year}-${mes}-1`;
			const max = `${year}-${mes}-${days[mes]}`;

			const result = await searchDateRange(min,max);
			let sumatoria = 0, promedio = 0;
			for (const temp of result) sumatoria += temp.valor;
			promedio = sumatoria/result.length;

			anio.values.push((isNaN(promedio) ? 0 : Math.round(promedio)));		
		}

		promedios.push(anio);
	}

	return promedios;
}


// - - - > CRUD

const crud = {

	db_create(req,res) {
		const temperatura = new Temperatura(
			{
				_id: 				new Types.ObjectId(),
				codigo_estacion:	req.body.codigo_estacion,
				nombre_estacion: 	req.body.nombre_estacion,
				departamento: 		req.body.departamento,
				municipio: 			req.body.municipio,
				descripcion: 		req.body.descripcion,
				fecha: 				req.body.fecha,
				valor: 				req.body.valor
			}
		);

		temperatura.save()
			.then(result => {
				res.status(200).json(result);
			})
			.catch(err => {
				res.status(400).json({error:"400 - Mala Peticion"});
				console.log("[SERVER] " + err.stack);
		});
	},

	db_read(req,res) {
		Temperatura.find()
			.then(result => {
				res.status(200).json(result);
			})
			.catch(err => {
				res.status(500).json({error:"500 - Error Interno"});
				console.log("[SERVER] " + err.stack);
			});
	},

	db_readAsHeatmap(req,res) {
		heatmapData()
			.then(result => {
				res.status(200).json(result)
			})
			.catch(err => {
				res.status(500).json({error:"500 - Error Interno"});
				console.log("[SERVER] " + err.stack);
			});
	},

	db_readRange(req,res) {
		const min = req.query.min;
		const max = req.query.max;

		searchDateRange(min,max)
			.then(result => console.log(result))
			.catch(err => {
				res.status(400).json({error:"500 - Error Interno"});
				console.log("[SERVER] " + err.stack);
			});
	},

	db_readById(req,res) {
		Temperatura.findById(req.params.id)
			.then(result => {
				if (result) res.status(200).json(result);
				else res.status(404).json({error:"404 - No Encontrado"})
			})
			.catch(err => {
				res.status(400).json({error:"400 - Mala Peticion"});
				console.log("[SERVER] " + err.stack);
			});
	},

	db_update(req,res) {
		const actualizacion = {};
		for (const props of req.body)
			actualizacion[props.propiedad] = props.valor;
		
		Temperatura.updateOne({_id:req.params.id}, {$set:actualizacion})
			.then(result => {
				res.status(200).json(result);
			})
			.catch(err => {
				res.status(400).json({error:"400 - Mala Peticion"});
				console.log("[SERVER] " + err.stack);
			});
	},

	db_delete(req,res) {
		Temperatura.remove({_id:req.params.id})
			.then(result => {
				res.status(200).json(result);
			})
			.catch(err => {
				res.status(500).json({error:"500 - Error Interno"});
				console.log("[SERVER] " + err.stack);
			});
	}
}

module.exports = crud;