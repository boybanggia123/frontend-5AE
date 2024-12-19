"use client";
import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import Swal from "sweetalert2"; // Import SweetAlert2

export default function SignInModal({ showModal, setShowModal }) {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Email không hợp lệ").required("Bắt buộc"),
      password: Yup.string().required("Bắt buộc"),
    }),
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_REACT}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Đăng nhập thất bại");
        }
        const data = await res.json();
        document.cookie = `token=${data.token}; path=/; max-age=${60 * 60}`;

        const token = data.token;
        const payload = JSON.parse(atob(token.split(".")[1]));

        // Hiển thị thông báo thành công
        Swal.fire({
          title: "Đăng nhập thành công!",
          text: "Chào mừng bạn quay lại!",
          icon: "success",
          confirmButtonText: "OK",
          willClose: () => {
            // Điều hướng sau khi đóng modal
            if (payload.role === "admin") {
              window.location.href = "http://localhost:3002";
            } else {
              window.location.href = "/";
            }
          },
        });
      } catch (error) {
        setFieldError("general", error.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Đảm bảo modal đóng khi không cần thiết
  useEffect(() => {
    if (showModal) {
      const modalElement = new window.bootstrap.Modal(
        document.getElementById("signInModal")
      );
      modalElement.show();
    } else {
      const modalElement = new window.bootstrap.Modal(
        document.getElementById("signInModal")
      );
      modalElement.hide();
    }
  }, [showModal]);

  return (
    <div>
      <div
        className="modal fade"
        id="signInModal"
        tabIndex="-1"
        aria-labelledby="signInModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <img className="login_img" src="/img/logo_fashion.png" alt="" />
            <div className="modal-header">
              <h5 className="modal-title" id="signInModalLabel">
                Đăng nhập
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setShowModal(false)} // Đóng modal
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={formik.handleSubmit}>
                {/* Các trường form nhập email và password */}
                <div className="mb-3">
                  <label className="form-label" htmlFor="email">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="text-danger">{formik.errors.email}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <div className="text-danger">{formik.errors.password}</div>
                  )}
                </div>

                {/* Thêm phần "Quên mật khẩu" ở đây */}
                <div
                  className="text-rigth"
                  data-bs-dismiss="modal"
                  onClick={() => setShowModal(false)}
                >
                  <Link href={"/auth/email"} className="text-muted small">
                    Quên mật khẩu?
                  </Link>
                </div>

                <div className="login_text text-center mt-4">
                  <button
                    type="submit"
                    className="btn btn-lg"
                    disabled={formik.isSubmitting}
                  >
                    Đăng nhập
                  </button>
                  {formik.errors.general && (
                    <div className="text-danger mt-2">
                      {formik.errors.general}
                    </div>
                  )}
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <p className="small fw-bold mb-0">
                Bạn chưa có tài khoản?{" "}
                <Link
                  href={""}
                  onClick={() => true} // Mở modal khi nhấn Đăng ký
                  className="link-danger"
                  data-bs-toggle="modal"
                  data-bs-target="#signUpModal"
                >
                  Đăng Ký
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
