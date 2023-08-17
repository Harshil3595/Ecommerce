const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt=require("jsonwebtoken")
const User=require('../models/userModels');


exports.isAuthenticatedUser = catchAsyncError(async(req,res,next) => {
    const {token}=req.cookies;

    if(!token){
       return next(new ErrorHandler("Please login to access this resources",401)) 
    }

    const decodedData=jwt.verify(token,process.env.JWT_SECRET);

    req.user=await User.findById(decodedData.id);
    next();
})

exports.authorizedRoles = (...roles) => {
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role : ${req.user.role} is not allowed to acccess this resource`,403));
        }

        next();
    }
}


