"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // Dùng usePathname trong App Router
import SignInModal from "../components/SignInModal";

export default function DangNhapPage() {
  const [showModal, setShowModal] = useState(false);
  const pathname = usePathname(); // Dùng usePathname để lấy đường dẫn

  useEffect(() => {
    if (pathname === "/dangnhap") {
      setShowModal(true);
    }
  }, [pathname]);

  return (
    <div>
      <SignInModal showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
}
