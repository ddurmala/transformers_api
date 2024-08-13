const { Autobot, User } = require('../models');

module.exports = {
    async getAllAutobots(req, res) {
        const autobots = await Autobot.find({});
        res.json(autobots);
    },

    async createAutobot(req, res) {
        const user = await User.findById(req.user_id);

        const newAutobot = await Autobot.create({
            name: req.body.name,
            color: req.body.color
        });

        user.autobots.push(newAutobot._id);
        await user.save();

        res.json({
            message: 'success!',
            autobot: newAutobot
        });
    }

}

