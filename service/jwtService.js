const jwt = require("jsonwebtoken");

const secret = process.env.SESSION_SECRET;

const createToken = (payload,duration) =>{
    const token = jwt.sign(payload, secret, {
        expiresIn: duration
    })
    return token; 
}


const validateToken = (token, key) =>{
    if(!token){
        return null;
    }
    let result;
    const authToken = token.split(" ")[1]; 
    jwt.verify(authToken, secret, (err, decode)=>{
        if(err){
            return null; 
        }
        result = decode[key]; 
    }); 

    return result; 
}

module.exports = {
    createToken,
    validateToken
}