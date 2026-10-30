
const User = require("../models/user.model");

// GET: Get all users
async function getAllUsersController(req, res) {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ _id: -1 });

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            totalUsers: users.length,
            users,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch users",
        });
    }
}

// GET: Get a single user by ID
async function getUserByIdController(req, res) {
    try {
        const { userId } = req.params;

        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user",
        });
    }
}

// PATCH: Update a user's details or role
async function updateUserController(req, res) {
    try {
        const { userId } = req.params;
        const { username, email, role } = req.body;

        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }

        // Only allow these fields to be updated
        const updates = {};

        if (username !== undefined) {
            if (typeof username !== "string" || !username.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Username cannot be empty",
                });
            }

            updates.username = username.trim();
        }

        if (email !== undefined) {
            if (
                typeof email !== "string" ||
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide a valid email",
                });
            }

            updates.email = email.trim().toLowerCase();
        }

        if (role !== undefined) {
            if (!["user", "admin"].includes(role)) {
                return res.status(400).json({
                    success: false,
                    message: "Role must be user or admin",
                });
            }

            // Prevent an admin from accidentally removing
            // their own administrative access.
            if (
                String(req.user.id) === userId &&
                role !== "admin"
            ) {
                return res.status(400).json({
                    success: false,
                    message: "You cannot remove your own admin role",
                });
            }

            updates.role = role;
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Provide at least one field to update",
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            {
                new: true,
                runValidators: true,
            }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Username or email already exists",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update user",
        });
    }
}

// DELETE: Delete a user
async function deleteUserController(req, res) {
    try {
        const { userId } = req.params;

        if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }

        // Prevent an admin from deleting their own account
        if (String(req.user.id) === userId) {
            return res.status(400).json({
                success: false,
                message: "You cannot delete your own account",
            });
        }

        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
            deletedUser: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete user",
        });
    }
}

module.exports = {
    getAllUsersController,
    getUserByIdController,
    updateUserController,
    deleteUserController,
};
