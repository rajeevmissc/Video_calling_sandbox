import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { CheckCircle, AlertCircle, Send, Lock } from "lucide-react";
import AuthImage1 from "../../Logos/auth1.png";

const PhoneStep = ({
    phone,
    setPhone,
    countryData,
    setCountryData,
    isLoading,
    error,
    validatePhoneNumber,
    handleSendOTP,
}) => {

    const [accepted, setAccepted] = useState(false);
    const [tError, setTError] = useState(""); // NEW ✔

    const onSend = () => {
        // Reset previous errors
        setTError("");

        // Check T&C first
        if (!accepted) {
            setTError("Please accept Terms & Conditions before continuing.");
            return;
        }

        // Phone invalid?
        if (!validatePhoneNumber(phone)) {
            setTError("Please enter a valid mobile number.");
            return;
        }

        // Continue OTP logic
        handleSendOTP();
    };

    return (
        <div className="min-h-screen flex">

            {/* ---------------- LEFT PANEL ---------------- */}
            <div className="w-1/2 hidden lg:flex">
                <img
                    src={AuthImage1}
                    alt="Secure Illustration"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* ---------------- RIGHT PANEL ---------------- */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-10">
                <div className="w-full max-w-md">

                    <h2 className="text-5xl font-bold text-center mb-2">Welcome Back</h2>
                    <p className="max-w-xl text-gray-600 text-center mb-8">
                        Enter your phone number to access <br/> your account securely
                    </p>

                    {/* Phone Input */}
                    <PhoneInput
                        country={"in"}
                        value={phone}
                        onChange={(v, c) => {
                            setPhone(v);
                            setCountryData(c);
                        }}
                        placeholder="Enter phone"
                        inputClass="!w-full !py-5 !text-base !rounded-lg !border-gray-300"
                        buttonClass="!rounded-l-lg !bg-gray-50"
                        dropdownClass="custom-select"
                        containerClass="w-full"
                    />

                    {/* Validation */}
                    {phone && validatePhoneNumber(phone) && (
                        <div className="flex items-center text-green-600 mt-2">
                            <CheckCircle size={16} />
                            <span className="ml-2">Valid number</span>
                        </div>
                    )}

                    {/* Error from backend */}
                    {error && (
                        <div className="bg-red-100 p-3 rounded-lg flex items-center mt-3 text-red-700">
                            <AlertCircle size={18} />
                            <span className="ml-2">{error}</span>
                        </div>
                    )}

                    {/* New T&C Checkbox */}
                    <div className="mt-5 flex items-start gap-3">
                        <input
                            type="checkbox"
                            checked={accepted}
                            onChange={() => setAccepted(!accepted)}
                            className="w-5 h-5 cursor-pointer"
                        />
                        <p className="text-sm text-gray-600 leading-tight">
                            I accept the{" "}
                            <button
                                className="text-indigo-600 underline"
                                onClick={() => window.open("/terms-and-conditions", "_blank")}
                            >
                                Terms & Conditions
                            </button>{" "}
                            and{" "}
                            <button
                                className="text-indigo-600 underline"
                                onClick={() => window.open("/privacy-policy", "_blank")}
                            >
                                Privacy Policy
                            </button>.
                        </p>

                    </div>

                    {/* Custom Error (when clicking button without accept) */}
                    {tError && (
                        <div className="bg-red-100 p-3 rounded-lg flex items-center mt-4 text-red-700">
                            <AlertCircle size={18} />
                            <span className="ml-2">{tError}</span>
                        </div>
                    )}

                    {/* BUTTON (NOT DISABLED) */}
                    <button
                        onClick={onSend}
                        className={`w-full mt-6 flex items-center justify-center gap-2 py-3 rounded-lg text-white font-semibold shadow-md 
                            bg-black hover:bg-gray-900 transition`}
                    >
                        {isLoading ? "Sending..." : "Send Verification Code"}
                        {!isLoading && <Send size={18} />}
                    </button>

                    {/* Security Badges */}
                    <div className="flex items-center justify-center gap-3 mt-6 text-gray-500 text-xs">
                        <Lock size={12} /> Your information is encrypted and secure
                    </div>

                    <div className="flex items-center justify-center gap-3 mt-2 text-gray-400 text-xs">
                        <span>🔒 SSL Protected</span> • <span>⚕️ HIPAA Compliant</span>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default PhoneStep;
