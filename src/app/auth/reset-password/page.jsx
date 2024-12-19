"use client";
import { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PasswordResetForm from "../../components/PasswordResetForm";
import SignInModal from "@/app/components/SignInModal";

export default function ResetPasswordPage() {
  const [showModal, setShowModal] = useState(false); // Quản lý trạng thái modal
  const router = useRouter(); // Sử dụng useRouter
  const [email, setEmail] = useState(null);

  useEffect(() => {
    // Lấy email từ query params qua useRouter
    const emailParam = router.query.email;
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [router.query]); // Khi query thay đổi, useEffect sẽ được gọi lại

  const handlePasswordSubmit = async (newPassword) => {
    try {
      const response = await fetch(`${process.env.URL_REACT}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message); // Nếu thành công, hiển thị thông báo thành công
        setShowModal(true);
      } else {
        alert(data.message); // Nếu có lỗi, hiển thị thông báo lỗi
      }
    } catch (error) {
      console.error("Có lỗi xảy ra:", error);
      alert("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  return (
    <Suspense fallback={<p>Loading...</p>}>
      {email ? (
        <>
          <PasswordResetForm onSubmit={handlePasswordSubmit} />
          <SignInModal showModal={showModal} setShowModal={setShowModal} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </Suspense>
  );
}