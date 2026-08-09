import dns from 'dns';
try {
  dns.setDefaultResultOrder('ipv4first');
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

import connectDB from '../config/connectDB.js';
import UserModel from '../models/user.model.js';
import { registerUserController, verifyRegisterOtpController, loginController } from '../controllers/user.controller.js';

async function testFlow() {
    console.log('Connecting to DB...');
    await connectDB();

    const testEmail = 'testotpuser@example.com';
    await UserModel.deleteMany({ email: testEmail });

    console.log('\n--- STEP 1: REGISTER USER ---');
    const req1 = { body: { name: 'OTP Test User', email: testEmail, password: 'password123' } };
    let res1Data = {};
    const res1 = { json: (d) => { res1Data = d; console.log('Register Res:', d); } };
    await registerUserController(req1, res1);

    const userInDb = await UserModel.findOne({ email: testEmail });
    console.log(`DB User Status: verify_email=${userInDb.verify_email}, OTP=${userInDb.register_otp}`);

    console.log('\n--- STEP 2: TRY LOGIN BEFORE OTP VERIFICATION ---');
    const reqLoginUnverified = { body: { email: testEmail, password: 'password123' } };
    const resLoginUnverified = {
        status: (code) => ({ json: (d) => console.log(`Login (Before OTP) [${code}]:`, d) }),
        json: (d) => console.log('Login (Before OTP):', d)
    };
    await loginController(reqLoginUnverified, resLoginUnverified);

    console.log('\n--- STEP 3: VERIFY OTP ---');
    const reqVerify = { body: { email: testEmail, otp: userInDb.register_otp } };
    const resVerify = { json: (d) => console.log('Verify OTP Res:', d) };
    await verifyRegisterOtpController(reqVerify, resVerify);

    console.log('\n--- STEP 4: LOGIN AFTER OTP VERIFICATION ---');
    const reqLoginVerified = { body: { email: testEmail, password: 'password123' } };
    const resLoginVerified = {
        cookie: () => {},
        json: (d) => console.log('Login (After OTP) Res:', d)
    };
    await loginController(reqLoginVerified, resLoginVerified);

    console.log('\nCleaning up test user...');
    await UserModel.deleteMany({ email: testEmail });

    console.log('All OTP registration & login tests passed!');
    process.exit(0);
}

testFlow();
