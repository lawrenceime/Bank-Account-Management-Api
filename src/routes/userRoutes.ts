import express from 'express';
import {allAccounts, createAccount, resolveAccount} from '../controllers /userController'

const router = express.Router();

router.post('/create-account', createAccount)
router.get('/resolve-account', resolveAccount)
router.get('/all-accounts', allAccounts)


export default router