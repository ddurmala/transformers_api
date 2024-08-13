const { User } = require('../models');
const { sign, verify } = require('jsonwebtoken');

async function createToken(user_id) {
    const token = await sign({ user_id: user_id }, process.env.JWT_SECRET);

    return token;
}

module.exports = {
    async registerUser(req, res) {
        try {
            const user = await User.create(req.body);

            //create a token for the user
            const token = await createToken(user._id);

            res.cookie('token', token, {
                //keeps the cookie from being accessed by browser js
                httpOnly: true,
                //expiration in milliseconds
                // maxAge: 5 * 60 * 1000
            })

            res.json({
                user: user
            })
        } catch (error) {
            console.log('register error', error);

            if (error.code === 11000) {
                res.status(403).json({
                    message: 'that email address was already registered'
                })
            }
        }


    },

    async loginUser(req, res) {
        const user = await User.findOne({
            email: req.body.email
        });

        if (!user) {
            return res.status(403).json({
                message: 'a user with that email cannot be found'
            });
        }

        const valid_pass = await user.validatePassword(req.body.password);

        if (!valid_pass) {
            return res.status(401).json({
                message: 'password is incorrect'
            });
        }

        const token = await createToken(user._id);

        res.cookie('token', token, {
            //keeps the cookie from being accessed by browser js
            httpOnly: true,
            //expiration in milliseconds
            // maxAge: 5 * 60 * 1000
        })

        res.json({
            user: user
        })
    }


}