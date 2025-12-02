import React, { useState, useEffect } from 'react';
import { X, Home, FileText, Shield, Upload, File } from 'lucide-react';
import { ProviderSummary } from './ProviderSummary';
import { SlotCalendar } from './SlotCalendar';
import { TimeSlotSelector } from './TimeSlotSelector';
import { WalletCheck } from './WalletCheck';
import { BookingConfirmation } from './BookingConfirmation';
import { useBooking } from '../hooks/useBooking';
import { useWallet } from '../hooks/useWallet';
import { SESSION_MODES } from '../constants/bookingConstants';
import Loading from "../../../components/Loading";
export const BookingModal = ({ provider, isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: booking, 2: verification, 3: confirmation
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [hasEnoughBalance, setHasEnoughBalance] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBookingProcessing, setIsBookingProcessing] = useState(false);

  // Verification form state
  const [verificationData, setVerificationData] = useState({
    fullName: '',
    aadhaarNumber: '',
    addressType: 'home', // 'home' or 'public'
    address: '',
    city: '',
    state: '',
    pincode: '',
    governmentIdType: 'aadhaar', // 'aadhaar', 'driving_license', 'voter_id', 'passport'
    governmentIdNumber: '',
    idProofFile: null,
    addressProofFile: null,
    agreeToTerms: false
  });

  const {
    selectedMode,
    selectedDate,
    selectedTime,
    // isProcessing,
    error,
    setSelectedMode,
    setSelectedDate,
    setSelectedTime,
    validateAndBook,
    resetBooking
  } = useBooking();

  const { balance, deduct } = useWallet();

  // ✅ Automatically select "In-Person Visit" mode on open
  useEffect(() => {
    if (isOpen) {
      setSelectedMode(SESSION_MODES.VISIT);
      // Reset verification data when modal opens
      setVerificationData({
        fullName: '',
        aadhaarNumber: '',
        addressType: 'home',
        address: '',
        city: '',
        state: '',
        pincode: '',
        governmentIdType: 'aadhaar',
        governmentIdNumber: '',
        idProofFile: null,
        addressProofFile: null,
        agreeToTerms: false
      });
      setStep(1);
    }
  }, [isOpen, setSelectedMode]);

  useEffect(() => {
    if (step === 3) {
      // Give React time to render Step 3 fully (DOM paint)
      setTimeout(() => {
        setIsBookingProcessing(false);
      }, 300); // 300ms is perfect
    }
  }, [step]);


  const handleClose = () => {
    resetBooking();
    setStep(1);
    setConfirmedBooking(null);
    onClose();
  };

  const handleBalanceChecked = (isEnough) => {
    setHasEnoughBalance(isEnough);
  };

  const handleVerificationChange = (field, value) => {
    setVerificationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = async (field, file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload only JPG, PNG, or PDF files');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    setUploadingFiles(true);

    try {
      // Store the file object
      handleVerificationChange(field, file);

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      alert('File upload failed. Please try again.');
      console.error('File upload error:', error);
    } finally {
      setUploadingFiles(false);
    }
  };

  const removeFile = (field) => {
    handleVerificationChange(field, null);
  };

  const validateVerificationForm = () => {
    const errors = [];

    if (!verificationData.fullName.trim()) {
      errors.push('Full name is required');
    }

    // Aadhaar validation
    if (!verificationData.aadhaarNumber.trim()) {
      errors.push('Aadhaar number is required');
    } else if (!/^\d{12}$/.test(verificationData.aadhaarNumber)) {
      errors.push('Aadhaar number must be 12 digits');
    }

    // Address validation
    if (!verificationData.address.trim()) {
      errors.push('Complete address is required');
    }

    if (!verificationData.city.trim()) {
      errors.push('City is required');
    }

    if (!verificationData.state.trim()) {
      errors.push('State is required');
    }

    if (!verificationData.pincode.trim()) {
      errors.push('Pincode is required');
    } else if (!/^\d{6}$/.test(verificationData.pincode)) {
      errors.push('Pincode must be 6 digits');
    }

    // Government ID validation based on type
    if (!verificationData.governmentIdNumber.trim()) {
      errors.push('Government ID number is required');
    } else {
      switch (verificationData.governmentIdType) {
        case 'aadhaar':
          if (!/^\d{12}$/.test(verificationData.governmentIdNumber)) {
            errors.push('Aadhaar number must be 12 digits');
          }
          break;
        case 'driving_license':
          if (verificationData.governmentIdNumber.length < 5) {
            errors.push('Please enter a valid driving license number');
          }
          break;
        case 'voter_id':
          if (verificationData.governmentIdNumber.length < 5) {
            errors.push('Please enter a valid voter ID number');
          }
          break;
        case 'passport':
          if (verificationData.governmentIdNumber.length < 5) {
            errors.push('Please enter a valid passport number');
          }
          break;
      }
    }

    // ✅ File validation
    if (!verificationData.idProofFile) {
      errors.push('ID proof document is required');
    }

    if (verificationData.addressType === 'home' && !verificationData.addressProofFile) {
      errors.push('Address proof document is required for home address');
    }

    if (!verificationData.agreeToTerms) {
      errors.push('You must agree to the terms and conditions');
    }

    return errors;
  };

  const handleProceedToVerification = () => {
    if (selectedDate && selectedTime && hasEnoughBalance) {
      setStep(2);
    }
  };

  const handleBooking = async () => {
    const validationErrors = validateVerificationForm();
    if (validationErrors.length > 0) {
      alert("Please fix the following errors:\n" + validationErrors.join("\n"));
      return;
    }
    setIsBookingProcessing(true);
    try {
      const result = await validateAndBook(
        provider,
        balance,

        async (cbResult) => {
          try {
            const booking = cbResult?.booking;
            if (!booking || !booking._id) {
              throw new Error("Booking ID missing");
            }

            const bookingId = booking._id;
            const bookingPrice = provider.pricing[selectedMode].basePrice;

            // WALLET DEDUCTION
            const deductionResult = await deduct(bookingPrice, bookingId);
            if (!deductionResult.success) {
              throw new Error(deductionResult.error || "Wallet deduction failed");
            }

            // ---------------------------------------------------
            // ⭐ BUILD FormData EXACTLY LIKE WORKING VERSION
            // ---------------------------------------------------
            const combinedData = {
              bookingId,
              providerId: provider._id,
              mode: selectedMode,
              userId: booking.userId,
              schedule: booking.schedule,
              price: bookingPrice,
              verification: {
                fullName: verificationData.fullName,
                aadhaarNumber: verificationData.aadhaarNumber,
                addressType: verificationData.addressType,
                address: verificationData.address,
                city: verificationData.city,
                state: verificationData.state,
                pincode: verificationData.pincode,
                governmentIdType: verificationData.governmentIdType,
                governmentIdNumber: verificationData.governmentIdNumber,
              },
            };

            const formData = new FormData();
            formData.append("data", JSON.stringify(combinedData));

            if (verificationData.idProofFile)
              formData.append("idProof", verificationData.idProofFile);

            if (verificationData.addressProofFile)
              formData.append("addressProof", verificationData.addressProofFile);

            // ---------------------------------------------------
            // ⭐ VERIFY — API Call
            // ---------------------------------------------------
            const response = await fetch(
              "https://socket-server-sandbox.onrender.com/api/verification/submit",
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formData,
              }
            );

            const resJson = await response.json();
            if (!response.ok) {
              throw new Error(resJson.error || "Verification submission failed");
            }

            // ---------------------------------------------------
            // ⭐ FIXED: Set ConfirmedBooking like FIRST VERSION
            // ---------------------------------------------------
            setConfirmedBooking({
              ...booking,
              verification: {
                ...verificationData,
                verificationId: resJson.data?._id || resJson.verificationId,
                status: resJson.data?.status || "pending",
              },
            });

            setStep(3);
            return { success: true };

          } catch (error) {
            console.error("Booking error:", error);
            alert(`Booking failed: ${error.message}`);
            setStep(2);
            return { success: false };
          }
        }
      );

      // If validateAndBook failed
      if (!result.success && result.errors) {
        setIsBookingProcessing(false);
        console.error("Booking validation failed:", result.errors);
      }
    } catch (err) {
      console.error("Unexpected booking error:", err);
      setIsBookingProcessing(false);
    }
  };


  const handleViewBookings = () => {
    alert('Navigate to My Bookings page');
    handleClose();
  };

  // Government ID options
  const governmentIdOptions = [
    { value: 'aadhaar', label: 'Aadhaar Card' },
    { value: 'driving_license', label: 'Driving License' },
    { value: 'voter_id', label: 'Voter ID' },
    { value: 'passport', label: 'Passport' }
  ];

  // ✅ Only "In-Person Visit" mode is shown
  const sessionModes = [
    { mode: SESSION_MODES.VISIT, icon: Home, label: 'In-Person Visit' }
  ];

  const canProceedToVerification = selectedDate && selectedTime && hasEnoughBalance && !isProcessing;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
        {step === 1 ? (
          <>
            {/* Step 1: Booking Selection */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Book a Session</h2>
                <p className="text-sm text-slate-600 mt-0.5">
                  Select your preferred date and time
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Provider Summary */}
              <ProviderSummary provider={provider} selectedMode={selectedMode} />

              {/* Session Mode Selection - Hidden but functional */}
              <div className="space-y-3" style={{ display: 'none' }}>
                <h3 className="text-sm font-semibold text-slate-900">Session Type</h3>
                <div className="grid grid-cols-3 gap-3">
                  {sessionModes.map(({ mode, icon: Icon, label }) => {
                    const isSelected = selectedMode === mode;
                    const pricing = provider.pricing[mode];
                    return (
                      <div
                        key={mode}
                        className={`relative p-3 rounded-xl border-2 transition-all cursor-default ${isSelected
                          ? 'border-blue-500 bg-blue-50 scale-105'
                          : 'border-slate-200 bg-white'
                          }`}
                      >
                        <div
                          className={`w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center ${isSelected ? 'bg-blue-500' : 'bg-slate-100'
                            }`}
                        >
                          <Icon
                            className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-slate-600'
                              }`}
                          />
                        </div>
                        <div
                          className={`text-xs font-medium mb-1 ${isSelected ? 'text-blue-900' : 'text-slate-700'
                            }`}
                        >
                          {label}
                        </div>
                        <div className="text-sm font-bold text-slate-900">
                          ₹{pricing.basePrice}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Calendar */}
              <SlotCalendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />

              {/* Time Slots */}
              <TimeSlotSelector
                providerId={provider._id}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onTimeSelect={setSelectedTime}
              />

              {/* Wallet Check */}
              {selectedMode && provider?.pricing?.[selectedMode] && (
                <WalletCheck
                  userId={JSON.parse(localStorage.getItem('userData') || '{}')._id}
                  servicePrice={provider.pricing[selectedMode].basePrice}
                  onBalanceChecked={handleBalanceChecked}
                />
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4">
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-semibold transition-colors"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={handleProceedToVerification}
                  disabled={!canProceedToVerification}
                  className="flex-1 py-3 bg-[#282828] hover:bg-[#282828] text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 disabled:hover:scale-100"
                >
                  {isProcessing ? 'Processing...' : 'Proceed to Verification'}
                </button>
              </div>
            </div>
          </>
        ) : step === 2 ? (
          <>
            {/* Step 2: Verification Form */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Identity Verification</h2>
                <p className="text-sm text-slate-600 mt-0.5">
                  Please provide your details for verification
                </p>
              </div>
              <button
                onClick={() => setStep(1)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={verificationData.fullName}
                      onChange={(e) => handleVerificationChange('fullName', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Aadhaar Number */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Aadhaar Number *
                    </label>
                    <input
                      type="text"
                      value={verificationData.aadhaarNumber}
                      onChange={(e) => handleVerificationChange('aadhaarNumber', e.target.value.replace(/\D/g, ''))}
                      maxLength={12}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="12-digit Aadhaar number"
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Address Information</h3>

                {/* Address Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Address Type *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="home"
                        checked={verificationData.addressType === 'home'}
                        onChange={(e) => handleVerificationChange('addressType', e.target.value)}
                        className="mr-2"
                      />
                      Home Address (Requires Address Proof)
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="public"
                        checked={verificationData.addressType === 'public'}
                        onChange={(e) => handleVerificationChange('addressType', e.target.value)}
                        className="mr-2"
                      />
                      Public Place (Aadhaar only)
                    </label>
                  </div>
                </div>

                {/* Full Address */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Complete Address *
                  </label>
                  <textarea
                    value={verificationData.address}
                    onChange={(e) => handleVerificationChange('address', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your complete address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={verificationData.city}
                      onChange={(e) => handleVerificationChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="City"
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      value={verificationData.state}
                      onChange={(e) => handleVerificationChange('state', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="State"
                    />
                  </div>

                  {/* Pincode */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      value={verificationData.pincode}
                      onChange={(e) => handleVerificationChange('pincode', e.target.value.replace(/\D/g, ''))}
                      maxLength={6}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="6-digit pincode"
                    />
                  </div>
                </div>
              </div>

              {/* Government ID Proof */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Government ID Proof</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* ID Type */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      ID Type *
                    </label>
                    <select
                      value={verificationData.governmentIdType}
                      onChange={(e) => handleVerificationChange('governmentIdType', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {governmentIdOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* ID Number */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      {governmentIdOptions.find(opt => opt.value === verificationData.governmentIdType)?.label} Number *
                    </label>
                    <input
                      type="text"
                      value={verificationData.governmentIdNumber}
                      onChange={(e) => handleVerificationChange('governmentIdNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Enter ${verificationData.governmentIdType.replace('_', ' ')} number`}
                    />
                  </div>
                </div>

                {/* ✅ ID Proof File Upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Upload ID Proof Document *
                  </label>
                  {!verificationData.idProofFile ? (
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-600 mb-2">
                        Upload your {governmentIdOptions.find(opt => opt.value === verificationData.governmentIdType)?.label}
                      </p>
                      <p className="text-xs text-slate-500 mb-3">
                        Supported formats: JPG, PNG, PDF (Max 5MB)
                      </p>
                      <label className="inline-block px-4 py-2 bg-[#282828] text-white rounded-lg cursor-pointer hover:bg-[#282828] transition-colors">
                        Choose File
                        <input
                          type="file"
                          className="hidden"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) => handleFileUpload('idProofFile', e.target.files[0])}
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <File className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {verificationData.idProofFile.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {(verificationData.idProofFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile('idProofFile')}
                          className="text-red-600 hover:text-red-700"
                          disabled={uploadingFiles}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* ✅ Address Proof File Upload */}
                {verificationData.addressType === 'home' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Upload Address Proof Document *
                    </label>
                    {!verificationData.addressProofFile ? (
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm text-slate-600 mb-2">
                          Upload your address proof (Utility bill, Rental agreement, etc.)
                        </p>
                        <p className="text-xs text-slate-500 mb-3">
                          Supported formats: JPG, PNG, PDF (Max 5MB)
                        </p>
                        <label className="inline-block px-4 py-2 bg-[#282828] text-white rounded-lg cursor-pointer hover:bg-[#282828] transition-colors">
                          Choose File
                          <input
                            type="file"
                            className="hidden"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={(e) => handleFileUpload('addressProofFile', e.target.files[0])}
                          />
                        </label>
                      </div>
                    ) : (
                      <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <File className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="text-sm font-medium text-slate-900">
                                {verificationData.addressProofFile.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                {(verificationData.addressProofFile.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFile('addressProofFile')}
                            className="text-red-600 hover:text-red-700"
                            disabled={uploadingFiles}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-3">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={verificationData.agreeToTerms}
                    onChange={(e) => handleVerificationChange('agreeToTerms', e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-sm text-slate-700">
                    I hereby declare that the information provided is true and correct to the best of my knowledge.
                    I understand that providing false information may lead to cancellation of my booking and legal action.
                  </span>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4">
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-semibold transition-colors"
                  disabled={uploadingFiles}
                >
                  Back
                </button>
                <button
                  onClick={handleBooking}
                  disabled={isProcessing || uploadingFiles}
                  className="flex-1 py-3 bg-[#282828] hover:bg-[#282828] text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 disabled:hover:scale-100"
                >
                  {isProcessing || uploadingFiles ? 'Processing...' : `Confirm Booking - ₹${provider.pricing[selectedMode].basePrice}`}
                </button>

              </div>
            </div>
          </>
        ) : (
          <>
            {/* Step 3: Confirmation Screen */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-slate-900">Booking Confirmed</h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <div className="p-6">
              <BookingConfirmation
                booking={confirmedBooking}
                onClose={handleClose}
                onViewBookings={handleViewBookings}
              />
            </div>
          </>
        )}
        {isBookingProcessing && (
          <Loading />
        )}

      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        } 
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};