const User = require('../models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const update_user = async (req, res) => {
    if (req.user.id == req.params.id || req.user.isAdmin) {

        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10)
        }

        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id,
                {
                    $set: req.body
                },
                {
                    new: true
                }
            )
            res.status(200).json(updatedUser)

        } catch (error) {
            res.status(500).json(error)
        }

    } else {
        res.status(403).json("You can update your account only")

    }
}

const delete_user = async (req, res) => {
    if (req.user.id == req.params.id || req.user.isAdmin) {

        try {
            await User.findByIdAndDelete(req.params.id)
            res.status(200).json("User has been Deleted")

        } catch (error) {
            res.status(500).json(error)
        }

    } else {
        res.status(403).json("You can delete your account only")

    }
}
const get_user = async (req, res) => {

    try {
        const user = await User.findById(req.params.id)
        const { password, ...info } = user._doc
        res.status(200).json(info)

    } catch (error) {
        res.status(500).json(error)
    }
}

const all_user = async (req, res) => {
    const query = req.query.new
    if (req.user.isAdmin) {
        try {
            const users = query ? await User.find().sort({ _id: -1 }).limit(10)
                : await User.find()
            res.status(200).json(users)
        } catch (error) {
            res.status(500).json(error)
        }

    } else {
        res.status(403).json("You are not allowded")

    }
}

const user_stats = async (req, res) => {
    const today = new Date();
    const lastYear = today.setFullYear(today.setFullYear() - 1)

    const monthsArray = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    try {
        const data = await User.aggregate([
            {
            $project: {
                month: { $month: "$createdAt" }
            }
            },
          {
            $group: {
                _id:"$month",
                total: { $sum: 1 }
            }

         }]);
         res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = {
    update_user,
    delete_user,
    get_user,
    all_user,
    user_stats
}