 
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ==========================================
// REGISTER USER
// ==========================================
async function registerUserController(req, res) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: 'All fields are required'
            });
        }

        // Check if username already exists
        const existingUsername = await User.findOne({
            username: username.trim()
        });

        if (existingUsername) {
            return res.status(409).json({
                message: 'Username already exists'
            });
        }

        // Check if email already exists
        const normalizedEmail = email.trim().toLowerCase();

        const existingEmail = await User.findOne({
            email: normalizedEmail
        });

        if (existingEmail) {
            return res.status(409).json({
                message: 'Email already exists'
            });
        }

        // Hash password
        const hash = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username: username.trim(),
            email: normalizedEmail,
            password: hash
        });

        await newUser.save();

        // Create JWT token
        const token = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Store token in cookie
        res.cookie('token', token);

        return res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });

    } catch (error) {
        // Handle duplicate-key errors if MongoDB has unique indexes
        if (error.code === 11000) {
            const duplicateField = Object.keys(
                error.keyPattern || {}
            )[0];

            if (duplicateField === 'username') {
                return res.status(409).json({
                    message: 'Username already exists'
                });
            }

            if (duplicateField === 'email') {
                return res.status(409).json({
                    message: 'Email already exists'
                });
            }

            return res.status(409).json({
                message: 'Username or email already exists'
            });
        }

        console.error('Registration error:', error);

        return res.status(500).json({
            message: 'Server error'
        });
    }
}

// ==========================================
// LOGIN USER
// ==========================================
async function loginUserController(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({
            email: normalizedEmail
        });

        if (!user) {
            return res.status(400).json({
                message: 'Invalid email or password'
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(400).json({
                message: 'Invalid email or password'
            });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Store token in cookie
        res.cookie('token', token);

        return res.status(200).json({
            message: 'User logged in successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);

        return res.status(500).json({
            message: 'Server error'
        });
    }
}

// ==========================================
// LOGOUT USER
// ==========================================
async function logoutUserController(req, res) {
    res.clearCookie('token');

    return res.status(200).json({
        message: 'User logged out successfully'
    });
}

// ==========================================
// GET CURRENT USER
// ==========================================
async function getMeController(req, res) {
    try {
        const user = await User
            .findById(req.user.id)
            .select('-password');

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        return res.status(200).json({
            message: 'User found',
            user
        });

    } catch (error) {
        console.error('Get current user error:', error);

        return res.status(500).json({
            message: 'Server error'
        });
    }
}

// ==========================================
// GET ALL USERS
// ==========================================
async function getAllUsersController(req, res) {
    try {
        const users = await User
            .find()
            .select('-password');

        return res.status(200).json({
            message: 'Users found',
            users
        });

    } catch (error) {
        console.error('Get all users error:', error);

        return res.status(500).json({
            message: 'Server error'
        });
    }
}

// ==========================================
// EXPORT CONTROLLERS
// ==========================================
module.exports = {
    registerUserController,
    loginUserController,
    getMeController,
    logoutUserController,
    getAllUsersController
};
