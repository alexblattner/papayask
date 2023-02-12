const router = require('express').Router();

const fbAuthController = require('../controllers/fbAuthController');

router.post('/create-session', fbAuthController.createSession);

module.exports = router;
