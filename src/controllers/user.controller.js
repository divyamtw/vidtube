import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;

  //validation
  if (
    [fullname, username, email, password].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required!");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "user already exists!");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  // let avatar = "";
  // if (avatarLocalPath) {
  //   avatar = await uploadOnCloudinary(avatarLocalPath);
  // }

  // let coverImage = "";
  // if (coverImageLocalPath) {
  //   coverImage = await uploadOnCloudinary(coverImageLocalPath);
  // }

  let avatar = "";
  let coverImage = "";

  if (avatarLocalPath) {
    try {
      avatar = await uploadOnCloudinary(avatarLocalPath);
      console.log("Uploaded avatar", avatar);
    } catch (error) {
      console.log("Error uploading avatar image.", error);
      throw new ApiError(500, "Failed to upload avatar image.");
    }
  }

  if (coverImageLocalPath) {
    try {
      coverImage = await uploadOnCloudinary(coverImageLocalPath);
      console.log("Uploaded cover Image", coverImage);
    } catch (error) {
      console.log("Error uploading cover Image image.", error);
      throw new ApiError(500, "Failed to upload cover Image image.");
    }
  }

  try {
    const user = await User.create({
      fullname,
      avatar: avatar?.url || "",
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.trim().toLowerCase(),
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering user.");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User registered Successfully!"));
  } catch (error) {
    console.log("User Creation failed!");
    if (avatar) await deleteFromCloudinary(avatar.public_id);
    if (coverImage) await deleteFromCloudinary(coverImage.public_id);

    throw new ApiError(
      500,
      "Something went wrong while registering user. and imgaes were deleted!"
    );
  }
});

export { registerUser };
