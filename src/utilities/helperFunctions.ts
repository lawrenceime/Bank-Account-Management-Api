

export const accountNumberGenerator = () => {
    const accountNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
    return accountNumber
}