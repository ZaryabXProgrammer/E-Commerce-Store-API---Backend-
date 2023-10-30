const router = require('express').Router()
const User = require('../models/Users');
const jwt = require('jsonwebtoken')


const CryptoJS = require("crypto-js");

//registration

router.post('/register', async (req, res) => {

    const { username, email, password } = req.body;

    const hashedPassword = CryptoJS.AES.encrypt(password, process.env.PASS_SEC);

    const newUser = new User({
        username: username,
        email: email,
        password: hashedPassword
    })

    try {
        const savedUser = await newUser.save()
        return res.status(200).json(savedUser)
    } catch (error) {
        return res.status(500).json(error)
    }

})


//login

router.post('/login', async (req, res) => {
    const { username, password } = req.body

    const user = await User.findOne({ username });
    try {
        if (!user) {
            return res.status(400).json("User Not Found")


        } else {
            const decryptedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC).toString(CryptoJS.enc.Utf8);

            if (password === decryptedPassword) {
                // The user object should include the isAdmin property
                const accessToken = jwt.sign(
                    { id: user._id, isAdmin: user.isAdmin },
                    process.env.JWT_SEC,
                    { expiresIn: '7d' }
                );

                const { password, ...others } = user._doc;
                return res.json({ ...others, accessToken });
            } else {
                return res.json('Wrong Username of password combination')
            }

        }
    } catch (error) {
        return res.status(500).json(error)
    }


})







// var encrypted = CryptoJS.AES.encrypt("Message", "Secret Passphrase");

// var decrypted = CryptoJS.AES.decrypt(encrypted, "Secret Passphrase");

module.exports = router