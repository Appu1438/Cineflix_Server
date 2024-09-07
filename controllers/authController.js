const User = require('../models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

// Generate access token
const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }  // Access token expiration time
    );
};

// Generate refresh token
const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_REFRESH_SECRET,  // Use a different secret for refresh token
        { expiresIn: '7d' }  // Refresh token expiration time (e.g., 7 days)
    );
};


const register = async (req, res) => {
    console.log(req.body);

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10),
        isAdmin: req.body.isAdmin ? req.body.isAdmin : false
    });

    try {
        const user = await newUser.save();
        res.status(201).json(user);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

const login = async (req, res) => {

    try {

        const { email, password } = req.body
        const user = await User.findOne({ email: email })
        if (!user) {
            res.status(401).json("User Not Found")
        } else {
            if (await bcrypt.compare(password, user.password)) {
                const accessToken = generateAccessToken(user);
                const refreshToken = generateRefreshToken(user);

                user.refreshToken = refreshToken;
                await user.save();

                const { password, refreshToken: _, ...info } = user._doc;
                res.status(200).json({ ...info, accessToken })
            } else {
                res.status(401).json("Wrong Password")
            }
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

const refreshToken = async (req, res) => {
    const id = req.body.id;
    console.log(id);


    if (!id) {
        return res.status(401).json("User ID is required!");
    }

    const user = await User.findById(id);
    if (!user || !user.refreshToken) {
        return res.status(401).json("Refresh token not found!");
    }
    console.log(user.refreshToken)
    // Verify the refresh token
    try {
        jwt.verify(user.refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
            if (err) {
                console.log('err');
                res.status(403).json(err);
            } else {
                // Generate a new access token
                const newAccessToken = jwt.sign(
                    { id: user.id, isAdmin: user.isAdmin },
                    process.env.JWT_SECRET,
                    { expiresIn: '1d' }
                );
                res.status(200).json({ accessToken: newAccessToken });
            }
        });
    } catch (error) {
        console.log(err);
        res.status(403).json(err);
    }

};


module.exports = {
    register,
    login,
    refreshToken
}