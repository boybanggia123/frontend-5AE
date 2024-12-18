"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
// import "../../../../public/bootstrap/css/bootstrap.css";
import "../../../../public/css/style-info.css";

export default function Info({
  
  children,
}) {
  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/"; // Redirect after logout
  };
  return (
    <div className="container mt-5 my-5">
      <div className="row">
        <div className="col-3">
          <Link
            href="/"
            id="back-home"
            className="d-flex gap-1 text-dark text-decoration-none mb-4"
          >
            <i className="bi bi-arrow-left"></i>
            <span>Quay lại trang chủ</span>
          </Link>
          <ul id="list-nav-info" className="nav flex-column gap-4">
            <li className="fw-bold d-flex gap-1">
              <i className="bi bi-pencil-square"></i>
              <span>Thông tin của tôi</span>
            </li>
            <li className="fw-bold d-flex gap-1">
              <i className="bi bi-receipt-cutoff"></i>
              <Link
                href="info/userbill"
                className="text-dark text-decoration-none"
              >
                <span>Đơn hàng của tôi</span>
              </Link>
            </li>
            <li className="fw-bold d-flex gap-1">
              <i className="bi bi-bell-fill"></i>
              <span>Thông báo</span>
            </li>
            <li className="fw-bold d-flex gap-1">
              <i className="bi bi-telephone-fill"></i>
              <span>Trung tâm trợ giúp</span>
            </li>
          </ul>
          <div id="log-out" className="mt-3">
            <button
              onClick={handleLogout}
              className="d-flex gap-2 btn btn-link text-decoration-none text-danger fw-bold"
            >
              <i className="bi bi-box-arrow-right"></i>
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
