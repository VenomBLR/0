import express from "express"
import bodyParser from "body-parser"
import routes from "./routers/main";
import cors from "cors";
import cookieParser from "cookie-parser";
import { closePool } from "./services/serviceDb";

// Create a new express application instance
const app = express();
const port = 5050;
const corsOptions: cors.CorsOptions = {
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token", "Authorization"],
    credentials: true,
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    origin: "*",
    preflightContinue: false
};

// Open port
const port_handler = app.listen(port, () => { console.log(`ERS running on port ${port}.`);

// Close the pool when app shuts down
process.on('SIGINT', () => {closePool(); port_handler.close(); });

// Call midlewares
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());

//Set all routes from routes folder
app.use("/", routes);
});