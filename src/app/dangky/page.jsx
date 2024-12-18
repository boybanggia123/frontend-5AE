"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // Dùng usePathname trong App Router
import SignUpModal from "../components/SignUpModal"; // Điều chỉnh đường dẫn nếu cần

export default function DangKyPage() {
  const [showModal, setShowModal] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    if (pathname === "/dangky") {
      setShowModal(true);
    }
  }, [pathname]);

  return (
    <div>
      <SignUpModal showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
}
