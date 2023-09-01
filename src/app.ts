import express, {Request, Response} from 'express';
import dotenv from 'dotenv'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import userRoutes from './routes/userRoutes'

dotenv.config()

const app = express(); 

// middlewares 
app.use(logger('dev'))
app.use(express.json())
app.use(cookieParser())
app.use('/users' , userRoutes)

app.use('/', (req:Request, res:Response)=>{
  res.send('welcome to the bank')
})

app.listen(3060, () => {
    console.log(`App is paying attention on Port ${3060}`)
  })
  
  export default app;