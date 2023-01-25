import {CallServer} from "./classes/callServer/callServer.js";
import "../style/main.css";

// create CallServer object
const callServer = new CallServer();

// call get data to get data from server
callServer.getData();