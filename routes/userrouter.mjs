import { Router } from "express";

import { 
    userSignIn, 
    userSignUp, 
    userUpdate
 } from "../controllers/usercontroller.mjs";
import { verifyToken } from "../middleware/auth.mjs";

const userRouter = Router();

//user authentifcation 
userRouter.post('/sign-up', userSignUp)
userRouter.post('/sign-in', userSignIn)
userRouter.patch('/user-update', verifyToken, userUpdate)

export default userRouter;