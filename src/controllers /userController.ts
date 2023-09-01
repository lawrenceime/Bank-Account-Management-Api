import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";

interface BankAccount {
  accountNumber: number;
  accountName: string;
  dob: string;
  accountType: string;
  balance: number;
}

// Create database dynamically
let databaseFolder = path.join(__dirname, "../../src/userDatabase");
let databaseFile = path.join(databaseFolder, "userDatabase.json");

const bankAccounts: BankAccount[] = [];

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

    const accountNumber = Math.floor(Math.random() * 9000000000) + 1000000000;

    const newAccount: BankAccount = {
      accountNumber,
      accountName,
      dob,
      accountType,
      balance: initialBalance,
    };

    bankAccounts.push(newAccount);

    return res.json({
      accountNumber,
      accountName,
      accountType,
      balance: initialBalance,
    });
  } catch (error) {
    console.log(error);
  }
};

export const resolveAccount = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { accountNumber } = req.params;

  const account = bankAccounts.find(
    (acc) => acc.accountNumber === parseInt(accountNumber)
  );

  if (!account) {
    return res.status(404).json({ error: "Account not found" });
  }
  return res.json(account);
};

export const allAccounts = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.json(bankAccounts);
};
