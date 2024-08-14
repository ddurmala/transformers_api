const { model, Schema } = require('mongoose');

const autobotSchema = new Schema({
    name: String,
    color: String,
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

//create the model based off the schema
const Autobot = model('Autobot', autobotSchema);

module.exports = Autobot;