import bcrypt from "bcrypt";
import fs from "fs/promises";
import mongoose, { Schema } from "mongoose";
import { SignJWT, importPKCS8 } from "jose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    avatar: {
      type: String,
      required: true,
    },

    coverImage: {
      type: String,
      required: true,
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      rquired: [true, "password is required!"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function (userID) {
  const rawPrivateKey = await fs.readFile("./src/keys/private.pem", "utf-8");
  const privateKeyCrypt = await importPKCS8(rawPrivateKey, "EdDSA");
  const accessToken = await new SignJWT({ id: userID.toString() })
    .setProtectedHeader({ alg: "EdDSA" })
    .setIssuedAt(Date.now() / 1000)
    .setExpirationTime(process.env.ACC_TOKEN_EXP)
    .sign(privateKeyCrypt);
  return accessToken;
};

userSchema.methods.generateRefreshToken = async function (userID) {
  const rawPrivateKey = await fs.readFile("./src/keys/private.pem", "utf-8");
  const privateKeyCrypt = await importPKCS8(rawPrivateKey, "EdDSA");
  const refreshToken = await new SignJWT({ id: userID.toString() })
    .setProtectedHeader({ alg: "EdDSA" })
    .setIssuedAt(Date.now() / 1000)
    .setExpirationTime(process.env.REF_TOKEN_EXP)
    .sign(privateKeyCrypt);
  return refreshToken;
};

export const User = mongoose.model("User", userSchema);
