const db = require("knex")(require("../knexfile"));
const { registrationMessage, passwordResetMessage } = require("../service/emailMessageService");
const { sendMail } = require("../service/emailSenderService");
const { createToken, validateToken } = require("../service/jwtService");
const bcrypt = require("bcryptjs");

const fetchNewUserEmail = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ "message": "No email address provided" });
    }

    try {
        //check if there's a user registered to the email. 
        const user = await db("user").where("email", email).first();
        const userEmail = user ? user.email : null;

        if (userEmail) {
            return res.status(200).json({ "message": "User with email exists." });
        }

        const payload = { email };
        const token = createToken(payload);

        const url = `${process.env.CLIENT_URL}/register`;
        const emailMessage = registrationMessage(url, token);
        const subject = "Welcome to kubI - Complete Your Registration 🚀"


        sendMail(email, subject, emailMessage).catch(e => console.log(e));

        return res.status(200).json({ "message": "An email has been sent to " + email + "." });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ "message": "Unable to process your request at this time." });
    }
}

const registerUser = async (request, response) => {
    // Check the body has the username and password and the token.
    const { firstname, lastname, password, confirmPassword, profile_pic } = request.body;

    if (!firstname || !lastname || !password || !confirmPassword) {
        return response.status(400).json({ "message": "Please ensure that form is filled correctly." });
    }

    if (password !== confirmPassword) {
        return response.status(400).json({ "message": "Passwords doesn't match" });
    }

    const { authorization } = request.headers;

    if (!authorization) {
        return response.status(401).json({ "message": "Invalid registration" });
    }

    try {

        // To avoid duplication registration
        const email = validateToken(authorization, "email");
        const user = await db("user")
            .where("email", email)
            .first();

        if (user) {
            return response.status(400).json({ "message": "User already exists please try logging in instead" });
        }

        //encrypt the password
        const password_hash = bcrypt.hashSync(password);

        const userPic = profile_pic ? profile_pic : "images/sample.png";

        const newUser = {
            firstname,
            lastname,
            email,
            password_hash,
            profile_pic: userPic
        }

        //insert the new user into the db. 
        const [id] = await db("user").insert(newUser); //returns an array with the id; 

        const payload = { id }
        const token = createToken(payload);

        return response.status(201).json({ id, token });
    } catch (err) {
        console.log(err);
        return response.status(500).json({ "message": "Unable to create new user, please retry" });
    }

}

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ "message": "Please provide your login credentials to proceed" });
    }
    try{
        const user = await db("user")
                            .where("email",email)
                            .first();

        if(!user){
            return res.status(400).json({"message":"Invalid credentials"}); 
        }

        const{password_hash} = user; 

        const confirmedPassword = bcrypt.compareSync(password, password_hash); 

        if(!confirmedPassword){
            return res.status(400).json({"message":"Invalid credentials"}); 
        }

        const {id} = user; 
        delete user.password_hash; 

        const payload = {id}; 
        const token = createToken(payload,"1d");
        return res.status(200).json({id,token});

    }catch(error){
        console.log(error);
        return res.status(500).json({"message":"We are unable to carry out your request. Please try again."});
    }

}

const changePassword = async(req, res) =>{
    //check that all fields are represented; 
    const {email, password, newPassword, confirmPassword} = req.body; 

    if(!email || !password || !newPassword || !confirmPassword){
        return res.status(400).json({"message":"Invalid request"});
    }

    if(newPassword !== confirmPassword){
        return res.status(400).json({"nessage":"Please ensure new password matches the confirmed password"}); 
    }

    const {authorization} = req.headers; 

    if(!authorization){
        return res.status(401).json({"message":"Invalid request."});
    }

    try{

        const id = validateToken(authorization, "id"); 

        if(!id){
            return res.status(400).json({"message":"Invalid request"})
        }
        const user = await db("user")
                        .where("id",id)
                        .andWhere("email",email)
                        .first();

        if(!user){
            return res.status(401).json({"message":"Invalid credentials"});
        }

        const{password_hash} = user; 

        const validPassword = bcrypt.compareSync(password, password_hash);

        if(!validPassword){
            return res.status(401).json({"message":"Invalid credentials"}); 
        }

        const newPassword_hash = bcrypt.hashSync(newPassword);

        await db("user").where("id", id).andWhere("email", email).update("password_hash", newPassword_hash); 

        return res.status(200).json({"message":"Password updated!!"})
    }catch(error){
        console.log(error); 
        return res.status(500).json({"message":"Unable to carry out your request, please try again."});
    }
}
//Things to do 
    //reset password
const sendResetPasswordLink = async(req, res)=>{
    const {email} = req.body; 

    if(!email){
        return res.status(400).json({"message":"Invalid request."}); 
    }

   try{
    const user = await db("user").where("email", email).first();

    if(!user){
        return res.status(401).json({"message":"No user found"}); 
    }

    const {firstname,id} = user; 

    const payload = {id};
    const token = createToken(payload,"1h");
    
    const url = `${process.env.CLIENT_URL}/password-reset`;
    const emailMessage = passwordResetMessage(firstname, url, token);
    const subject = "Password Reset Request for Your KubI Account"

    sendMail(email, subject, emailMessage).catch(e => console.log(e));

    return res.status(200).json({"message":"An email has been sent to " + email});

   }catch(error){
    console.log(error);
    return res.status(500).json({"message":"Unable to process your request."})
   }
}

const resetPassword = async(req,res) =>{
    //Confirm that the token and the email, password and confirm password
    const {email, password, confirmPassword} = req.body;
    const {authorization} = req.headers; 

    if(!email || !password || !confirmPassword || !authorization){
        return res.status(400).json({"message":"Invalid request"}); 
    }

    if(password !== confirmPassword){
        return res.status(400).json({"message":"Password and confirm password values mis-match"});
    }

    try{
        const id = validateToken(authorization,"id");

        const user = await db("user").where("id", id).andWhere("email", email).first(); 

        if(!user){
            return res.status(401).json({"message":"User not found"})
        }

        const password_hash = bcrypt.hashSync(password); 

        await db("user").where("id",id).andWhere("email",email).update("password_hash",password_hash); 

        return res.status(200).json({"message":"Password has been updated"});

    }catch(err){
        console.log(err);
        return res.status(500).json({"message":"Unable to carryout your request, try again later."});
    }

}


module.exports = {
    fetchNewUserEmail,
    registerUser,
    login,
    changePassword,
    sendResetPasswordLink,
    resetPassword
}