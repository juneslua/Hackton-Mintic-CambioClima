const Emisiones = require('../models/emisiones');
const {Types} = require('mongoose');


// - - - > HELPERS

function pieData(dataArr,categoria)
{
	let output = [];
	const regex = /(?=.+)[vi]+/;

	for (const item of dataArr)
	{
		const code = item.cat_ipcc2006;
		
		const numeral = regex.exec(code);
		const nCode = code.split(regex)[0].split("");
		const keys = numeral ? Array.prototype.concat(nCode, numeral) : nCode;
		
		if (keys[0] == categoria)
			output = recursiveInsert(item,keys,output);
	}

	const json = JSON.stringify(output[0],(key,value) =>{
		 if(key == "category") return undefined;
		 return value;
	});

	return json;
}

function recursiveInsert(item, keys = [], target = [], depth = 5)
{
	const key = keys.shift();

	let newKey = true;
	for (var i = 0; i < target.length; i++) if(target[i].category == key) {newKey = false; break;}

	if (newKey) var obj = {category:key,name:""};

	if (keys.length > 0 && depth > 0) 
	{
		if (newKey) obj.children = recursiveInsert(item, keys, [], --depth);
		else 
		{
			delete target[i].value;
			target[i].children = recursiveInsert(item, keys, target[i].children, --depth);
		}
	}
	else
	{ 
		const data = item.emisiones_con_absorciones_Gg_CO2eq;
		const value = parseFloat(data.match(/[A-Z]+/) ? 0 : data);

		if (newKey)
		{
			obj.name = item.categoria;
			obj.value = value;
		}
		else
		{ 
			target[i].name = item.categoria;
			target[i].value = value;
		}
	}

	if (newKey) target.push(obj);

	return target;
}


// - - - > CRUD

const crud = {

	db_create(req,res) {
		const emisones = new Emisiones(
			{
				_id: 								new Types.ObjectId(),
				anio: 								req.body.anio,
				cat_ipcc2006: 						req.body.cat_ipc2006,
				categoria: 							req.body.categoria,
				co2_absorciones_Gg: 				req.body.co2_absorciones_Gg,        
				co2_emisiones_Gg: 					req.body.co2_emisiones_Gg,
				ch4_emisiones_Gg: 					req.body.ch4_emisiones_Gg,
				n2o_emisiones_Gg: 					req.body.n2o_emisiones_Gg,
				emisiones_totales_Gg_CO2eq: 		req.body.emisiones_totales_Gg_CO2eq,
				emisiones_con_absorciones_Gg_CO2eq:	req.body.emisiones_con_absorciones_Gg_CO2eq,
			}
		);

		emisones.save()
			.then(result => {
				res.status(200).json(result);
			})
			.catch(err => {
				res.status(400).json({error:"400 - Mala Peticion"});
				console.log("[SERVER] " + err);
			});
	},

	db_read(req,res) {
		Emisiones.find()
			.then(result => {
				res.status(200).json(result);
			})
			.catch(err => {
				res.status(500).json({error:"500 - Error Interno"});
				console.log("[SERVER] " + err.stack);
			});
	},

	db_readAsPie(req, res) {
		Emisiones.find()
			.then(result => {
				res.status(200).json(JSON.parse(pieData(result,req.params.categoria)));
			})
			.catch(err => {
				res.status(500).json({error:"500 - Error Interno"});
				console.log("[SERVER] " + err.stack);
			});
	},

	db_readById(req,res) {
		Emisiones.findById(req.params.id)
			.then(result => {
				if (result) res.status(200).json(result);
				else res.status(404).json({error:"404 - No Encontrado"})
			})
			.catch(err => {
				res.status(400).json({error:"400 - Mala Peticion"});
				console.log("[SERVER] " + err);
			});
	},

	db_update(req,res) {
		const actualizacion = {};
		for (const props of req.body)
			actualizacion[props.propiedad] = props.valor;
		
		Emisiones.updateOne({_id:req.params.id}, {$set:actualizacion})
			.then(result => {
				res.status(200).json(result);
			})
			.catch(err => {
				res.status(400).json({error:"400 - Mala Peticion"});
				console.log("[SERVER] " + err);
			});
	},

	db_delete(req,res) {
		Emisiones.remove({_id:req.params.id})
			.then(result => {
				res.status(200).json(result);
			})
			.catch(err => {
				res.status(500).json({error:"500 - Error Interno"});
				console.log("[SERVER] " + err);
			});
	}
};

module.exports = crud;