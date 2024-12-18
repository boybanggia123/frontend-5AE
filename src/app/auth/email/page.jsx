"use client"
import EmailInputForm from "../../components/EmailInputForm";
import { useRouter } from "next/navigation";

export default function EmailPage() {
  const router = useRouter();

  const handleEmailSubmit = async (email) => {
    try {
      const response = await fetch("http://localhost:3000/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert(data.message); // Hiển thị thông báo thành công
        router.push(`/auth/otp?email=${encodeURIComponent(email)}`); // Điều hướng đến trang OTP
      } else {
        alert(data.message); // Hiển thị thông báo lỗi
      }
    } catch (error) {
      console.error("Có lỗi xảy ra:", error);
      alert("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };
  

  return <EmailInputForm onSubmit={handleEmailSubmit} />;
}
