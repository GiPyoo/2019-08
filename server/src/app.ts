import "dotenv/config";
import "reflect-metadata";
import express, { Express } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { Connection, createConnection } from "typeorm";
import postRouter from "./routes/post/post-router";
import channelRouter from "./routes/channel/channel-router";
import snugRouter from "./routes/snug/snug-router";
import userRouter from "./routes/user/user-router";
import authRouter from "./routes/auth/auth-router";
import inviteRouter from "./routes/invite/invite-router";
import indexRouter from "./routes/index";
import dotenv from "dotenv";
import { initializeTransactionalContext, patchTypeORMRepositoryWithBaseRepository } from "typeorm-transactional-cls-hooked";

export default class App {
  private static app: Express;
  private static connection: Connection;

  static async start() {
    dotenv.config({path: __dirname.concat("/../")});
    return await createConnection()
      .then(connection => {
        this.connection = connection;
        this.setUpTransactions();
        return this.initializeExpress();
      })
      .catch(error => console.error("TypeORM Connection Error: ", error));
  }

  private static initializeExpress() {
    this.app = express();
    this.app.set("port", process.env.PORT || 3000);
    this.app.set("env", process.env.NODE_ENV);
    this.app.use(express.static("public"));
    this.app.use(morgan("dev"));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser(process.env.COOKIE_SECRET));
    this.app.use("/api/posts", postRouter);
    this.app.use("/api/channels", channelRouter);
    this.app.use("/api/snugs", snugRouter);
    this.app.use("/api/auth", authRouter);
    this.app.use("/api/users", userRouter);
    this.app.use("/api/invite", inviteRouter);
    this.app.use("/", indexRouter);
    return this.app;
  }

  static getEntityManager() {
    return this.connection.manager;
  }

  static setUpTransactions(): void {
    initializeTransactionalContext();
    patchTypeORMRepositoryWithBaseRepository();
  }
}