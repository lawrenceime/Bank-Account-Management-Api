"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// middlewares 
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/users', userRoutes_1.default);
app.use('/', (req, res) => {
    try {
        let databaseFolder = path_1.default.join(__dirname, "../../src/userDatabase");
        let databaseFile = path_1.default.join(databaseFolder, "userDatabase.json");
        let bankAccounts = [];
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
});
app.listen(3060, () => {
    console.log(`App is paying attention on Port ${3060}`);
});
exports.default = app;
