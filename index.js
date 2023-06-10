import express from "express"
import cors from "cors"
import morgan from "morgan"
import * as dotenv from 'dotenv'
import { connectDb } from "./config/db.js"
import userRoutes from "./routes/user_route.js"
import userPostRoute from "./routes/user_post_routes.js"



// Initialize app

const app = express();
dotenv.config()
connectDb()

/// MidlleWare

app.use(cors());
app.use(morgan('dev'));
app.use(express.json())
app.use('/api/user', userRoutes);
app.use('/api/user/posts', userPostRoute)

const PORT = process.env.PROD || 8000

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);

})

