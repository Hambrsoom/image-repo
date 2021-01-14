import App from "./app";
import * as dotenv from "dotenv";
import { createConnection } from "typeorm";

dotenv.config({
    path: "./config/config.env"
});

const port = process.env.PORT || 5000;

const app:App = new App(port);

createConnection().then(async connection => {
    app.listen();
});

export default app;
