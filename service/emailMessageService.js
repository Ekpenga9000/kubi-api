const registrationMessage = (url, token) => {
    return (
        `<div>
            <p>Dear User,</p>
            <br/>
            <p>
            🌟 Exciting News! Your Registration Awaits. 🌟
            </p>
            <br/>
            <p>
            Thank you for choosing kubI! We're delighted to have you on board and ready to embark on this journey together.
            </p>
            <br/>
            <p>
            To complete your registration, simply click on the link below:
            </p>
            <br/>
            <a href=${url}/${token}>
                Please click here to continue your registration. 
            </a>
            <br/>
            <p>🔒 Your Account Security Matters:</p>
            <p>  
            For your security, please ensure that you're using a secure and private connection when completing your registration. If you did not initiate this registration or have any concerns, please contact our support team immediately at [support@email.com].
            </p>
            <br/>
            <p>🚀 What Awaits You:</p>
            <p>
            

            Once you've completed your registration, you'll gain access to a world of possibilities with kubI. From personalized features to a seamless user experience, we're committed to making your experience exceptional.


            </p>
            <br/>
            <p>📌 Important Details:</p>
            <span>
            
            Registration Link:
           


            </span>
            <a href="${url}/${token}">
                Please click here to continue your registration. 
            </a>
            <p>
            Expires in 1 day.
            </p>
            <br/>
            <p>Thank you for choosing kubI. We can't wait to see you on the platform!
            </p>
            <br/>
            <p>Best regards,</p>
            <br/>
            <p>kubI Team</p>
        </div>`
    )
}

const passwordResetMessage = (firstname, url, token) => {


    return (`
    <div>
    <p>Dear [User's Name]</p>
    <br />
    <p>We received a request to reset the password associated with your KubI account. To proceed with the password
        reset, please follow the instructions below:
    </p>
    <br />
    <p>Click on the following link to reset your password: [Reset Link]</p>
    <br>
    <p>If the link does not work, copy and paste the following URL into your browser:
        [Paste Reset URL]</p>
    <br>
    <p> You will be directed to a page where you can create a new password for your account.
    </p>
    <br>
    <p>Please note the following:
    </p>
    <br>
    <p>
        This password reset link is valid for [specific duration, e.g., 24 hours].
        If you did not request a password reset, please ignore this email. Your account security is essential to us.
        If you continue to experience issues or did not initiate this request, please contact our support team at
        [Support Email or Phone Number].
    </p>
    <br>
    <p>
        Thank you for using KubI!
    </p>
    <br>
    <p>Best Regards,
    </p>
    <br>
    <p>kubI Team</p>
</div>
    `);
}
module.exports = {
    registrationMessage,
    passwordResetMessage
}