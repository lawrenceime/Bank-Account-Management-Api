"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountNumberGenerator = void 0;
const accountNumberGenerator = () => {
    const accountNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
    return accountNumber;
};
exports.accountNumberGenerator = accountNumberGenerator;
