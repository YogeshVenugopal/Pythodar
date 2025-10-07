import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './Config/db.js'
import AuthRouter from './Routes/AuthRoute.js'
import ProjectRouter from './Routes/ProjectRoute.js'
dotenv.config()

const app = express()
const PORT = process.env.PORT

app.use(cors())
app.use(express.json())

app.use('/auth', AuthRouter)
app.use('/projects', ProjectRouter)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

connectDB()