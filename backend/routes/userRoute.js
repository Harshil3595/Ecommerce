const express=require('express');
const router=express.Router();
const { registerUser, loginUser, logout, forgotPassword, getUserDetails, updatePassword, updateProfile, getAllUsers, getSingleUser, updateUserRole, deleteProfile } = require('../controllers/userController');
const {isAuthenticatedUser,authorizedRoles} = require('../middleware/auth');


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword)
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticatedUser ,getUserDetails);
router.route("/password/update").put(isAuthenticatedUser,updatePassword)
router.route("/me/update").put(isAuthenticatedUser,updateProfile)
router.route("/admin/users").get(isAuthenticatedUser,authorizedRoles("admin"),getAllUsers);
router.route("/admin/user/:id").get(isAuthenticatedUser,authorizedRoles("admin"),getSingleUser).put(isAuthenticatedUser,authorizedRoles("admin"),updateUserRole).delete(isAuthenticatedUser,authorizedRoles("admin"),deleteProfile);

module.exports=router;