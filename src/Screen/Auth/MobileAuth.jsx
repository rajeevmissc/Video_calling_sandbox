import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./../../hooks/useAuth";
import { authService } from "./../../services/authService";
import Logo from "../../Logos/SVG/Black.svg";
import PhoneStep from "./PhoneStep";
import OTPStep from "./OTPStep";
import SuccessStep from "./SuccessStep";
import { Helmet } from "react-helmet-async";
const MobileOTPLogin = () => {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [countryData, setCountryData] = useState({
    dialCode: "1",
    countryCode: "us",
  });

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const otpRefs = useRef([]);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    let interval;
    if (step === "otp" && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const validatePhoneNumber = (phoneNumber) => {
    return phoneNumber && phoneNumber.length >= 10;
  };

  const handleSendOTP = async () => {
    setError("");

    if (!validatePhoneNumber(phone)) {
      setError("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);

    try {
      const phoneWithoutCode = phone.substring(countryData.dialCode.length);

      const response = await authService.sendOTP(
        phoneWithoutCode,
        countryData.dialCode,
        "login"
      );

      if (response.success) {
        setStep("otp");
        setTimer(30);
        setCanResend(false);
      }
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (otpToVerify = otp) => {
    if (otpToVerify.some((d) => d === "")) {
      setError("Please enter complete OTP");
      return;
    }

    setIsVerifying(true);

    try {
      const otpCode = otpToVerify.join("");
      const fullPhone = `+${phone}`;

      const response = await login(fullPhone, otpCode, {
        platform: "web",
        browser: navigator.userAgent,
      });

      if (response.success) {
        localStorage.setItem("token", response.data.token);

        if (response.user) {
          localStorage.setItem(
            "userData",
            JSON.stringify(response.user)
          );
        }

        setStep("success");
        setShowSuccess(true);

        setTimeout(() => navigate("/"), 2000);
      }
    } catch (error) {
      setError(error.message || "Invalid OTP");
      setOtp(["", "", "", "", "", ""]);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await authService.resendOTP(`+${phone}`);
      setCanResend(false);
      setTimer(30);
      setOtp(["", "", "", "", "", ""]);
    } catch {
      setError("Try sending OTP again after cooldown.");
    }
  };

  const handleBack = () => {
    setStep("phone");
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setTimer(30);
    setCanResend(false);
  };

  return (
    <>
      <Helmet>
        <title>Login to Your GetCompanion Account | Secure OTP Login</title>
        <meta
          name="description"
          content="Enter your mobile number to receive a secure OTP and access your GetCompanion account. Your identity and data remain fully protected."
        />
        <meta name="keywords" content="login OTP India, secure mobile login, GetCompanion login, emotional support login" />
        <meta property="og:title" content="Login to GetCompanion" />
        <meta property="og:description" content="Safe, secure and private OTP login to your emotional support account." />
        <meta property="og:image" content="https://res.cloudinary.com/dnnyay9oc/image/upload/v1764412256/GC_Logo_-_Black1.1_1_evfzjn.png" />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="min-h-screen">
        <header className="w-full flex items-center justify-between px-6 py-2 bg-white shadow-sm">
          {/* Logo Section */}
          <div className="flex items-center space-x-2">
            <img
              src={Logo}
              alt="Get Companion Logo"
              className="h-10 w-auto object-contain"
            />
          </div>

          {/* Right Text */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 text-sm">Need Help?</span>
            <button
              onClick={() => navigate("/contact-us")}
              className="text-blue-600 text-sm font-medium hover:underline">
              Support
            </button>
          </div>
        </header>
        {step === "phone" && (
          <PhoneStep
            phone={phone}
            setPhone={setPhone}
            countryData={countryData}
            setCountryData={setCountryData}
            isLoading={isLoading}
            error={error}
            validatePhoneNumber={validatePhoneNumber}
            handleSendOTP={handleSendOTP}
          />
        )}

        {step === "otp" && (
          <OTPStep
            otp={otp}
            phone={phone}
            setOtp={setOtp}
            otpRefs={otpRefs}
            error={error}
            timer={timer}
            canResend={canResend}
            isVerifying={isVerifying}
            handleBack={handleBack}
            handleOtpSubmit={handleVerifyOTP}
            handleResendOTP={handleResendOTP}
            setError={setError}
          />
        )}

        {step === "success" && <SuccessStep phone={phone} showSuccess={showSuccess} />}
      </div>
    </>
  );
};

export default MobileOTPLogin;
