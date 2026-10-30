 const express = require('express');

const authRouter = express.Router();

const authController = require('../controllers/auth.Controller');
const authMiddleware = require('../middleware/auth.middleware');

authRouter.post('/register', authController.registerUserController);

authRouter.post('/login', authController.loginUserController);

authRouter.post('/logout', authController.logoutUserController);

authRouter.get(
    '/get-me',
    authMiddleware.authUser,
    authController.getMeController
);

module.exports = authRouter;