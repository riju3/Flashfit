import React, { useState, useRef, useEffect } from 'react'
import { FaRegEyeSlash, FaRegEye, FaArrowLeft, FaShieldHalved } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [step, setStep] = useState(1) // 1: Register Form, 2: OTP Verification
    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const [loading, setLoading] = useState(false)
    const [timer, setTimer] = useState(60)
    const [canResend, setCanResend] = useState(false)
    
    const inputRefs = useRef([])
    const navigate = useNavigate()

    // Countdown timer for OTP resend
    useEffect(() => {
        let interval = null
        if (step === 2 && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1)
            }, 1000)
        } else if (timer === 0) {
            setCanResend(true)
        }
        return () => clearInterval(interval)
    }, [step, timer])

    const handleChange = (e) => {
        const { name, value } = e.target
        setData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const valideValue = Object.values(data).every(el => el)

    // Step 1: Submit Register Form & Request OTP
    const handleSubmitRegister = async (e) => {
        e.preventDefault()

        if (data.password !== data.confirmPassword) {
            toast.error("Password and confirm password must match")
            return
        }

        if (data.password.length < 6) {
            toast.error("Password must be at least 6 characters long")
            return
        }

        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.register,
                data: {
                    name: data.name,
                    email: data.email,
                    password: data.password
                }
            })

            if (response.data.error) {
                toast.error(response.data.message)
            }

            if (response.data.success) {
                toast.success(response.data.message || "OTP sent to your email!")
                setStep(2)
                setTimer(60)
                setCanResend(false)
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    // Step 2: Handle OTP Input Change
    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return

        const newOtp = [...otp]
        newOtp[index] = value.substring(value.length - 1)
        setOtp(newOtp)

        // Move to next input automatically
        if (value && index < 5 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus()
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1].focus()
        }
    }

    const isOtpComplete = otp.every((val) => val !== "")

    // Step 2: Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault()

        const otpCode = otp.join("")
        if (otpCode.length !== 6) {
            toast.error("Please enter complete 6-digit OTP")
            return
        }

        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.verify_register_otp,
                data: {
                    email: data.email,
                    otp: otpCode
                }
            })

            if (response.data.error) {
                toast.error(response.data.message)
            }

            if (response.data.success) {
                toast.success("Email verified successfully! You can now login.")
                navigate("/login", { state: { email: data.email } })
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    // Resend OTP
    const handleResendOtp = async () => {
        if (!canResend) return

        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.resend_register_otp,
                data: {
                    email: data.email
                }
            })

            if (response.data.error) {
                toast.error(response.data.message)
            }

            if (response.data.success) {
                toast.success(response.data.message || "New OTP sent to your email!")
                setOtp(["", "", "", "", "", ""])
                setTimer(60)
                setCanResend(false)
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className='w-full container mx-auto px-2 min-h-[80vh] flex items-center justify-center py-8'>
            <div className='bg-white shadow-xl border border-gray-100 my-4 w-full max-w-lg mx-auto rounded-2xl p-7 transition-all duration-300'>
                {step === 1 ? (
                    /* STEP 1: REGISTRATION FORM */
                    <>
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Create Your FlashFit Account</h2>
                            <p className="text-sm text-gray-500 mt-1">Enter your details to receive an email verification OTP</p>
                        </div>

                        <form className='grid gap-4' onSubmit={handleSubmitRegister}>
                            <div className='grid gap-1'>
                                <label htmlFor='name' className='text-sm font-semibold text-gray-700'>Full Name :</label>
                                <input
                                    type='text'
                                    id='name'
                                    autoFocus
                                    className='bg-slate-50 p-3 border border-gray-200 rounded-xl outline-none focus:border-orange-500 focus:bg-white transition-all text-sm'
                                    name='name'
                                    value={data.name}
                                    onChange={handleChange}
                                    placeholder='Enter your full name'
                                    disabled={loading}
                                />
                            </div>

                            <div className='grid gap-1'>
                                <label htmlFor='email' className='text-sm font-semibold text-gray-700'>Email Address :</label>
                                <input
                                    type='email'
                                    id='email'
                                    className='bg-slate-50 p-3 border border-gray-200 rounded-xl outline-none focus:border-orange-500 focus:bg-white transition-all text-sm'
                                    name='email'
                                    value={data.email}
                                    onChange={handleChange}
                                    placeholder='Enter your email address'
                                    disabled={loading}
                                />
                            </div>

                            <div className='grid gap-1'>
                                <label htmlFor='password' className='text-sm font-semibold text-gray-700'>Password :</label>
                                <div className='bg-slate-50 p-3 border border-gray-200 rounded-xl flex items-center focus-within:border-orange-500 focus-within:bg-white transition-all text-sm'>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id='password'
                                        className='w-full outline-none bg-transparent text-sm'
                                        name='password'
                                        value={data.password}
                                        onChange={handleChange}
                                        placeholder='Create a strong password (min 6 chars)'
                                        disabled={loading}
                                    />
                                    <div onClick={() => setShowPassword(prev => !prev)} className='cursor-pointer text-gray-500 hover:text-gray-700 ml-2'>
                                        {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                                    </div>
                                </div>
                            </div>

                            <div className='grid gap-1'>
                                <label htmlFor='confirmPassword' className='text-sm font-semibold text-gray-700'>Confirm Password :</label>
                                <div className='bg-slate-50 p-3 border border-gray-200 rounded-xl flex items-center focus-within:border-orange-500 focus-within:bg-white transition-all text-sm'>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id='confirmPassword'
                                        className='w-full outline-none bg-transparent text-sm'
                                        name='confirmPassword'
                                        value={data.confirmPassword}
                                        onChange={handleChange}
                                        placeholder='Re-enter your password'
                                        disabled={loading}
                                    />
                                    <div onClick={() => setShowConfirmPassword(prev => !prev)} className='cursor-pointer text-gray-500 hover:text-gray-700 ml-2'>
                                        {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={!valideValue || loading}
                                className={`w-full py-3 rounded-xl font-bold text-white transition-all duration-200 shadow-md ${valideValue && !loading ? "bg-orange-600 hover:bg-orange-500 cursor-pointer shadow-orange-200" : "bg-gray-400 cursor-not-allowed"}`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        Sending OTP...
                                    </span>
                                ) : (
                                    "Continue & Send OTP"
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm text-gray-600 border-t border-gray-100 pt-4">
                            Already have an account? <Link to={"/login"} className='font-bold text-orange-600 hover:text-orange-700'>Login Here</Link>
                        </div>
                    </>
                ) : (
                    /* STEP 2: OTP VERIFICATION VIEW */
                    <>
                        <div className="flex items-center justify-between mb-4">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
                            >
                                <FaArrowLeft className="text-xs" /> Edit Details
                            </button>
                            <span className="text-xs font-semibold px-2.5 py-1 bg-orange-50 text-orange-600 rounded-full border border-orange-200 flex items-center gap-1">
                                <FaShieldHalved /> OTP Verification
                            </span>
                        </div>

                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Verify Your Email</h2>
                            <p className="text-sm text-gray-600 mt-1">
                                We sent a 6-digit OTP code to <br />
                                <strong className="text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-xs mt-1 inline-block">{data.email}</strong>
                            </p>
                        </div>

                        <form onSubmit={handleVerifyOtp} className="grid gap-6">
                            <div className="flex justify-between items-center gap-2 my-2">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength={1}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-12 h-14 text-center text-xl font-extrabold bg-slate-50 border-2 border-gray-200 rounded-xl outline-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all"
                                    />
                                ))}
                            </div>

                            <button
                                type="submit"
                                disabled={!isOtpComplete || loading}
                                className={`w-full py-3.5 rounded-xl font-bold text-white transition-all shadow-md ${isOtpComplete && !loading ? "bg-orange-600 hover:bg-orange-500 cursor-pointer shadow-orange-200" : "bg-gray-400 cursor-not-allowed"}`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        Verifying OTP...
                                    </span>
                                ) : (
                                    "Verify OTP & Register"
                                )}
                            </button>
                        </form>

                        <div className="text-center mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                            <span className="text-gray-500">Didn't receive the OTP?</span>
                            {canResend ? (
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={loading}
                                    className="font-bold text-orange-600 hover:text-orange-700 hover:underline cursor-pointer"
                                >
                                    Resend OTP
                                </button>
                            ) : (
                                <span className="font-semibold text-gray-400 text-xs">
                                    Resend code in <strong className="text-orange-600">{timer}s</strong>
                                </span>
                            )}
                        </div>
                    </>
                )}
            </div>
        </section>
    )
}

export default Register
