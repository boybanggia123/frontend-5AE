"use client";
import React, { useState } from "react";
import "../../../public/css/otp.css";

const OtpVerificationForm = ({ onSubmit, onBack }) => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Chuyển focus sang ô tiếp theo nếu người dùng nhập số
      if (value && index < 5) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Xóa ký tự và quay lại ô trước đó
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra OTP
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Vui lòng nhập đủ 6 chữ số.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSubmit(otpValue); // Gọi hàm xác minh OTP
    } catch (err) {
      setError("Xác minh OTP không thành công, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container mt-5 my-5 text-center">
      <div className="mb-3">
        <img
          src="/img/logo_fashion.png" // Thay bằng icon tương tự
          alt="Verify Icon"
          className="mb-3"
          style={{ width: "auto", height: "45px" }}
        />
        <h6>Nhập mã OTP</h6>
      </div>
      {error && <div className="text-danger mb-2">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="d-flex justify-content-center mb-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              className="form-control text-center mb-3 mx-1"
              style={{
                width: "45px",
                height: "45px",
                fontSize: "1.2rem",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
              value={digit}
              maxLength={1}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>
        <button
          type="submit"
          className="otp_button btn-primary mb-3"
          disabled={loading}
        >
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default OtpVerificationForm;
