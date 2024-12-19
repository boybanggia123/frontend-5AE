// OtpPage.js
"use client";
import { Suspense, useState, useEffect } from "react";
import {  useRouter } from "next/navigation";
import OtpVerificationForm from "../../components/OtpVerificationForm";

export default function OtpPage() {
  const router = useRouter(); // Sử dụng useRouter để lấy thông tin từ query params
  const [email, setEmail] = useState(null);

  useEffect(() => {
    // Lấy email từ query params qua useRouter
    const emailParam = router.query.email;
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [router.query]); // Khi query thay đổi, useEffect sẽ được gọi lại

  const handleOtpSubmit = async (otp) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_REACT}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`); // Chuyển hướng sau khi OTP hợp lệ
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Có lỗi xảy ra:", error);
      alert("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  return (
    <Suspense fallback={<p>Loading...</p>}>
      {email ? (
        <OtpVerificationForm onSubmit={handleOtpSubmit} />
      ) : (
        <p>Loading...</p>
      )}
    </Suspense>
  );
}
