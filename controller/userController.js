const db = require("knex")(require("../knexfile"));
const {validateToken} = require("../service/jwtService");

const getUserById = async (req, res) =>{
    const {id} = req.params; 
    const {authorization} = req.headers; 

    if(!id || !authorization){
        return res.status(401).json({"message":"Please login to continue."})
    }

    const token = validateToken(authorization, "id");

    if(id !== token){
        return res.status(401).json({"message":"Invalid token"});
    }

    const user = await db("user")
                .where("id", id)
                .first();

    if(!user.id){
        return res.status(404).json({"message":"No user found."});
    }  

    delete user.password_hash;

    return res.status(200).json({user});
}

module.exports = {
    getUserById
}