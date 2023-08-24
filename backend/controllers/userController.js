const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncError');
const User=require('../models/userModels');
const sendToken=require('../utils/jwttoken');
const sendEmail=require('../utils/sendEmail');
const cloudinary = require("cloudinary");
 

//register user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  
    const { name, email, password } = req.body;
  
    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: "Hello",
        url: "How are you",
      },
    });
  
    sendToken(user, 201, res);
  });
  

//login user
exports.loginUser=catchAsyncErrors(async (req,res,next) => {
    const{email,password}=req.body;

    //checking if user has given password and email both
    if(!email || !password){
        return next(new ErrorHandler("Please Enter Email and Password",400));
    }

    const user=await User.findOne({email}).select("+password");

    if(!user){
        res.status(401).json({success:false,message:"User doest not exit"})
    }

    const isPasswordMatched=await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid  Password",401));
    }

    sendToken(user,200,res);
})

//Logout user
exports.logout=catchAsyncErrors(async(req,res,next)=>{

    res.cookie("token",null,{
            expires:new Date(Date.now()),
            httpOnly:true,
        })
    res.status(200).json({success:true,message:"Logout successfully"});
})

//forgot password
exports.forgotPassword=catchAsyncErrors(async(req,res,next)=>{
    const user=await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler("User not found",404));
    }

    //Get reset password token
    const resetToken=user.getResetPasswordToken();

    await user.save({validateBeforeSave:false});

    const resetPasswordUrl=`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message=`Your password reset token is  :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then please ignore it`;
    
    try{
        await sendEmail({
            email:user.email,
            subject:`Ecommerce password recovery`,
            message,
        })

        res.status(200).json({success:true,message:`Email send to ${user.email} succesfully`});
    }
    catch(error){
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;
        await user.save({validateBeforeSave:false});

        return next(new ErrorHandler(error.message,500));

    }
})


exports.getUserDetails = async (req, res) => {
    try {
      const userId = req.user;
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).send({ success: false, message: 'User not found' });
      }
  
      return res.status(200).send({ success: true, user });
    } catch (err) {
      return res.status(500).send({ success: false, message: err.message });
    }
  };

//update user Details
exports.updatePassword = catchAsyncErrors(async (req,res,next)=>{
    const user=await User.findById(req.user.id).select("+password");

    const isPasswordMatched=user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old password us not a valid",400));
    }

    if(req.body.newPassword!==req.body.confirmPassword){
        return next(new ErrorHandler("Correct password validation failed",400));

    }

    user.password=req.body.newPassword;
    await user.save();
    sendToken(user,200,res);
})

//update profile
exports.updateProfile = catchAsyncErrors(async (req,res,next)=>{
    const newUserData={
        name:req.body.name,
        email:req.body.email,
    }

    const user=await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    })

    res.status(200).json({success:true,user})
})

//get all users - adim
exports.getAllUsers = catchAsyncErrors(async (req,res,next)=>{
    const users=await User.find();
    res.status(200).json({success:true,users});
})

//get details of single  -admin
exports.getSingleUser = catchAsyncErrors(async (req,res,next)=>{
    const user=await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler("User does not exit with id",404));
    }

    res.status(200).json({success:true,user});
})

//update Role - admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, user: user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


//delete user - admin
exports.deleteProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
  
    if (!user) {
      return next(new ErrorHandler("User does not exist with this id", 404));
    }
  
    await user.deleteOne(); // Use deleteOne() instead of remove()
  
    res.status(200).json({ success: true , message:"User deleted succesfully"});
  });

 
