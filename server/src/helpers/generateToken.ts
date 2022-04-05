import jwt from "jsonwebtoken";

import {
    JWT_ACCESS_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_SECRET
} from "../constants/strings";

import { User } from "../entity/User";

export const generateAccessToken = (user: User) => {
    return jwt.sign({ userId: user.id }, JWT_ACCESS_TOKEN_SECRET!, {
        expiresIn: "15m"
    });
};

export const generateRefreshToken = (user: User) => {
    return jwt.sign({ userId: user.id }, JWT_REFRESH_TOKEN_SECRET!, {
        expiresIn: "7d"
    });
};
