const db = require("knex")(require("../knexfile"));
const {validateToken} = require("../service/jwtService");

const getUserById = async (req, res) =>{
    const {id} = req.params; 
    const {authorization} = req.headers; 

    if(!id || !authorization){
        return res.status(401).json({"message":"Please login to continue."})
    }

    const token = validateToken(authorization, "id");
    
    if(!token){
      return res.status(401).json({"message":"Invalid token"});
    }

    if(id !== token.toString()){
        return res.status(401).json({"message":"Invalid token"});
    }

    try{
        const user = await db("user")
                    .where("id", id)
                    .first();
    
        if(!user.id){
            return res.status(404).json({"message":"No user found."});
        }  
    
        delete user.password_hash;
    
        return res.status(200).json({user});
        
    }catch(error){
        console.log(error); 
        return res.status(500).json({"message":"Unable to carryout your request, please try again."})
    }

}

const updateUserDetails = async(req,res)=>{
    //Check that the body has the data 
    //Check that there is a token coming

    // compa
}
module.exports = {
    getUserById,
    updateUserDetails
}