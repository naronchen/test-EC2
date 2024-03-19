const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');

router.get('/', formController.serveForm);
router.post('/submit', formController.handleSubmit);

module.exports = router;
