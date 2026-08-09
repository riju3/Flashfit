import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resendApiKey = process.env.RESEND_API;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const sendEmail = async ({ sendTo, subject, html }) => {
    try {
        if (!resend) {
            console.log(`ℹ️ [Resend API Key Missing in .env] Skipping email to ${sendTo}. (OTP is logged in console)`);
            return null;
        }

        const { data, error } = await resend.emails.send({
            from: 'FlashFit <onboarding@resend.dev>',
            to: sendTo,
            subject: subject,
            html: html,
        });

        if (error) {
            console.error('❌ [Resend Email Error]:', error);
            return null;
        }

        console.log(`✅ [Resend Email Sent Successfully to ${sendTo}]:`, data);
        return data;
    } catch (error) {
        console.error('❌ [SendEmail Exception]:', error?.message || error);
        return null;
    }
};

export default sendEmail;
