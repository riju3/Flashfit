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

import sendEmail from '../config/sendEmail.js';
import registerOtpTemplate from '../utils/registerOtpTemplate.js';

async function testDelivery() {
    console.log('Sending real test OTP email via Gmail SMTP...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER || 'royrajdeep943@gmail.com');
    
    const targetEmail = process.argv[2] || 'subhamoychowdhury53@gmail.com';
    const testOtp = '852963';

    console.log(`Target Recipient: ${targetEmail}`);

    const result = await sendEmail({
        sendTo: targetEmail,
        subject: 'FlashFit Registration OTP Test',
        html: registerOtpTemplate({
            name: 'FlashFit User',
            otp: testOtp
        })
    });

    console.log('Result:', result ? 'DELIVERED SUCCESSFULLY ✅' : 'FAILED ❌');
    process.exit(0);
}

testDelivery();
