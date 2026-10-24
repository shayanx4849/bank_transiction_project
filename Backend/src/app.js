import express from "express";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
// Authentication accepts the token cookie set by the auth controllers, so parse
// cookies before any route middleware tries to read req.cookies.
app.use(cookieParser());

/**
 * - Routes required
 */
import authRouter from "./routes/auth.route.js";
import accountRouter from "./routes/account.route.js";

/**
 * - Use Routes
 */
app.use("/api/auth", authRouter);
app.use("/api/accounts", accountRouter);
export default app;
