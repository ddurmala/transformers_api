const { model, Schema } = require('mongoose');
const { hash, compare } = require('bcrypt')

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        //make sure to drop the user collection if it already exists to make the unique functionality work
        unique: true,
        validate: {
            validator(value) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
            }
        }
    },

    password: {
        type: String,
        required: true,
        minLength: [6, 'password must be at least 6 characters']
    },

    autobots: [{
        type: Schema.Types.ObjectId,
        ref: 'Autobot'
    }]

}, {
    //edit the users obj before it gets sent out in a json response to the browser or client
    toJSON: {
        transform(user, jsonVal) {
            delete jsonVal.password;
            delete jsonVal.__v;

            return jsonVal;
        }
    }
});

userSchema.pre('save', async function () {
    //check if this is a newly created user and not a user update !very importatnt!
    if (this.isNew) {
        this.password = await hash(this.password, 10);
    }
});

userSchema.methods.validatePassword = async function (formPassword) {
    const is_valid = compare(formPassword, this.password);

    return is_valid;
}

//create the model based off the schema
const User = model('User', userSchema);

module.exports = User;