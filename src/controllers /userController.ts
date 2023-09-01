import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import BankAccount from '../usermodels/userBank'
import {accountNumberGenerator} from '../utilities/helperFunctions'

// Create database dynamically
let databaseFolder = path.join(__dirname, "../../src/userDatabase");
let databaseFile = path.join(databaseFolder, "userDatabase.json");

let bankAccounts: BankAccount[] = [];

export const createAccount = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!fs.existsSync(databaseFolder)) {
      fs.mkdirSync(databaseFolder);
    }

    if (!fs.existsSync(databaseFile)) {
      fs.writeFileSync(databaseFile, " ");
    }

    // Read from Database
    let databaseRead: any[] = [];
    try {
      const data = fs.readFileSync(databaseFile, "utf-8");
      if (!data) {
        return res.status(404).json({
          message: `Error reading from database`,
        });
      } else {
        databaseRead = JSON.parse(data);
      }
    } catch (parseError) {
        databaseRead = []
      console.log(parseError);
    }

    const { accountName, dob, accountType, initialBalance } = req.body;

    if (
      !accountName ||
      !dob ||
      !accountType ||
      initialBalance === undefined ||
      initialBalance < 0
    ) {
      return res.status(400).json({ error: "Invalid input" });
    }

    let existingAccount = databaseRead.find((account)=> account.accountName === accountName)

    if(existingAccount){
        return res.send({
            message: `The account ${accountName} already exists`
        })
    }
    const accountNumber = accountNumberGenerator()

    const newAccount: BankAccount = {
      accountNumber,
      accountName,
      dob,
      accountType,
      balance: initialBalance,
    };

    bankAccounts.push(newAccount);

    fs.writeFile(databaseFile, JSON.stringify(bankAccounts, null, 2), "utf8", (err)=>{
        if(err){    
            return res.status(500).json({    
                message: `Account not created successfully`    
            })    
        } else{    
            return res.status(200).json({    
                message: `Account created Successfully`,    
                data: newAccount    
            })    
        }    
    })
  } catch (error:any) {
    console.log(error.message);
    res.status(500).json({
        message: `Internal Server Error`
    })
  }
};

export const resolveAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    try{
//   const { accountNumber } = req.params;
  const accountNumber:any = req.query.account_number
  const data = fs.readFileSync(databaseFile, 'utf-8')
        if(!data){
            return res.status(404).json({
                message:`Error reading database`
            })
        }else{
            bankAccounts =  JSON.parse(data);
        }
  const account =  bankAccounts.find(
      (acc) => acc.accountNumber === parseInt(accountNumber)
      );

  if (!account) {
    return res.status(404).json({ error: "Account not found" });
  }
  return res.status(200).json({
    message: `Account fetched successfully`,
    data: account
  });
}catch(error:any){
    return res.status(500).json({
        message: 'Internal Server Error'
    })
}
};

export const allAccounts = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    try{
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
};
