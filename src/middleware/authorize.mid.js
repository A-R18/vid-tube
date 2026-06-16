import { User } from "../models/user.model.js";
import fs from "fs/promises";
import { importSPKI, jwtVerify } from "jose";
import mongoose from "mongoose";
const authorizeUser = async (req, res, next) => {
      try {
            const header = req.headers.authorization;
            if (!header) {
                  return res.status(404).json({ alert: "No token provided!" });
            }
            const token = header.split(" ")[1];
            // console.log("token is: \n", token);
            const rawPublicKey = await fs.readFile("C:/Users/Interne/.ssh/publicEDD.pem", "utf-8");
            const publicKeyCrypt = await importSPKI(rawPublicKey, "EdDSA");
            const tokenVerified = await jwtVerify(token, publicKeyCrypt);
            if (!tokenVerified) {
                  return res.status(404).json({ alert: "Invalid or expired token!" });
            }
            // console.log("token Verified is: \n",tokenVerified);
            const user = await User.findById(new mongoose.Types.ObjectId(tokenVerified.payload.id));
            const userNecessaryData = {
                  _id: user._id,
                  username: user.username,
                  email: user.email,
                  name: user.fullName,
            };

            req.user = userNecessaryData;

            next();
      } catch (error) {
            if (error.message.includes('"exp" claim timestamp')) {
                  return res.status(401).json({ alert: "Invalid or expired token!" });
            }
            return res.status(404).json({ error: error.message });
      }
};

export { authorizeUser };
