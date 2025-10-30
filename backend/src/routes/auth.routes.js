const express = require('express');
const { registerUser, loginUser, verifyUser, logoutUser, editUser } = require('../controllers/auth.controllers');
const authMiddleware = require('../middlewares/authMiddleware');

const authRouter = express.Router();

authRouter.post('/register',registerUser )
authRouter.post('/login',loginUser )
authRouter.post('/logout',authMiddleware,logoutUser )
authRouter.get('/verify',authMiddleware,verifyUser)
authRouter.patch('/edit-user',authMiddleware,editUser)

module.exports = authRouter;