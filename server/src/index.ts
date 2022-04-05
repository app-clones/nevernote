import "reflect-metadata";
import "dotenv-safe/config";

import { buildSchema } from "type-graphql";

import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

import express from "express";
import cors from "cors";
import morgan from "morgan";

import { AppDataSource } from "./data-source";

import { MyContext } from "./types/context";

import { PORT } from "./constants/strings";
import { UserResolver } from "./resolvers/UserResolver";

AppDataSource.initialize()
    .then(async () => {
        const app = express();

        app.use(cors());
        app.use(morgan("dev"));

        app.get("/", (_, res) => {
            res.json({ msg: "Hello World!" });
        });

        const apolloServer = new ApolloServer({
            schema: await buildSchema({ resolvers: [UserResolver] }),
            plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
            context: ({ req, res }): MyContext => ({ req, res })
        });

        await apolloServer.start();
        apolloServer.applyMiddleware({ app });

        app.listen(PORT, () =>
            console.log(`Server running on port http://localhost:${PORT}`)
        );
    })
    .catch((error) => console.log(error));
