const router = require('express').Router();

const autobot_controller = require('../controllers/autobot_controller')

//GET route to retrieve all autobots
router.get('/autobots', autobot_controller.getAllAutobots);

//POST route to add an autobot
router.post('/autobots', autobot_controller.createAutobot);

module.exports = router;
