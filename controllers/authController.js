const User = require('../models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


const register = async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10)
    })
    try {
        const user = await newUser.save()
        res.status(201).json(user)
    } catch (error) {
        res.status(500).json(error)

    }
}

const login = async (req, res) => {

    try {

        const { email, password } = req.body
        const user = await User.findOne({ email: email })
        if (!user) {
            res.status(401).json("User Not Found")
        } else {
            if (await bcrypt.compare(password, user.password)) {
                const accessToken = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: "5d" });
                const { password, ...info } = user._doc
                res.status(200).json({ ...info, accessToken })
            } else {
                res.status(401).json("Wrong Password")
            }
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = {
    register,
    login,
}