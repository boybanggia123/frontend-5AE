"use client";

import React, { useState } from "react";
import "../../../public/css/password.css";

const PasswordResetForm = ({ onSubmit }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Thêm state cho xác nhận mật khẩu
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra mật khẩu mới và mật khẩu xác nhận có giống nhau không
    if (newPassword !== confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp với mật khẩu mới.");
      return;
    }

    setErrorMessage(""); // Nếu mật khẩu khớp, xóa thông báo lỗi
    onSubmit(newPassword); // Gửi mật khẩu mới
  };

  return (
    <div className="auth-container mt-5 my-5 text-center">
      <div className="mb-3">
        <img
          src="/img/logo_fashion.png" // Thay bằng logo của bạn
          alt="Logo"
          className="mb-3"
          style={{ width: "auto", height: "45px" }}
        />
        <h6>Reset password</h6>
      </div>
      {errorMessage && <div className="text-danger mb-2">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Nhập mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{
              width: "100%",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Nhập lại mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{
              width: "100%",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <button type="submit" className="otp_button btn-warning mb-3">
          Submit
        </button>
      </form>
    </div>
  );
};

export default PasswordResetForm;
