router = require('express').Router();
const auth_controller = require('../controllers/auth_controller')

// register user
router.post('/register', auth_controller.registerUser);

//login user
router.post('/login', auth_controller.loginUser);

module.exports = router;