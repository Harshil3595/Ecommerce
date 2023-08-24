//create a token and save into cookie
const sendToken = (user,statusCode,res) => {
    const token=user.getJWTToken();

    return res.status(200).send({ success: true, message: "Login succesfully", token, user });
}

module.exports=sendToken;