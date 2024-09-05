import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connected from "./data.js"
import employesrouter from "./router.js"
import path from "path"

dotenv.config()
const port=process.env.PORT
const app = express()
connected()

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use('/uploads', express.static(path.join(__dirname, './uploads')));

app.use(cors())
app.use(express.json())
app.use("/api",employesrouter)

app.listen(port, () => {
    console.log("app listening  port:3020")
})