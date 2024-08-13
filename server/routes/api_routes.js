const router = require('express').Router();
const { verify } = require('jsonwebtoken');

const autobot_controller = require('../controllers/autobot_controller')


async function blockGuestsAndAttachToken(req, res, next) {
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

//GET route to retrieve all autobots
router.get('/autobots', autobot_controller.getAllAutobots);

//POST route to add an autobot
router.post('/autobots', blockGuestsAndAttachToken, autobot_controller.createAutobot);

module.exports = router;
