const { Autobot, User } = require('../models');

module.exports = {
    async getAllAutobots(req, res) {
        const autobots = await Autobot.find().populate({
            path: 'createdBy',
            select: 'email -_id'
            //space separate the diff field you want & use the - to take away values your dont want - must sure its all in a string
        });
        res.json(autobots);
    },

    async getSingleUser(req, res) {
        const user = await User.findById(req.user_id).populate('autobots');

        res.json(user);
    },

    async createAutobot(req, res) {

        const newAutobot = await Autobot.create({
            name: req.body.name,
            color: req.body.color,
            createdBy: req.user._id
        });

        req.user.autobots.push(newAutobot._id);
        await req.user.save();

        res.json({
            message: 'success!',
            autobot: newAutobot
        });
    },

    //update
    async updateAutobot(req, res) {
        const autobot_id = req.body.autobot_id;

        if (!req.user.autobots.includes(autobot_id)) {
            return res.status(403).json({
                message: 'You cannot update an autobot you did not create'
            })
        }

        const updatedAutobot = await Autobot.findOneAndUpdate({
            _id: autobot_id
        }, req.body, {
            new: true
        });

        res.json({
            message: 'autobot updated',
            autobot: updatedAutobot
        })
    },

    //delete an autobot only if the user was the one to create it
    async deleteAutobot(req, res) {
        const autobot_id = req.body.autobot_id;

        if (!req.user.autobots.includes(autobot_id)) {
            return res.status(403).json({
                message: 'You do not have permission to delete this autobot'
            })
        }

        await Autobot.deleteOne({
            _id: autobot_id
        });

        req.user.autobots.pull(autobot_id);
        await req.user.save

        res.json({
            message: 'Autobot deleted'
        })
    }

}

