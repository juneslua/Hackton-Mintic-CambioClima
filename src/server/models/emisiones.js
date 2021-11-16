const {Schema, model} = require('mongoose');

const emisiones = Schema({
	_id: Schema.Types.ObjectId,
	anio: Number,
    cat_ipcc2006: String,
    categoria: String,
    co2_absorciones_Gg: String,        
    co2_emisiones_Gg: String,
    ch4_emisiones_Gg: String,
    n2o_emisiones_Gg: String,
    emisiones_totales_Gg_CO2eq: String,
    emisiones_con_absorciones_Gg_CO2eq: String,
}, {collection:"emisiones"});

module.exports = model("emisiones",emisiones);