const User = require('../models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../utils/validation');

// Generate access token
const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '1min' }  // Access token expiration time
    );
};

// Generate refresh token
const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET,  // Use a different secret for refresh token
        { expiresIn: '7d' }  // Refresh token expiration time (e.g., 7 days)
    );
};


const register = async (req, res) => {
    console.log(req.body);
    const { error } = registerValidation(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10),
            isAdmin: req.body.isAdmin ? req.body.isAdmin : false
        });

        const user = await newUser.save();
        res.status(201).json(user);

    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

const login = async (req, res) => {
    // Validate the input
    const { error } = loginValidation(req.body);
    if (error) {
        const errorMessages = error.details.map((err) => err.message);
        return res.status(400).json({ error: errorMessages });
    }

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ message: "User Not Found" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Wrong Password" });
        }

        // Generate access and refresh tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Remove the password from the response
        const { password: pwd, ...info } = user._doc;

        res.status(200).json({
            ...info,
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

const refreshToken = async (req, res) => {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
        return res.status(401).json("Token is required!");
    }

    try {
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, user) => {
            if (err) {
                return res.status(403).json("Invalid refresh token");
            }

            // Fetch the latest user details from the database
            const latestUserDetails = await User.findById(user.id);

            if (!latestUserDetails) {
                return res.status(404).json("User not found");
            }

            // Generate a new access token
            const newAccessToken = jwt.sign(
                { id: latestUserDetails._id, isAdmin: latestUserDetails.isAdmin },
                process.env.JWT_SECRET,
                { expiresIn: '1min' }  // Adjust expiration as needed
            );

            // Destructure to exclude the password from the response
            const { password, ...info } = latestUserDetails._doc;

            // Return the user info without the password, and include access and refresh tokens
            res.status(200).json({
                ...info,                // Return all user data except the password
                accessToken: newAccessToken,
                refreshToken            // Return the same refresh token
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json("Internal Server Error");
    }
};


module.exports = {
    register,
    login,
    refreshToken,
}