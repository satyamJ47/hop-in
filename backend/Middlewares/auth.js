require("dotenv").config();

const jwt = require('jsonwebtoken');

function auth(req,res,next){
    const token = req.headers.token
    // console.log(token)
    if(!token)return res.status(401).json({ message: "No token provided. Please sign in." });
    jwt.verify(token, process.env.jwt_secret, function(err, decoded) {
        if(decoded){
            // console.log(decoded._id)
            // console.log(decoded.role)
            req.user = decoded
            // console.log(req.user._id)
            // console.log(req.user.role)
            next()
        }
        else{
            return res.status(403).json({message:"Invalid or expired token"})
        }
       
    });

}

module.exports = {
    auth
}