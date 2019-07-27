import express from "express"
import bodyParser from "body-parser"
import routes from "./routers/main";
import cors from "cors";
import cookieParser from "cookie-parser";
import { closePool } from "./services/serviceDb";

// Create a new express application instance
var token;
const app = express();
const port = 5050;

// Open port
const port_handler = app.listen(port, () => { console.log(`ERS running on port ${port}.`);

// Close the pool when app shuts down
process.on('SIGINT', () => {closePool(); port_handler.close(); });

// Call midlewares
app.use(cookieParser());
app.use(cors({exposedHeaders: ['Content-Length', `${token}`, 'X-Foo', 'X-Bar'],}));
app.use(bodyParser.json());
app.use(express.json());

//Set all routes from routes folder
app.use("/", routes);});