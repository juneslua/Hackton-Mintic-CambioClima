const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// CONFIG
app.set("port", process.env.PORT || 3000);

mongoose.connect("mongodb://localhost:27017/climatico")
	.then(res => { 
		console.log("La conexion fue exitosa");
	})
	.catch(err => {
		console.log("[MONGO] ERROR en la conexion | " + err);
	});

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors());
app.use(morgan('dev'));

// ROUTES
app.use("/api/temperatura", require('./routes/temperaturaRoutes'));
app.use("/api/emisiones", require('./routes/emisionesRoutes'));

// LISTEN
app.listen(app.get("port"),() => console.log("Escuchando en: http://localhost:" + app.get("port")));