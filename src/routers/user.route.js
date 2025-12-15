import { Router } from "express";
import {
  registerUser,
  logoutUser,
  loginUser,
  refreshAccessToken,
  updateCurrentPassword,
  getCurrentUser,
  getUserChannelProfile,
  updateAccountDetail,
  updateAvatarImgae,
  updateCoverImgae,
  getWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

//unsecured routes
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);                                                                                                    //register route

router.route("/login").post(loginUser);                                                               //login route
router.route("/refresh-token").post(refreshAccessToken);                                              //refresh accesstoken route

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);                                                  //logout route
router.route("/change-password").post(verifyJWT, updateCurrentPassword);                              //change password route
router.route("/current-user").get(verifyJWT, getCurrentUser);                                         //current user route
router.route("/c/:username").get(verifyJWT, getUserChannelProfile);                                   //channel profile route
router.route("/update-account").patch(verifyJWT, updateAccountDetail);                                //update account route
router
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateAvatarImgae);                                      //user avatar image route
router
  .route("/cover-avatar")
  .patch(verifyJWT, upload.single("coverImage"), updateCoverImgae);                                   //user cover image route
router.route("/history").patch(verifyJWT, getWatchHistory);                                           //watch history route

export default router;
