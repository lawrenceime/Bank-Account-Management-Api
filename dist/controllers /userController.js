"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allAccounts = exports.resolveAccount = exports.createAccount = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const helperFunctions_1 = require("../utilities/helperFunctions");
// Create database dynamically
let databaseFolder = path_1.default.join(__dirname, "../../src/userDatabase");
let databaseFile = path_1.default.join(databaseFolder, "userDatabase.json");
let bankAccounts = [];
const createAccount = (req, res, next) => {
    try {
        if (!fs_1.default.existsSync(databaseFolder)) {
            fs_1.default.mkdirSync(databaseFolder);
        }
        if (!fs_1.default.existsSync(databaseFile)) {
            fs_1.default.writeFileSync(databaseFile, " ");
        }
        // Read from Database
        let databaseRead = [];
        try {
            const data = fs_1.default.readFileSync(databaseFile, "utf-8");
            if (!data) {
                return res.status(404).json({
                    message: `Error reading from database`,
                });
            }
            else {
                databaseRead = JSON.parse(data);
            }
        }
        catch (parseError) {
            databaseRead = [];
            console.log(parseError);
        }
        const { accountName, dob, accountType, initialBalance } = req.body;
        if (!accountName ||
            !dob ||
            !accountType ||
            initialBalance === undefined ||
            initialBalance < 0) {
            return res.status(400).json({ error: "Invalid input" });
        }
        let existingAccount = databaseRead.find((account) => account.accountName === accountName);
        if (existingAccount) {
            return res.send({
                message: `The account ${accountName} already exists`
            });
        }
        const accountNumber = (0, helperFunctions_1.accountNumberGenerator)();
        const newAccount = {
            accountNumber,
            accountName,
            dob,
            accountType,
            balance: initialBalance,
        };
        bankAccounts.push(newAccount);
        fs_1.default.writeFile(databaseFile, JSON.stringify(bankAccounts, null, 2), "utf8", (err) => {
            if (err) {
                return res.status(500).json({
                    message: `Account not created successfully`
                });
            }
            else {
                return res.status(200).json({
                    message: `Account created Successfully`,
                    data: newAccount
                });
            }
        });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: `Internal Server Error`
        });
    }
};
exports.createAccount = createAccount;
const resolveAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //   const { accountNumber } = req.params;
        const accountNumber = req.query.account_number;
        const data = fs_1.default.readFileSync(databaseFile, 'utf-8');
        if (!data) {
            return res.status(404).json({
                message: `Error reading database`
            });
        }
        else {
            bankAccounts = JSON.parse(data);
        }
        const account = bankAccounts.find((acc) => acc.accountNumber === parseInt(accountNumber));
        if (!account) {
            return res.status(404).json({ error: "Account not found" });
        }
        return res.status(200).json({
            message: `Account fetched successfully`,
            data: account
        });
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
});
exports.resolveAccount = resolveAccount;
const allAccounts = (req, res, next) => {
    try {
        const data = fs_1.default.readFileSync(databaseFile, 'utf-8');
        if (!data) {
            return res.status(404).json({
                message: `Error reading database`
            });
        }
        else {
            bankAccounts = JSON.parse(data);
        }
        res.status(200).json({
            message: `Accounts successfully fetched`,
            data: bankAccounts
        });
    }
    catch (error) {
        res.status(500).json({ message: `Internal Server Error` });
    }
};
exports.allAccounts = allAccounts;
