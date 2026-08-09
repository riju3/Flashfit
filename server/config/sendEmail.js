import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const sendEmail = async ({ sendTo, subject, html }) => {
    try {
        // ----------------------------------------------------
        // METHOD 1: GMAIL SMTP (100% FREE - RECOMMENDED)
        // Set EMAIL_USER & EMAIL_PASS (Gmail App Password) in .env
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
            console.log(`[EMAIL SENT via Gmail SMTP to ${sendTo}]:`, info.messageId);
            return info;
        }

        // ----------------------------------------------------
        // METHOD 2: RESEND API (FREE 3000 emails/month)
        // Set RESEND_API in .env
        // Uses onboarding@resend.dev on Resend Free Tier
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
                console.error('[Resend Email Error]:', error);
                return null;
            }

            console.log(`[EMAIL SENT via Resend to ${sendTo}]:`, data);
            return data;
        }

        // Fallback: No credentials provided
        console.log(`[EMAIL SKIPPED - No EMAIL_USER/PASS or RESEND_API configured in .env] Target: ${sendTo}`);
        return null;
    } catch (error) {
        console.error('[SendEmail Exception]:', error?.message || error);
        return null;
    }
};

export default sendEmail;
