import express from "express"
import bodyParser from "body-parser"
import routes from "./routers/main";
import cookieParser from "cookie-parser";
import { closePool } from "./services/serviceDb";

// Create a new express application instance
const app = express();
const port = 5050;

// Open port
const port_handler = app.listen(port, () => { console.log(`ERS running on port ${port}.`);

// Close the pool when app shuts down
process.on('SIGINT', () => {closePool(); port_handler.close(); });

// Call midlewares
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');

    // authorized headers for preflight requests
    // https://developer.mozilla.org/en-US/docs/Glossary/preflight_request
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();

    app.options('*', (req, res) => {
        // allowed XHR methods  
        res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
        res.send();
    });
});

//Set all routes from routes folder
app.use("/", routes);
});