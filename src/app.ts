import express, {Request, Response} from 'express';
import dotenv from 'dotenv'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import userRoutes from './routes/userRoutes'
import fs from 'fs';
import path from 'path';
import BankAccount from './usermodels/userBank';

dotenv.config()

const app = express(); 

// middlewares 
app.use(logger('dev'))
app.use(express.json())
app.use(cookieParser())
app.use('/users' , userRoutes)

app.use('/', (req:Request, res:Response)=>{
  try{

    let databaseFolder = path.join(__dirname, "../../src/userDatabase");
let databaseFile = path.join(databaseFolder, "userDatabase.json");

let bankAccounts: BankAccount[] = [];
    const data = fs.readFileSync(databaseFile, 'utf-8')
        if(!data){
            return res.status(404).json({
                message:`Error reading database`
            })

        }else{
            bankAccounts =  JSON.parse(data);
        }
        res.status(200).json({
            message: `Accounts successfully fetched`,
            data: bankAccounts
        })
    }catch(error:any){
        res.status(500).json({message: `Internal Server Error`})
    }
})

app.listen(3060, () => {
    console.log(`App is paying attention on Port ${3060}`)
  })
  
  export default app;