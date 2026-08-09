import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const sendEmail = async ({ sendTo, subject, html }) => {
    try {
        // ----------------------------------------------------
        // METHOD 1: GMAIL SMTP (Nodemailer - 100% FREE & Sends to ANY email!)
        // Set EMAIL_USER & EMAIL_PASS in .env
        // ----------------------------------------------------
        const emailUser = process.env.EMAIL_USER || process.env.GMAIL_USER;
        const emailPass = process.env.EMAIL_PASS || process.env.GMAIL_PASS;

        if (emailUser && emailPass) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: emailUser,
                    pass: emailPass,
                },
            });

            const mailOptions = {
                from: `FlashFit <${emailUser}>`,
                to: sendTo,
                subject: subject,
                html: html,
            };

            const info = await transporter.sendMail(mailOptions);
            console.log(`✅ [Gmail SMTP Email Sent Successfully to ${sendTo}]:`, info.messageId);
            return info;
        }

        // ----------------------------------------------------
        // METHOD 2: RESEND API
        // Note: Resend's free tier restricted to account owner email
        // ----------------------------------------------------
        if (process.env.RESEND_API) {
            const resend = new Resend(process.env.RESEND_API);
            const { data, error } = await resend.emails.send({
                from: 'FlashFit <onboarding@resend.dev>',
                to: sendTo,
                subject: subject,
                html: html,
            });

            if (error) {
                console.error('❌ [Resend Email Error]:', error?.message || error);
                return null;
            }

            console.log(`✅ [Resend Email Sent Successfully to ${sendTo}]:`, data);
            return data;
        }

        console.log(`ℹ️ [Email Skipped - No EMAIL_USER/PASS or RESEND_API configured] Target: ${sendTo}`);
        return null;
    } catch (error) {
        console.error('❌ [SendEmail Exception]:', error?.message || error);
        return null;
    }
};

export default sendEmail;
