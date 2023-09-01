"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers /userController");
const router = express_1.default.Router();
router.post('/create-account', userController_1.createAccount);
router.get('/resolve-account', userController_1.resolveAccount);
router.get('/all-accounts', userController_1.allAccounts);
exports.default = router;
