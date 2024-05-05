const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');
const { requiresAuth } = require('express-openid-connect');

router.get('/', (req, res) =>
    res.send( req.oidc.isAuthenticated() ? formController.serveForm: 'Logged out'));

// post already means submit
router.post('/form', formController.handleSubmit);

// testing user from auth
router.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
  });

module.exports = router;
