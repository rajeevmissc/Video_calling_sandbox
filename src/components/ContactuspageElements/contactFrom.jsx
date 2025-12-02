import { useState } from "react";
import axios from "axios";
import { Mail, Phone, MapPin, HelpCircle } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { getCountries } from "libphonenumber-js";

// Header Component
function ContactHeader() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-10 sm:py-16 bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-2 sm:space-y-0">
        <HelpCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
          Contact & Support
        </h2>
      </div>

      <p className="text-gray-700 text-base sm:text-lg mt-3 sm:mt-4 max-w-md sm:max-w-2xl px-2">
        We're here to assist you. Whether it's inquiries, consultations, or
        support, don't hesitate to reach out.
      </p>
    </div>
  );
}

export default function ContactForm() {
  const [formData, setFormData] = useState({
    phone: "",
    message: "",
    country: "",
  });

  const [errors, setErrors] = useState({});

  // Phone Regex
  const phonePattern = /^[0-9]{10,15}$/;

  const validateForm = () => {
    let newErrors = {};

    if (!phonePattern.test(formData.phone)) {
      newErrors.phone = "Enter a valid phone number (10–15 digits)";
    }

    if (!formData.message || formData.message.length < 5) {
      newErrors.message = "Message must be at least 5 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle text change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Phone Input with Country Detection
  const handlePhoneChange = (value, countryData) => {
    const countryCode = countryData?.countryCode?.toUpperCase();
    const countryName = countryCode
      ? getCountries().includes(countryCode)
        ? new Intl.DisplayNames(["en"], { type: "region" }).of(countryCode)
        : ""
      : "";

    setFormData({ ...formData, phone: value, country: countryName });
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await axios.post(
        "https://issc-backend-app.vercel.app/contact/form",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      alert(response.data.message);

      setFormData({
        phone: "",
        message: "",
        country: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form");
      setErrors({});
    }
  };

  return (
    <div>
      <ContactHeader />

      <div className="flex flex-col lg:flex-row p-6 lg:p-12 rounded-lg max-w-5xl mx-auto">
        {/* Contact Form */}
        <div className="bg-[#F4F8FB] p-6 lg:p-8 rounded-lg shadow-md w-full lg:w-1/2">
          <h2 className="text-xl font-semibold mb-4">Get in Touch with Us</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Phone Number */}
            <div className="w-full">
              <label className="block text-sm font-medium">
                Phone Number *
              </label>

              <PhoneInput
                country={"in"}
                value={formData.phone}
                onChange={handlePhoneChange}
                inputClass={`w-full p-2 border ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring focus:ring-blue-200`}
                inputStyle={{
                  width: "100%",
                  height: "40px",
                  borderRadius: "8px",
                  border: errors.phone ? "1px solid red" : "1px solid #ccc",
                }}
              />

              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>

            {/* Message / Query */}
            <div>
              <label className="block text-sm font-medium">Your Query *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your query here..."
                className={`mt-1 w-full p-2 border ${
                  errors.message ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring focus:ring-blue-200`}
                rows="4"
              ></textarea>

              {errors.message && (
                <p className="text-red-500 text-sm">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-red-500 text-white p-2 rounded-lg font-semibold hover:bg-red-600 transition-all"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Details */}
        <div className="lg:w-1/2 mt-6 lg:mt-0 lg:pl-8 space-y-6 text-gray-700 ml-12">
          {/* Phone */}
          <div className="flex items-start space-x-4">
            <Phone className="text-red-500 w-6 h-6" />
            <div>
              <h3 className="font-semibold text-lg">Call Us</h3>
              <p className="text-sm">Available 7 Days · 10:00 AM – 8:00 PM</p>

              <a
                href="tel:+917827105511"
                className="text-blue-500 underline block text-sm"
              >
                (+91) 7827105511
              </a>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start space-x-4">
            <Mail className="text-red-500 w-6 h-6" />
            <div>
              <h3 className="font-semibold text-lg">Email Support</h3>
              <p className="text-sm">We reply within 24 hours.</p>

              <a
                href="mailto:getcompanion@outlook.com"
                className="text-blue-500 underline text-sm"
              >
                getcompanion@outlook.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
