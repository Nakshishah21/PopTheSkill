import express from "express";
import { rateUser, getRatings } from "../controllers/rating.controllers.js";
import { verifyJWT_username } from "../middlewares/verifyJWT.middleware.js";

const router = express.Router();

router.post("/rateUser", verifyJWT_username, rateUser);
router.get("/getRatings/:username", getRatings);

export default router;
