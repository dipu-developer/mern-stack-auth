import dotenv from 'dotenv'
dotenv.config()
import express from "express";
import connectDB from "./db/database.js";
import routes from "./routes/web.js";
import cors from 'cors'
const app = express();
const port = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

// Database connections
connectDB(DATABASE_URL);

app.use(cors())
app.use(express.json())
//Handle Urls
app.use("/api", routes);

//Handle the post data
app.use(express.urlencoded({extended:true}))

app.listen(port, () => {
  console.log(`Server start at ${port} port.`);
});
