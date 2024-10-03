const User = require('../models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../utils/validation');

// Generate access token
const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '10min' }  // Access token expiration time
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
        console.log("Validation errors:", errorMessages); // Log validation errors
        return res.status(400).json({ error: errorMessages });
    }

    try {
        const { email, password } = req.body;
        console.log("Login attempt for email:", email); // Log login attempt

        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found:", email); // Log if user is not found
            return res.status(401).json({ message: "User Not Found" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            console.log("Invalid password for user:", email); // Log if password is incorrect
            return res.status(401).json({ message: "Wrong Password" });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Remove the password from the user object
        const { password: pwd, ...info } = user._doc;

        // Log successful login
        console.log("Login successful for user:", email);

        res.status(200).json({
            ...info,
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error("Login error:", error); // Log any unexpected errors
        res.status(500).json({ message: "Internal server error", error });
    }
};


const refreshToken = async (req, res) => {
    const refreshToken = req.body.refreshToken;
    // console.log(refreshToken)

    if (!refreshToken) {
        return res.status(401).json("Token is required!");
    }
    try {
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, user) => {
            // console.log(user)
            if (err) {
                return res.status(403).json("Invalid refresh token");
            }

            // Fetch the latest user details from the database
            const latestUserDetails = await User.findById(user.id);

            if (!latestUserDetails) {
                return res.status(404).json("User not found");
            }

            // Generate a new access token
            const newAccessToken = generateAccessToken(latestUserDetails)

            res.status(200).json({
                accessToken: newAccessToken,
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json("Internal Server Error");
    }
};

const get_User = async (req, res) => {
    try {
        const user = await User.findById(req.user.id, '-password '); // Exclude password and refreshToken
        if (!user) {
            return res.status(404).json("User not found");
        }
        // Respond with the full user data
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json("Internal Server Error");
    }
}

module.exports = {
    register,
    login,
    refreshToken,
    get_User
}