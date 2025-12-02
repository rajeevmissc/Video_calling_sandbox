import {
    ArrowLeft,
    RefreshCw,
    Timer,
    AlertCircle,
    CheckCircle,
    Lock,
} from "lucide-react";
import AuthImage2 from "../../Logos/auth2.png"; 

const OTPStep = ({
    otp,
    setOtp,
    otpRefs,
    error,
    timer,
    canResend,
    isVerifying,
    handleBack,
    handleOtpSubmit,
    handleResendOTP,
    setError,
    phone
}) => {
    const handleChange = (i, val) => {
        if (isNaN(val) || val.length > 1) return;
        const updated = [...otp];
        updated[i] = val;
        setOtp(updated);
        setError("");

        if (val && i < 5) otpRefs.current[i + 1].focus();

        if (updated.every((d) => d !== "")) {
            setTimeout(() => handleOtpSubmit(updated), 200);
        }
    };

    const maskPhone = (phone) => {
        if (!phone) return "";
        const visibleDigits = 3; // last digits to show
        const maskedPart = "*".repeat(phone.length - visibleDigits);
        return `+${maskedPart}${phone.slice(-visibleDigits)}`;
    };



    return (
        <div className="min-h-screen flex">

            {/* ---------------- LEFT ILLUSTRATION PANEL ---------------- */}
            <div className="w-1/2 hidden lg:flex">
                <img
                    src={AuthImage2}
                    alt="Secure Illustration"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* ---------------- RIGHT OTP PANEL ---------------- */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8">

                <div className="w-full max-w-md text-center">

                    <h2 className="text-3xl font-bold mb-1">Verify Your Number</h2>
                    <p className="text-gray-600 mb-6">
                        We've sent a verification code to<br />
                        <span className="font-semibold">
                            {maskPhone(phone)}
                        </span>

                    </p>

                    {/* OTP inputs */}
                    <div className="flex justify-center gap-2">
                        {otp.map((d, i) => (
                            <input
                                key={i}
                                type="text"
                                maxLength={1}
                                value={d}
                                ref={(el) => (otpRefs.current[i] = el)}
                                onChange={(e) => handleChange(i, e.target.value)}
                                className="w-12 h-12 text-center text-xl border rounded-lg bg-gray-100 focus:ring-2 focus:ring-black outline-none"
                            />
                        ))}
                    </div>

                    {/* Loading Feedback */}
                    {isVerifying && (
                        <p className="text-indigo-600 mt-3 flex items-center justify-center gap-2">
                            <RefreshCw size={16} className="animate-spin" /> Verifying...
                        </p>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="bg-red-100 p-3 rounded-lg flex items-center mt-4 text-red-700">
                            <AlertCircle size={18} />
                            <span className="ml-2">{error}</span>
                        </div>
                    )}

                    {/* Resend */}
                    <div className="mt-5">
                        {canResend ? (
                            <button
                                onClick={handleResendOTP}
                                className="text-indigo-600 font-semibold flex justify-center items-center gap-1"
                            >
                                <RefreshCw size={14} /> Resend code
                            </button>
                        ) : (
                            <p className="text-gray-500 flex items-center justify-center gap-2">
                                <Timer size={16} /> Resend code in {timer}s
                            </p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex gap-3">
                        <button
                            onClick={handleBack}
                            className="flex-1 py-3 border rounded-lg bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center gap-2"
                        >
                            <ArrowLeft size={16} /> Back
                        </button>

                        <button
                            onClick={() => handleOtpSubmit()}
                            disabled={otp.some((d) => d === "") || isVerifying}
                            className="flex-1 py-3 rounded-lg bg-black text-white hover:bg-gray-900 transition flex items-center justify-center gap-2"
                        >
                            Verify <CheckCircle size={16} />
                        </button>
                    </div>

                    {/* Security footer */}
                    <div className="mt-6 text-gray-500 text-xs flex items-center justify-center gap-3">
                        <Lock size={12} /> SSL Protected • HIPAA Compliant
                    </div>

                </div>
            </div>
        </div>
    );
};

export default OTPStep;
