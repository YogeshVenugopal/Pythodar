import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './Config/db.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT

app.use(cors())
app.use(express.json())

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

connectDB()