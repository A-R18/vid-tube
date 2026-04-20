import bcrypt from "bcrypt";
import fs from "fs/promises";
import mongoose, { Schema } from "mongoose";
import { SignJWT, importPKCS8 } from "jose";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: string,
        required: true,
        unique: true,
        lowercase: true,
        index: true,
        trim: true
    },

    fullName: {
        type: string,
        required: true,
        trim: true

    },

    avatar: {
        type: string,
        required: true,

    },

    coverImage: {
        type: string,
        required: true,

    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
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
        timestamps: true
    }
);

userSchema.pre("save", async function (next) {
    if (this.modified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.matchPassword = async function (next) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccess = async function () {
    const rawPrivateKey = await fs.readFile("./src/keys/private.pem");
    const privateKeyCrypt = importPKCS8(rawPrivateKey, "edDSA");
    const accessToken = await new SignJWT({ id: this._id })
        .setProtectedHeader({ alg: "edDSA" })
        .setIssuedAt(Date.now())
        .setExpirationTime(process.env.ACC_TOKEN_EXP)
    sign(privateKeyCrypt);
    console.log(token, "\n");
    return accessToken;
}



userSchema.methods.generateRefreshToken = async function () {
    const rawPrivateKey = await fs.readFile("./src/keys/private.pem");
    const privateKeyCrypt = importPKCS8(rawPrivateKey, "edDSA");
    const refreshToken = await new SignJWT({ id: this._id })
        .setProtectedHeader({ alg: "edDSA" })
        .setIssuedAt(Date.now())
        .setExpirationTime(process.env.REF_TOKEN_EXP)
    sign(privateKeyCrypt);
    console.log(token, "\n");
    return refreshToken;
}


export const User = mongoose.model("User", userSchema);
