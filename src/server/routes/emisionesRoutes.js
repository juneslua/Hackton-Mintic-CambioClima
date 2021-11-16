const express = require('express');
const controller = require('../controllers/emisionesController');

const router = express.Router();

// - - - > POST
router.post("/", controller.db_create);

// - - - > GET
router.get("/", controller.db_read);
router.get("/pie", controller.db_readAsPie);
router.get("/:id", controller.db_readById);

// - - - > PATCH
router.patch("/:id", controller.db_update);

// - - - > DELETE
router.delete("/:id", controller.db_delete);

module.exports = router;