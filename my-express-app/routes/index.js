const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');
const { requiresAuth } = require('express-openid-connect');

router.get('/', (req, res) =>
    res.send( req.oidc.isAuthenticated() ? formController.serveForm: 'Logged out'));

router.post('/submit', formController.handleSubmit);

router.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
  });

module.exports = router;
