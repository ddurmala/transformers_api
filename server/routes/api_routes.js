const router = require('express').Router();
const { verify } = require('jsonwebtoken');

const autobot_controller = require('../controllers/autobot_controller');
const { User } = require('../models');


async function blockGuestsAndAttachUserId(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: 'you are not authorized to perform that action'
        })
    }

    try {
        const data = await verify(token, process.env.JWT_SECRET);

        req.user_id = data.user_id;

        next();

    } catch {
        console.log('JWT Error', error);

        res.status(402).json({
            message: 'your token is invalid'
        });
    }
}

async function attachUser(req, res, next) {
    const user = await User.findById(req.user_id);

    req.user = user;

    next();
}

//GET route to retrieve all autobots
router.get('/autobots', autobot_controller.getAllAutobots);

//GET route to retrieve a single user & associated autobot list
router.get('/user', blockGuestsAndAttachUserId, autobot_controller.getSingleUser)

//POST route to add an autobot
router.post('/autobots', blockGuestsAndAttachUserId, attachUser, autobot_controller.createAutobot);

//UPDATE - PUT route to update an autobot
router.put('/autobot', blockGuestsAndAttachUserId, attachUser, autobot_controller.updateAutobot)

//DELETE route to delete an autobot(only if user made it)
router.delete('/autobot', blockGuestsAndAttachUserId, attachUser, autobot_controller.deleteAutobot)

module.exports = router;
