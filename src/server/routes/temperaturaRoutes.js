const express = require('express');
const controller = require('../controllers/temperaturaController');

const router = express.Router();

// - - - > POST
router.post("/", controller.db_create);

// - - - > GET
router.get("/", controller.db_read);
router.get("/heatmap", controller.db_readAsHeatmap);
router.get("/rango", controller.db_readRange);
router.get("/:id", controller.db_readById);

// - - - > PATCH
router.patch("/:id", controller.db_update);

// - - - > DELETE
router.delete("/:id", controller.db_delete);

module.exports = router;