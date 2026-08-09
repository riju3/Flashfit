import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const emailUser = process.env.EMAIL_USER || process.env.GMAIL_USER || 'royrajdeep943@gmail.com';
const emailPass = process.env.EMAIL_PASS || process.env.GMAIL_PASS || 'tyzcsxodrmrzflhs';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: emailUser,
        pass: emailPass,
    },
});

const sendEmail = async ({ sendTo, subject, html }) => {
    try {
        if (!sendTo) {
            console.error('❌ [Nodemailer Error]: No recipient email provided!');
            return null;
        }

        const mailOptions = {
            from: `FlashFit <${emailUser}>`,
            to: sendTo, // Delivers OTP email directly to the registered user's email address
            subject: subject,
            html: html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ [Nodemailer OTP Email Delivered Successfully to ${sendTo}]:`, info.messageId);
        return info;
    } catch (error) {
        console.error(`❌ [Nodemailer Delivery Error to ${sendTo}]:`, error?.message || error);
        return null;
    }
};

export default sendEmail;
