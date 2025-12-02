import { useRef } from 'react';
import { CheckCircle, Calendar, Clock, Video, Phone, Home, User, X, Download, Printer } from 'lucide-react';
import { formatDisplayDate, formatTime } from '../utils/dateHelpers';
import { SESSION_MODES } from '../constants/bookingConstants';
import { useNavigate } from 'react-router-dom';

export const BookingConfirmation = ({ booking, onClose, onViewBookings }) => {
  console.log('Booking data:', booking);

  const printRef = useRef();
  const navigate = useNavigate();

  const getModeIcon = (mode) => {
    switch (mode) {
      case SESSION_MODES.VIDEO:
        return <Video className="w-4 h-4" />;
      case SESSION_MODES.CALL:
        return <Phone className="w-4 h-4" />;
      case SESSION_MODES.VISIT:
        return <Home className="w-4 h-4" />;
      default:
        return <Video className="w-4 h-4" />;
    }
  };

  const getModeLabel = (mode) => {
    switch (mode) {
      case SESSION_MODES.VIDEO:
        return 'Video Call';
      case SESSION_MODES.CALL:
        return 'Phone Call';
      case SESSION_MODES.VISIT:
        return 'In-Person Visit';
      default:
        return 'Video Call';
    }
  };

  const handleViewBookings = () => {
    navigate('/appointment');
  };

  const handleExploreServices = () => {
    navigate('/services');
  };

  // Enhanced Print functionality
  const handlePrint = () => {
    const printContent = printRef.current;

    if (!printContent) {
      console.error('No content found to print');
      return;
    }

    const printWindow = window.open('', '_blank', 'width=800,height=600');

    const bookingData = booking?.booking || booking;
    const verificationData = booking?.verification || {};

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Booking Confirmation - ${bookingData?.bookingId || bookingData?._id || 'N/A'}</title>
          <meta charset="UTF-8">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.5;
              color: #334155;
              background: #ffffff;
              padding: 24px;
              font-size: 14px;
            }
            
            .print-container {
              max-width: 700px;
              margin: 0 auto;
              background: white;
            }
            
            /* Header Styles */
            .print-header {
              text-align: center;
              margin-bottom: 32px;
              padding-bottom: 24px;
              border-bottom: 2px solid #e2e8f0;
            }
            
            .success-icon {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 64px;
              height: 64px;
              background: #dcfce7;
              border-radius: 50%;
              margin-bottom: 16px;
            }
            
            .success-icon svg {
              width: 32px;
              height: 32px;
              color: #16a34a;
            }
            
            .print-title {
              font-size: 28px;
              font-weight: 700;
              color: #0f172a;
              margin-bottom: 8px;
            }
            
            .print-subtitle {
              font-size: 16px;
              color: #64748b;
              font-weight: 400;
            }
            
            /* Card Styles */
            .print-card {
              background: #f8fafc;
              border-radius: 16px;
              padding: 24px;
              margin-bottom: 20px;
              border: 1px solid #e2e8f0;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }
            
            .card-title {
              font-size: 18px;
              font-weight: 600;
              color: #0f172a;
              margin-bottom: 20px;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            
            .card-title svg {
              width: 18px;
              height: 18px;
              color: #2563eb;
            }
            
            /* Grid Layouts */
            .print-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 20px;
              margin-bottom: 20px;
            }
            
            .detail-row {
              display: flex;
              align-items: center;
              gap: 12px;
              padding: 12px 0;
              border-bottom: 1px solid #e2e8f0;
            }
            
            .detail-row:last-child {
              border-bottom: none;
            }
            
            .detail-icon {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 40px;
              height: 40px;
              background: #2563eb;
              border-radius: 8px;
              flex-shrink: 0;
            }
            
            .detail-icon svg {
              width: 18px;
              height: 18px;
              color: white;
            }
            
            .detail-content {
              flex: 1;
            }
            
            .detail-label {
              font-size: 12px;
              color: #64748b;
              text-transform: uppercase;
              font-weight: 500;
              letter-spacing: 0.5px;
              margin-bottom: 4px;
            }
            
            .detail-value {
              font-size: 15px;
              font-weight: 600;
              color: #0f172a;
            }
            
            /* Amount Section */
            .amount-section {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding-top: 16px;
              border-top: 1px solid #e2e8f0;
              margin-top: 16px;
            }
            
            .amount-label {
              font-size: 16px;
              color: #64748b;
              font-weight: 500;
            }
            
            .amount-value {
              font-size: 28px;
              font-weight: 700;
              color: #2563eb;
            }
            
            /* Booking ID Section */
            .booking-id-section {
              background: #f8fafc;
              border-radius: 12px;
              padding: 20px;
              text-align: center;
              border: 1px solid #e2e8f0;
              margin: 24px 0;
            }
            
            .booking-id-label {
              font-size: 12px;
              color: #64748b;
              text-transform: uppercase;
              font-weight: 500;
              letter-spacing: 0.5px;
              margin-bottom: 8px;
            }
            
            .booking-id-value {
              font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
              font-size: 16px;
              font-weight: 600;
              color: #0f172a;
              letter-spacing: 0.5px;
              margin-bottom: 8px;
              word-break: break-all;
            }
            
            .booking-date {
              font-size: 12px;
              color: #94a3b8;
            }
            
            /* Verification Section */
            .verification-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 16px;
            }
            
            .verification-item {
              margin-bottom: 12px;
            }
            
            .verification-label {
              font-size: 12px;
              color: #64748b;
              text-transform: uppercase;
              font-weight: 500;
              letter-spacing: 0.5px;
              margin-bottom: 4px;
            }
            
            .verification-value {
              font-size: 14px;
              font-weight: 600;
              color: #0f172a;
              word-break: break-word;
            }
            
            /* Status Badge */
            .status-badge {
              display: inline-block;
              padding: 4px 12px;
              background: #dcfce7;
              color: #166534;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 500;
              text-transform: capitalize;
            }
            
            /* Mode Badge */
            .mode-badge {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              padding: 6px 12px;
              background: #dbeafe;
              color: #1e40af;
              border-radius: 8px;
              font-size: 12px;
              font-weight: 500;
            }
            
            .mode-badge svg {
              width: 14px;
              height: 14px;
            }
            
            /* Print-specific styles */
            @media print {
              body {
                padding: 0;
                margin: 0;
              }
              
              .print-container {
                max-width: 100%;
                box-shadow: none;
              }
              
              .no-print {
                display: none !important;
              }
              
              .print-card {
                box-shadow: none;
                border: 1px solid #cbd5e1;
                page-break-inside: avoid;
              }
              
              .amount-value {
                color: #2563eb !important;
              }
            }
            
            /* Utility Classes */
            .text-center { text-align: center; }
            .mb-4 { margin-bottom: 16px; }
            .mt-4 { margin-top: 16px; }
            .flex { display: flex; }
            .items-center { align-items: center; }
            .justify-between { justify-content: space-between; }
            .gap-3 { gap: 12px; }
            .capitalize { text-transform: capitalize; }
          </style>
        </head>
        <body>
          <div class="print-container">
            <!-- Header -->
            <div class="print-header">
              <div class="success-icon">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
              </div>
              <h1 class="print-title">Booking Confirmed</h1>
              <p class="print-subtitle">Your appointment has been scheduled successfully</p>
            </div>
            
            <!-- Main Booking Details -->
            <div class="print-card">
              <h2 class="card-title">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                </svg>
                Appointment Details
              </h2>
              
              <!-- Provider -->
              <div class="detail-row">
                <div class="detail-icon">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <div class="detail-content">
                  <div class="detail-label">Provider</div>
                  <div class="detail-value">${bookingData?.providerName || 'Provider Name'}</div>
                </div>
              </div>
              
              <!-- Date & Time -->
              <div class="print-grid">
                <div class="detail-row" style="border-bottom: none; padding: 0;">
                  <div class="detail-icon">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div class="detail-content">
                    <div class="detail-label">Date</div>
                    <div class="detail-value">${bookingData?.date ? formatDisplayDate(bookingData.date) : 'Not specified'}</div>
                  </div>
                </div>
                
                <div class="detail-row" style="border-bottom: none; padding: 0;">
                  <div class="detail-icon">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div class="detail-content">
                    <div class="detail-label">Time</div>
                    <div class="detail-value">${bookingData?.timeSlot ? formatTime(bookingData.timeSlot) : 'Not specified'}</div>
                  </div>
                </div>
              </div>
              
              <!-- Duration, Status, Mode -->
              <div class="print-grid">
                <div>
                  <div class="detail-label">Duration</div>
                  <div class="detail-value">${bookingData?.duration || 0} minutes</div>
                </div>
                <div>
                  <div class="detail-label">Status</div>
                  <div class="status-badge">${bookingData?.status?.replace(/_/g, ' ') || 'confirmed'}</div>
                </div>
                <div>
                  <div class="detail-label">Mode</div>
                  <div class="mode-badge">
                    ${getModeLabel(bookingData?.mode)}
                  </div>
                </div>
              </div>
              
              <!-- Amount -->
              <div class="amount-section">
                <div class="amount-label">Total Amount Paid</div>
                <div class="amount-value">₹${bookingData?.price || 0}</div>
              </div>
            </div>
            
            <!-- Verification Details -->
            ${verificationData && Object.keys(verificationData).length > 0 ? `
            <div class="print-card">
              <h2 class="card-title">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                Verification Details
              </h2>
              
              <div class="verification-grid">
                <div class="verification-item">
                  <div class="verification-label">Full Name</div>
                  <div class="verification-value">${verificationData.fullName || 'Not provided'}</div>
                </div>
                
                ${verificationData.aadhaarNumber ? `
                <div class="verification-item">
                  <div class="verification-label">Aadhaar Number</div>
                  <div class="verification-value">${verificationData.aadhaarNumber}</div>
                </div>
                ` : ''}
                
                <div class="verification-item">
                  <div class="verification-label">Address Type</div>
                  <div class="verification-value capitalize">${verificationData.addressType || 'Not specified'}</div>
                </div>
                
                <div class="verification-item">
                  <div class="verification-label">City</div>
                  <div class="verification-value">${verificationData.city || 'Not provided'}</div>
                </div>
                
                <div class="verification-item" style="grid-column: 1 / -1;">
                  <div class="verification-label">Complete Address</div>
                  <div class="verification-value">${verificationData.address || 'Not provided'}</div>
                </div>
              </div>
            </div>
            ` : ''}
            
            <!-- Booking ID -->
            <div class="booking-id-section">
              <div class="booking-id-label">Booking Reference ID</div>
              <div class="booking-id-value">${bookingData?.bookingId || bookingData?._id || 'N/A'}</div>
              <div class="booking-date">
                Created on: ${bookingData?.createdAt ? new Date(bookingData.createdAt).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) : 'N/A'}
              </div>
            </div>
            
            <!-- Footer Note -->
            <div class="text-center mt-4" style="color: #94a3b8; font-size: 12px;">
              <p>Thank you for choosing our service. Please keep this confirmation for your records.</p>
              <p>For any queries, contact our support team.</p>
            </div>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => {
                window.close();
              }, 1000);
            }
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  // Download as PDF (using print functionality for now)
  const handleDownloadPDF = () => {
    handlePrint();
  };

  const bookingData = booking?.booking || booking;
  const verificationData = booking?.verification || {};
  // Safely access verification data
  const fullName = verificationData?.fullName || 'Not provided';
  const address = verificationData?.address || 'Not provided';
  const city = verificationData?.city || 'Not provided';
  const aadhaarNumber = verificationData?.aadhaarNumber;
  const addressType = verificationData?.addressType;

  return (
    <div className="fixed inset-0 bg-white flex items-start justify-center z-50 overflow-y-auto py-6 px-4">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="no-print absolute top-4 right-4 md:top-6 md:right-6 w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors z-10"
      >
        <X className="w-5 h-5 text-slate-600" />
      </button>

      {/* Content Container */}
      <div className="w-full max-w-lg mx-auto mt-4">

        {/* Success Icon */}
        <div className="text-center mb-4 md:mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-green-50 rounded-full mb-2 md:mb-3 animate-scale-in">
            <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">
            Booking Confirmed
          </h1>
          <p className="text-slate-600 text-xs md:text-sm">
            Your appointment has been scheduled successfully
          </p>
        </div>

        {/* Print/Download Buttons */}
        <div className="no-print flex justify-center gap-3 mb-4">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors text-sm"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>

        {/* Printable Content Reference */}
        <div ref={printRef} style={{ display: 'none' }}></div>

        {/* Main Content (Visible in App) */}
        <div className="bg-slate-50 rounded-xl p-4 md:p-5 mb-4">
          {/* Provider */}
          <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-[#282828] rounded-lg flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500 mb-0.5">Provider</p>
              <p className="font-semibold text-slate-900 text-sm md:text-base truncate">
                {bookingData?.providerName || 'Provider Name'}
              </p>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3 py-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 mb-0.5">Date</p>
                <p className="text-xs font-semibold text-slate-900">
                  {bookingData?.date ? formatDisplayDate(bookingData.date) : 'Not specified'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 mb-0.5">Time</p>
                <p className="text-xs font-semibold text-slate-900">
                  {bookingData?.timeSlot ? formatTime(bookingData.timeSlot) : 'Not specified'}
                </p>
              </div>
            </div>
          </div>

          {/* Duration & Status & Mode */}
          <div className="grid grid-cols-3 gap-3 py-3 border-b border-slate-200">
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Duration</p>
              <p className="text-xs font-semibold text-slate-900">
                {bookingData?.duration || 0}m
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Status</p>
              <p className="text-xs font-semibold text-slate-900 capitalize">
                {bookingData?.status?.replace(/_/g, ' ') || 'Confirmed'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Mode</p>
              <div className="flex items-center gap-1">
                <span className="text-blue-600">
                  {getModeIcon(bookingData?.mode)}
                </span>
                <span className="text-xs font-semibold text-slate-900">
                  {getModeLabel(bookingData?.mode)}
                </span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-3">
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Amount Paid</p>
            </div>
            <div className="text-right">
              <p className="text-lg md:text-xl font-bold text-blue-600">₹{bookingData?.price || 0}</p>
            </div>
          </div>


          {/* Verification Details Card */}
          {verificationData && Object.keys(verificationData).length > 0 && (
            <div className="bg-slate-50 rounded-xl p-4 md:p-5 mb-4">
              <h3 className="font-semibold text-slate-900 mb-3 text-sm md:text-base">Verification Details</h3>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Full Name</p>
                    <p className="text-xs font-semibold text-slate-900">{fullName}</p>
                  </div>

                  {aadhaarNumber && (
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Aadhaar Number</p>
                      <p className="text-xs font-semibold text-slate-900">
                        {aadhaarNumber}
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Address Type</p>
                    <p className="text-xs font-semibold text-slate-900 capitalize">
                      {addressType || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">City</p>
                    <p className="text-xs font-semibold text-slate-900">{city}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Address</p>
                  <p className="text-xs font-semibold text-slate-900 break-words">{address}</p>
                </div>
              </div>
            </div>
          )}

          {/* Booking ID */}
          <div className="bg-slate-50 rounded-lg p-3 mb-4 text-center">
            <p className="text-xs text-slate-500 mb-1">Booking ID</p>
            <p className="font-mono text-xs font-semibold text-slate-900 break-all">
              {bookingData?.bookingId || bookingData?._id || 'N/A'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Created: {bookingData?.createdAt ? new Date(bookingData?.createdAt).toLocaleString() : 'N/A'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="no-print flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors text-sm"
          >
            Close
          </button>
          <button
            onClick={handleViewBookings}
            className="flex-1 py-3 bg-[#282828] hover:bg-[#282828] text-white rounded-xl font-medium transition-colors text-sm"
          >
            View Bookings
          </button>
        </div>

        {/* Additional Action */}
        <div className="no-print mt-3">
          <button
            onClick={handleExploreServices}
            className="w-full py-3 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 font-medium transition-colors text-sm"
          >
            Book Another Service
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .animate-scale-in {
          animation: scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
};