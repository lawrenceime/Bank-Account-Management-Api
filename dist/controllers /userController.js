"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allAccounts = exports.resolveAccount = exports.createAccount = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Create database dynamically
let databaseFolder = path_1.default.join(__dirname, "../../src/userDatabase");
let databaseFile = path_1.default.join(databaseFolder, "userDatabase.json");
const bankAccounts = [];
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
        const accountNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
        const newAccount = {
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
    }
    catch (error) {
        console.log(error);
    }
};
exports.createAccount = createAccount;
const resolveAccount = (req, res, next) => {
    const { accountNumber } = req.params;
    const account = bankAccounts.find((acc) => acc.accountNumber === parseInt(accountNumber));
    if (!account) {
        return res.status(404).json({ error: "Account not found" });
    }
    return res.json(account);
};
exports.resolveAccount = resolveAccount;
const allAccounts = (req, res, next) => {
    return res.json(bankAccounts);
};
exports.allAccounts = allAccounts;
