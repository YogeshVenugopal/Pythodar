import express from "express";
import { Login, Register, UpdateProfile, UserProfile } from "../Controllers/AuthController.js";
import { protect } from "../Middlewares/AuthMiddleware.js";

const AuthRouter = express.Router();

AuthRouter.post("/register", Register);
AuthRouter.post("/login", Login);
AuthRouter.get('/profile', protect, UserProfile);
AuthRouter.put('/update-profile',protect , UpdateProfile);

export default AuthRouter;