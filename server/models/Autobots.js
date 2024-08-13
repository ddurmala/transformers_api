const { model, Schema } = require('mongoose');

const autobotSchema = new Schema({
    name: String,
    color: String
});

//create the model based off the schema
const Autobot = model('Autobot', autobotSchema);

module.exports = Autobot;