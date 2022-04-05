import {
    Resolver,
    Query,
    Mutation,
    Arg,
    ObjectType,
    Field,
    Ctx
} from "type-graphql";
import argon2 from "argon2";

import { User } from "../entity/User";

import {
    generateAccessToken,
    generateRefreshToken
} from "../helpers/generateToken";
import { Error } from "../helpers/Error";

import { MyContext } from "../types/context";

import { JWT_COOKIE_NAME } from "../constants/strings";

@ObjectType()
class LoginResponse {
    @Field(() => String, { nullable: true })
    accessToken?: string;

    @Field(() => String, { nullable: true })
    refreshToken?: string;

    @Field(() => Error, { nullable: true })
    error?: Error;
}

@ObjectType()
class RegisterResponse {
    @Field(() => Boolean, { nullable: true })
    success?: boolean;

    @Field(() => Error, { nullable: true })
    error?: Error;
}

@Resolver()
export class UserResolver {
    @Query(() => String)
    hello() {
        return "Hello world!";
    }

    @Mutation(() => RegisterResponse)
    async signup(
        @Arg("email") email: string,
        @Arg("password") password: string
    ) {
        try {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser)
                return { error: { message: "Email already in use" } };

            await User.insert({
                email,
                password: await argon2.hash(password, { hashLength: 128 }),
                username: email.split("@")[0]
            });

            return true;
        } catch (error: any) {
            return { error: { message: error.message } };
        }
    }

    @Mutation(() => LoginResponse)
    async login(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() { res }: MyContext
    ): Promise<LoginResponse> {
        try {
            const user = await User.findOne({ where: { email } });
            if (!user) return { error: { message: "Invalid Login" } };

            const validPassword = await argon2.verify(user.password, password);
            if (!validPassword) return { error: { message: "Invalid Login" } };

            const accessToken = generateAccessToken(user);

            const refreshToken = generateRefreshToken(user);

            res.cookie(JWT_COOKIE_NAME, refreshToken, { httpOnly: true });

            return { accessToken, refreshToken };
        } catch (error: any) {
            return { error: { message: error.message } };
        }
    }
}
