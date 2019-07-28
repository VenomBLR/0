import express from "express"
import bodyParser from "body-parser"
import routes from "./routers/main";
import cookieParser from "cookie-parser";
import cors from 'cors';
import { closePool } from "./services/serviceDb";

// Create a new express application instance
var whitelist = ['http://localhost:3000']
const app = express();
const port = 5050;

// Open port

var corsOptionsDelegate = function (req, callback) {
var corsOptions;
if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}
const port_handler = app.listen(port, () => { console.log(`ERS running on port ${port}.`);

// Close the pool when app shuts down
process.on('SIGINT', () => {closePool(); port_handler.close(); });

// Call midlewares
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

//Set all routes from routes folder
app.use("/", cors(corsOptionsDelegate), routes);
});