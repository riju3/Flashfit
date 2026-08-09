const registerOtpTemplate = ({ name, otp }) => {
    return `
<div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
    <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #ea580c; font-size: 26px; margin: 0; font-weight: 800;">FlashFit</h1>
        <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Email Verification Code</p>
    </div>
    
    <p style="color: #334155; font-size: 15px; line-height: 1.5;">Dear <strong>${name || 'Customer'}</strong>,</p>
    
    <p style="color: #334155; font-size: 15px; line-height: 1.5;">
        Thank you for choosing FlashFit! To verify your email address and complete your registration, please enter the following One-Time Password (OTP):
    </p>
    
    <div style="background-color: #fff7ed; border: 2px dashed #f97316; font-size: 32px; letter-spacing: 8px; padding: 18px; text-align: center; font-weight: 800; color: #ea580c; margin: 24px 0; border-radius: 10px;">
        ${otp}
    </div>
    
    <p style="color: #64748b; font-size: 13px; line-height: 1.4;">
        ⚠️ This code is valid for <strong>10 minutes</strong>. Please do not share this OTP with anyone for security reasons.
    </p>
    
    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
    
    <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
        If you did not request this registration, you can safely ignore this email.
    </p>
</div>
    `
}

export default registerOtpTemplate;
