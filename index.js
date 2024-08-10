const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors=require('cors')

const authRouter = require('./routes/auth')
const userRouter = require('./routes/users')
const moviesRouter = require('./routes/movies')
const ListRouter = require('./routes/lists')

dotenv.config()
app.use(cors())

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Database Connected")
}).catch((e) => {
    console.log(e)
})

app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/movies', moviesRouter)
app.use('/api/lists', ListRouter)



app.listen(process.env.PORT, () => {
    console.log(`Server Running in ${process.env.PORT}`);
})
