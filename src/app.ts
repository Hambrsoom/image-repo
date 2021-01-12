import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes/routes";

export default class App {
  private app: express.Application;
  private port: number;

  constructor(port) {
      this.app = express();
      this.port = port;

      this.initializeMiddlewares();
  }

  private initializeMiddlewares(): void {
    this.app.use(bodyParser.urlencoded({
      extended: true
    }));
    this.app.use(express.static("./public"));
    this.app.use(bodyParser.raw());
    this.app.use(bodyParser.json());
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use("/api", routes);
    this.app.use((error, res) => {return res.status(500).json({ error: error.toString() })}); // Central error handling
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}