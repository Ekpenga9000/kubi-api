const db = require("knex")(require("../knexfile"));
const {validateToken} = require("../service/jwtService");

const validateEmail = (email) => {
    const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return regex.test(email);
}

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
    const {authorization} = req.headers; 
    if(!authorization){
        return res.status(400).json({"message": "Invalid request."}); 
    }
    const id = validateToken(authorization, "id"); 

    if(!id){
        return res.status(400).json({"message": "Invalid request."}); 
    }
    const {firstname, lastname, email, profile_pic} = req.body;

    if(!firstname || !lastname || !email || !profile_pic){
        return res.status(400).json({"messgae":"Invalid request"}); 
    }

    const userId = await db("user")
                    .select("id")
                    .where({id})
                    .first();
    
    if(!userId){
        return res.status(404).json({"message":"Invalid user."}); 
    }

    const isEmail = validateEmail(email); 

    if(!isEmail){
        return res.status(400).json({"message":"invalid email."})
    }
    
    const user = await db("user")
                .where({ id })
                .update({
                    firstname,
                    lastname,
                    email,
                    profile_pic
                })

    return res.status(200).json({"message":"Account updated!"});
}
module.exports = {
    getUserById,
    updateUserDetails
}