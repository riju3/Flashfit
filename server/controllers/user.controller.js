import sendEmail from '../config/sendEmail.js'
import UserModel from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js'
import registerOtpTemplate from '../utils/registerOtpTemplate.js'
import generatedAccessToken from '../utils/generatedAccessToken.js'
import genertedRefreshToken from '../utils/generatedRefreshToken.js'
import uploadImageClodinary from '../utils/uploadImageClodinary.js'
import generatedOtp from '../utils/generatedOtp.js'
import forgotPasswordTemplate from '../utils/forgotPasswordTemplate.js'
import jwt from 'jsonwebtoken'
import supabase from '../config/supabaseClient.js'

export async function registerUserController(request,response){
    try {
        const { name, email , password } = request.body

        if(!name || !email || !password){
            return response.status(400).json({
                message : "Provide email, name, password",
                error : true,
                success : false
            })
        }

        const existingUser = await UserModel.findOne({ email })

        if(existingUser && existingUser.verify_email){
            return response.status(400).json({
                message : "Already registered email. Please login.",
                error : true,
                success : false
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password,salt)
        const otp = generatedOtp()
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

        if (existingUser && !existingUser.verify_email) {
            existingUser.name = name
            existingUser.password = hashPassword
            existingUser.register_otp = otp
            existingUser.register_otp_expiry = otpExpiry
            await existingUser.save()
        } else {
            const payload = {
                name,
                email,
                password : hashPassword,
                role : "USER",
                verify_email : false,
                status : "Active",
                register_otp : otp,
                register_otp_expiry : otpExpiry
            }
            const newUser = new UserModel(payload)
            await newUser.save()
        }

        console.log("==========================================")
        console.log(`🔑 REGISTER OTP FOR [${email}]: ${otp}`)
        console.log("==========================================")

        // --------------------------------------------------------
        // 🚀 SUPABASE AUTH EMAIL OTP (Sends 6-digit OTP token!)
        // --------------------------------------------------------
        let supabaseSent = false;
        if (supabase) {
            try {
                const { data, error } = await supabase.auth.signInWithOtp({
                    email: email,
                    options: {
                        shouldCreateUser: true,
                        data: { name: name }
                    }
                })
                if (!error) {
                    supabaseSent = true;
                    console.log(`[SUPABASE 6-DIGIT OTP SENT TO ${email}]`);
                } else {
                    console.log(`[SUPABASE AUTH ERROR]:`, error.message);
                }
            } catch (sbErr) {
                console.log(`[SUPABASE AUTH EXCEPTION]:`, sbErr?.message || sbErr);
            }
        }

        // Fallback email sender if Supabase not configured or skipped
        if (!supabaseSent) {
            try {
                await sendEmail({
                    sendTo : email,
                    subject : "Verify your email - FlashFit OTP",
                    html : registerOtpTemplate({
                        name,
                        otp
                    })
                })
            } catch(emailErr) {
                console.log("Register OTP email error:", emailErr?.message || emailErr)
            }
        }

        return response.json({
            message : "OTP sent to your email. Please verify to complete registration.",
            error : false,
            success : true,
            email : email
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

// Verify Registration OTP Controller
export async function verifyRegisterOtpController(request, response) {
    try {
        const { email, otp } = request.body

        if (!email || !otp) {
            return response.status(400).json({
                message: "Provide email and OTP",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({ email })

        if (!user) {
            return response.status(400).json({
                message: "User not found",
                error: true,
                success: false
            })
        }

        if (user.verify_email) {
            return response.json({
                message: "Email is already verified. Please login.",
                success: true,
                error: false
            })
        }

        let verified = false;

        // 🚀 1. Attempt Supabase Auth OTP verification if Supabase is enabled
        if (supabase) {
            try {
                const { data, error } = await supabase.auth.verifyOtp({
                    email: email,
                    token: otp,
                    type: 'signup'
                });

                if (!error && data?.user) {
                    verified = true;
                    console.log(`[SUPABASE OTP VERIFIED SUCCESSFULLY FOR ${email}]`);
                } else {
                    // Try type 'email' fallback for signInWithOtp
                    const res2 = await supabase.auth.verifyOtp({
                        email: email,
                        token: otp,
                        type: 'email'
                    });
                    if (!res2.error && res2.data?.user) {
                        verified = true;
                    }
                }
            } catch (sbErr) {
                console.log('[SUPABASE VERIFY OTP EXCEPTION]:', sbErr?.message || sbErr);
            }
        }

        // 🚀 2. Fallback to MongoDB stored OTP if Supabase verification was not triggered or used
        if (!verified) {
            if (user.register_otp !== otp) {
                return response.status(400).json({
                    message: "Invalid OTP code",
                    error: true,
                    success: false
                })
            }

            const currentTime = new Date().getTime()
            const otpExpiryTime = new Date(user.register_otp_expiry).getTime()

            if (currentTime > otpExpiryTime) {
                return response.status(400).json({
                    message: "OTP has expired. Please request a new OTP.",
                    error: true,
                    success: false
                })
            }
            verified = true;
        }

        if (verified) {
            user.verify_email = true
            user.register_otp = null
            user.register_otp_expiry = null
            await user.save()

            return response.json({
                message: "Email verified successfully! Registration complete.",
                success: true,
                error: false
            })
        }

        return response.status(400).json({
            message: "Verification failed.",
            error: true,
            success: false
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// Resend Registration OTP Controller
export async function resendRegisterOtpController(request, response) {
    try {
        const { email } = request.body

        if (!email) {
            return response.status(400).json({
                message: "Provide email address",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({ email })

        if (!user) {
            return response.status(400).json({
                message: "User not found",
                error: true,
                success: false
            })
        }

        if (user.verify_email) {
            return response.status(400).json({
                message: "Email is already verified. Please login.",
                error: true,
                success: false
            })
        }

        const otp = generatedOtp()
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

        user.register_otp = otp
        user.register_otp_expiry = otpExpiry
        await user.save()

        console.log("==========================================")
        console.log(`🔑 RESEND REGISTER OTP FOR [${email}]: ${otp}`)
        console.log("==========================================")

        let supabaseSent = false;
        if (supabase) {
            try {
                const { error } = await supabase.auth.signInWithOtp({
                    email: email
                });
                if (!error) {
                    supabaseSent = true;
                    console.log(`[SUPABASE 6-DIGIT RESEND OTP SENT TO ${email}]`);
                }
            } catch (sbErr) {
                console.log('[SUPABASE RESEND EXCEPTION]:', sbErr);
            }
        }

        if (!supabaseSent) {
            try {
                await sendEmail({
                    sendTo: email,
                    subject: "Verify your email - FlashFit New OTP",
                    html: registerOtpTemplate({
                        name: user.name,
                        otp
                    })
                })
            } catch (emailErr) {
                console.log("Resend OTP email error:", emailErr?.message || emailErr)
            }
        }

        return response.json({
            message: "New OTP sent to your email.",
            success: true,
            error: false
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function verifyEmailController(request,response){
    try {
        const { code } = request.body

        const user = await UserModel.findOne({ _id : code})

        if(!user){
            return response.status(400).json({
                message : "Invalid code",
                error : true,
                success : false
            })
        }

        const updateUser = await UserModel.updateOne({ _id : code },{
            verify_email : true
        })

        return response.json({
            message : "Verify email done",
            success : true,
            error : false
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : true
        })
    }
}

//login controller
export async function loginController(request,response){
    try {
        const { email , password } = request.body


        if(!email || !password){
            return response.status(400).json({
                message : "provide email, password",
                error : true,
                success : false
            })
        }

        const user = await UserModel.findOne({ email })

        if(!user){
            return response.status(400).json({
                message : "User not registered",
                error : true,
                success : false
            })
        }

        if(!user.verify_email){
            return response.status(400).json({
                message : "Email is not verified. Please verify your email with OTP.",
                error : true,
                success : false,
                unverified : true,
                email : user.email
            })
        }

        if(user.status !== "Active"){
            return response.status(400).json({
                message : "Contact to Admin",
                error : true,
                success : false
            })
        }

        const checkPassword = await bcryptjs.compare(password,user.password)

        if(!checkPassword){
            return response.status(400).json({
                message : "Check your password",
                error : true,
                success : false
            })
        }

        const accesstoken = await generatedAccessToken(user._id)
        const refreshToken = await genertedRefreshToken(user._id)

        const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
            last_login_date : new Date()
        })

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }
        response.cookie('accessToken',accesstoken,cookiesOption)
        response.cookie('refreshToken',refreshToken,cookiesOption)

        return response.json({
            message : "Login successfully",
            error : false,
            success : true,
            data : {
                accesstoken,
                refreshToken
            }
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//logout controller
export async function logoutController(request,response){
    try {
        const userid = request.userId //middleware

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }

        response.clearCookie("accessToken",cookiesOption)
        response.clearCookie("refreshToken",cookiesOption)

        const removeRefreshToken = await UserModel.findByIdAndUpdate(userid,{
            refresh_token : ""
        })

        return response.json({
            message : "Logout successfully",
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//upload user avatar
export async  function uploadAvatar(request,response){
    try {
        const userId = request.userId // auth middlware
        const image = request.file  // multer middleware

        const upload = await uploadImageClodinary(image)
        
        const updateUser = await UserModel.findByIdAndUpdate(userId,{
            avatar : upload.url
        })

        return response.json({
            message : "upload profile",
            success : true,
            error : false,
            data : {
                _id : userId,
                avatar : upload.url
            }
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//update user details
export async function updateUserDetails(request,response){
    try {
        const userId = request.userId //auth middleware
        const { name, email, mobile, password } = request.body 

        let hashPassword = ""

        if(password){
            const salt = await bcryptjs.genSalt(10)
            hashPassword = await bcryptjs.hash(password,salt)
        }

        const updateUser = await UserModel.updateOne({ _id : userId},{
            ...(name && { name : name }),
            ...(email && { email : email }),
            ...(mobile && { mobile : mobile }),
            ...(password && { password : hashPassword })
        })

        return response.json({
            message : "Updated successfully",
            error : false,
            success : true,
            data : updateUser
        })


    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//forgot password not login
export async function forgotPasswordController(request,response) {
    try {
        const { email } = request.body 

        const user = await UserModel.findOne({ email })

        if(!user){
            return response.status(400).json({
                message : "Email not available",
                error : true,
                success : false
            })
        }

        const otp = generatedOtp()
        const expireTime = new Date() + 60 * 60 * 1000 // 1hr

        const update = await UserModel.findByIdAndUpdate(user._id,{
            forgot_password_otp : otp,
            forgot_password_expiry : new Date(expireTime).toISOString()
        })

        await sendEmail({
            sendTo : email,
            subject : "Forgot password from Binkeyit",
            html : forgotPasswordTemplate({
                name : user.name,
                otp : otp
            })
        })

        return response.json({
            message : "check your email",
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//verify forgot password otp
export async function verifyForgotPasswordOtp(request,response){
    try {
        const { email , otp }  = request.body

        if(!email || !otp){
            return response.status(400).json({
                message : "Provide required field email, otp.",
                error : true,
                success : false
            })
        }

        const user = await UserModel.findOne({ email })

        if(!user){
            return response.status(400).json({
                message : "Email not available",
                error : true,
                success : false
            })
        }

        const currentTime = new Date().toISOString()

        if(user.forgot_password_expiry < currentTime  ){
            return response.status(400).json({
                message : "Otp is expired",
                error : true,
                success : false
            })
        }

        if(otp !== user.forgot_password_otp){
            return response.status(400).json({
                message : "Invalid otp",
                error : true,
                success : false
            })
        }

        //if otp is not expired
        //otp === user.forgot_password_otp

        const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
            forgot_password_otp : "",
            forgot_password_expiry : ""
        })
        
        return response.json({
            message : "Verify otp successfully",
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//reset the password
export async function resetpassword(request,response){
    try {
        const { email , newPassword, confirmPassword } = request.body 

        if(!email || !newPassword || !confirmPassword){
            return response.status(400).json({
                message : "provide required fields email, newPassword, confirmPassword"
            })
        }

        const user = await UserModel.findOne({ email })

        if(!user){
            return response.status(400).json({
                message : "Email is not available",
                error : true,
                success : false
            })
        }

        if(newPassword !== confirmPassword){
            return response.status(400).json({
                message : "newPassword and confirmPassword must be same.",
                error : true,
                success : false,
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(newPassword,salt)

        const update = await UserModel.findOneAndUpdate(user._id,{
            password : hashPassword
        })

        return response.json({
            message : "Password updated successfully.",
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


//refresh token controler
export async function refreshToken(request,response){
    try {
        const refreshToken = request.cookies.refreshToken || request?.headers?.authorization?.split(" ")[1]  /// [ Bearer token]

        if(!refreshToken){
            return response.status(401).json({
                message : "Invalid token",
                error  : true,
                success : false
            })
        }

        const verifyToken = await jwt.verify(refreshToken,process.env.SECRET_KEY_REFRESH_TOKEN)

        if(!verifyToken){
            return response.status(401).json({
                message : "token is expired",
                error : true,
                success : false
            })
        }

        const userId = verifyToken?._id

        const newAccessToken = await generatedAccessToken(userId)

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }

        response.cookie('accessToken',newAccessToken,cookiesOption)

        return response.json({
            message : "New Access token generated",
            error : false,
            success : true,
            data : {
                accessToken : newAccessToken
            }
        })


    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//get login user details
export async function userDetails(request,response){
    try {
        const userId  = request.userId

        console.log(userId)

        const user = await UserModel.findById(userId).select('-password -refresh_token')

        return response.json({
            message : 'user details',
            data : user,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : "Something is wrong",
            error : true,
            success : false
        })
    }
}