import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Chat } from "../models/chat.model.js";
import { Rating } from "../models/rating.model.js";

export const rateUser = asyncHandler(async (req, res) => {
  console.log("\n******** Inside rateUser Controller function ********");

  const { rating, description, username } = req.body;

  if (!rating || !description || !username) {
    throw new ApiError(400, "Please provide all the details");
  }

  const user = await User.findOne({ username: username });
  if (!user) {
    throw new ApiError(400, "User not found");
  }
  const rateGiver = req.user._id;

  console.log("rateGiver: ", rateGiver);
  console.log("user: ", user._id);

  // find if there is chat between the two users
  const chat = await Chat.findOne({
    users: { $all: [rateGiver, user._id] },
  });

  if (!chat) {
    throw new ApiError(400, "Please connect first to rate the user");
  }

  const rateExist = await Rating.findOne({
    rater: rateGiver,
    username: username,
  });

  console.log("rateExist: ", rateExist);

  if (rateExist) {
    throw new ApiError(400, "You have already rated this user");
  }

  var rate = await Rating.create({
    rating: rating,
    description: description,
    username: username,
    rater: rateGiver,
  });

  console.log("Created rating:", rate);

  if (!rate) {
    throw new ApiError(500, "Rating not added");
  }

  const ratings = await Rating.find({ username: username });

  //   find average of the ratings
  let total = 0;
  ratings.forEach((r) => {
    total += r.rating;
  });
  const avgRating = total / ratings.length;

  await User.findByIdAndUpdate(
    { _id: user._id },
    {
      rating: avgRating,
    }
  );

  // Fetch the newly created rating with populated rater data
  const newRating = await Rating.findById(rate._id)
    .populate("rater", "name username picture");

  console.log("New rating with populated data:", newRating);

  res.status(200).json(new ApiResponse(200, newRating, "Rating added successfully"));
});

export const getRatings = asyncHandler(async (req, res) => {
  console.log("\n******** Inside getRatings Controller function ********");

  const { username } = req.params;

  if (!username) {
    throw new ApiError(400, "Username is required");
  }

  const user = await User.findOne({ username: username });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const ratings = await Rating.find({ username: username })
    .populate("rater", "name username picture")
    .sort({ createdAt: -1 });

  console.log("Fetched ratings:", ratings);

  // Filter to only include reviews from valid users
  const validRatings = ratings.filter(rating => {
    return rating.rater && 
           rating.rater.name && 
           rating.rater.username && 
           rating.description && 
           rating.description.trim() !== '';
  });

  console.log("Valid ratings:", validRatings);

  res.status(200).json(new ApiResponse(200, {
    userRating: user.rating || 0,
    totalRatings: validRatings.length,
    ratings: validRatings
  }, "Ratings fetched successfully"));
});
