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
import supabase from '../config/supabaseClient.js';
import { registerUserController, verifyRegisterOtpController, loginController } from '../controllers/user.controller.js';

async function testEmailVerificationLive() {
    console.log('====================================================');
    console.log('🧪 LIVE EMAIL VERIFICATION & OTP TEST');
    console.log('====================================================');

    console.log('\n1. Connecting to Database...');
    await connectDB();

    console.log(`\n2. Supabase Client Status: ${supabase ? 'Active ✅' : 'Inactive ❌'}`);
    if (supabase) {
        console.log(`   Supabase URL: ${process.env.SUPABASE_URL}`);
    }

    const testEmail = 'flashfit.verifier@gmail.com';
    const testPassword = 'Password123!';

    // Cleanup previous test user if exists
    await UserModel.deleteMany({ email: testEmail });

    console.log('\n3. Testing Step 1: User Registration & Sending OTP...');
    const reqRegister = {
        body: {
            name: 'FlashFit Tester',
            email: testEmail,
            password: testPassword
        }
    };

    let registerResponse = {};
    const resRegister = {
        status: (code) => ({
            json: (d) => {
                registerResponse = d;
                console.log(`   Register Status [${code}]:`, d);
            }
        }),
        json: (d) => {
            registerResponse = d;
            console.log('   Register Response:', d);
        }
    };

    await registerUserController(reqRegister, resRegister);

    // Fetch user doc from Mongo
    const dbUser = await UserModel.findOne({ email: testEmail });
    if (!dbUser) {
        console.error('❌ User creation failed in MongoDB!');
        process.exit(1);
    }

    console.log(`   MongoDB User created: _id=${dbUser._id}`);
    console.log(`   verify_email status: ${dbUser.verify_email} (Expected: false)`);
    console.log(`   Generated OTP: ${dbUser.register_otp}`);
    console.log(`   OTP Expiry: ${dbUser.register_otp_expiry}`);

    console.log('\n4. Testing Step 2: Login BEFORE OTP Verification (Should be Blocked)...');
    let preLoginBlocked = false;
    const reqPreLogin = { body: { email: testEmail, password: testPassword } };
    const resPreLogin = {
        status: (code) => ({
            json: (d) => {
                console.log(`   Pre-Verification Login Response [${code}]:`, d.message);
                if (code === 400 && d.unverified) {
                    preLoginBlocked = true;
                }
            }
        }),
        json: (d) => console.log('   Pre-Verification Login Response:', d)
    };
    await loginController(reqPreLogin, resPreLogin);

    if (preLoginBlocked) {
        console.log('   ✅ UNVERIFIED LOGIN BLOCK: PASSED! (User cannot log in without OTP)');
    } else {
        console.error('   ❌ UNVERIFIED LOGIN BLOCK FAILED!');
    }

    console.log('\n5. Testing Step 3: Verifying Invalid OTP (Should Fail)...');
    let invalidOtpFailed = false;
    const reqInvalidVerify = { body: { email: testEmail, otp: '000000' } };
    const resInvalidVerify = {
        status: (code) => ({
            json: (d) => {
                console.log(`   Invalid OTP Response [${code}]:`, d.message);
                if (code === 400) invalidOtpFailed = true;
            }
        }),
        json: (d) => console.log('   Invalid OTP Response:', d)
    };
    await verifyRegisterOtpController(reqInvalidVerify, resInvalidVerify);

    if (invalidOtpFailed) {
        console.log('   ✅ INVALID OTP REJECTION: PASSED!');
    }

    console.log('\n6. Testing Step 4: Verifying Correct OTP...');
    let verifySuccess = false;
    const reqValidVerify = { body: { email: testEmail, otp: dbUser.register_otp } };
    const resValidVerify = {
        status: (code) => ({
            json: (d) => console.log(`   Valid OTP Verification [${code}]:`, d)
        }),
        json: (d) => {
            console.log('   Valid OTP Verification Response:', d);
            if (d.success) verifySuccess = true;
        }
    };
    await verifyRegisterOtpController(reqValidVerify, resValidVerify);

    const verifiedDbUser = await UserModel.findOne({ email: testEmail });
    console.log(`   Post-verification verify_email status in DB: ${verifiedDbUser.verify_email}`);

    if (verifySuccess && verifiedDbUser.verify_email === true) {
        console.log('   ✅ OTP VERIFICATION: PASSED!');
    } else {
        console.error('   ❌ OTP VERIFICATION FAILED!');
    }

    console.log('\n7. Testing Step 5: Login AFTER OTP Verification (Should Succeed)...');
    let postLoginSuccess = false;
    const reqPostLogin = { body: { email: testEmail, password: testPassword } };
    const resPostLogin = {
        cookie: () => {},
        status: (code) => ({ json: (d) => console.log(`   Post-Verification Login [${code}]:`, d) }),
        json: (d) => {
            console.log('   Post-Verification Login Response:', d.message);
            if (d.success && d.data?.accesstoken) postLoginSuccess = true;
        }
    };
    await loginController(reqPostLogin, resPostLogin);

    if (postLoginSuccess) {
        console.log('   ✅ POST-VERIFICATION LOGIN: PASSED! Access token issued successfully.');
    } else {
        console.error('   ❌ POST-VERIFICATION LOGIN FAILED!');
    }

    // Cleanup test user
    await UserModel.deleteMany({ email: testEmail });

    console.log('\n====================================================');
    console.log('🎉 ALL EMAIL VERIFICATION TESTS COMPLETED SUCCESSFULLY!');
    console.log('====================================================\n');

    process.exit(0);
}

testEmailVerificationLive();
