// import { Router } from "express";
// const router = Router();

// /** import all controllers */
// import * as controller from '../controllers/appController.js';
// import { registerMail } from '../controllers/mailer.js'
// import Auth, { localVariables } from '../middleware/auth.js';



// /** POST Methods */
// router.route('/register').post(controller.register); // register user
// router.route('/registerMail').post(registerMail); // send the email
// router.route('/authenticate').post(controller.verifyUser, (req, res) => res.end()); // authenticate user
// router.route('/login').post(controller.verifyUser,controller.login); // login in app

// /** GET Methods */
// router.route('/user/:username').get(controller.getUser) // user with username
// router.route('/generateOTP').get(controller.verifyUser, localVariables, controller.generateOTP) // generate random OTP
// router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP) // verify generated OTP
// router.route('/createResetSession').get(controller.createResetSession) // reset all the variables


// /** PUT Methods */
// router.route('/updateuser').put(Auth, controller.updateUser); // is use to update the user profile
// router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword); // use to reset password



// export default router;

import express from 'express';
import authRoutes from './authRoutes.js'
import userRoutes from './userRoutes.js'
import issueRoutes from './issueRoutes.js'
import adminRoutes from './adminRoutes.js'
import staffRoutes from './staffRoutes.js'

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/issues", issueRoutes);
router.use("/admin", adminRoutes);
router.use("/staff", staffRoutes);

export default router;