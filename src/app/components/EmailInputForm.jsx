"use client";
import React, { useState } from "react";
import "../../../public/css/email.css";

const EmailInputForm = ({ onSubmit }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email);
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-4">
          <div className="auth-container mt-5 my-5 rounded-0">
            <div className="mb-3 text-center">
              <img
                src="/img/logo_fashion.png" // Thay bằng icon tương tự
                alt="Verify Icon"
                className="mb-3"
                style={{ width: "auto", height: "45px" }}
              />
              <h6>Nhập Email</h6>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="email"
                  className="form-control rounded-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email để gửi mã OTP"
                  required
                />
              </div>
              <button
                type="submit"
                className="email_button rounded-1 btn-primary w-100"
              >
                Gửi OTP
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailInputForm;
