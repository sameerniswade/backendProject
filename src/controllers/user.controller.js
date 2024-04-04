import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend
  //validation - not empty
  //check if the user already exist : username, email unique
  //check for images and check for avtar
  //upload them to cloudinary
  //create user object - create entry in db
  //remove password and refresh token filed
  //cheak for user creation
  //return response

  const { fullName, email, username, password } = req.body;
  console.log('req', req.files.avatar[0]?.path);

  //validation
  if (
    [fullName, email, username, password].some((field) => field.trim() === '')
  ) {
    throw new ApiError(400, 'All fields are required');
  }

  //user exist
  const existUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existUser) {
    throw new ApiError(409, 'User with email or username already exists');
  }

  //images
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = registerUser.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, 'Avatar file is required');
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, 'Avatar file is required to upload on cloudinary');
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || '',
    email,
    password,
    username: username.tolowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );

  if (!createdUser) {
    throw new ApiError(500, 'something went wrong while registering user');
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, 'User Registered successfully'));
});

export { registerUser };
