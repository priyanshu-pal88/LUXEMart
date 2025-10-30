const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')
require('dotenv').config()




async function authMiddleware(req, res, next) {
    
    try {
        const { token } = req.cookies
      
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized request"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decoded.id).select("-password")
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized request"
            })
        }
            req.user = user
            next()
            
    }
    catch (err) {
        return res.status(500).json({ message: "Cookies error" ,err});
    }
}

module.exports = authMiddleware;