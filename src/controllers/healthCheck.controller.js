import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const checkHealth = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, null, "App is working fine!"));
});

export { checkHealth };
