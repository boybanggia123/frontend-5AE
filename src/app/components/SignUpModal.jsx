// import React from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import Link from "next/link";

// export default function SignUpModal() {
//   const formik = useFormik({
//     initialValues: {
//       fullname: "",
//       phone: "",
//       email: "",
//       password: "",
//       rePassword: "",
//     },
//     validationSchema: Yup.object({
//       fullname: Yup.string()
//         .max(30, "Họ và tên không quá 30 kí tự")
//         .required("Vui lòng nhập họ tên"),
//       phone: Yup.string()
//         .matches(/^[0-9]{10}$/, "Phone phải là 10 chữ số")
//         .required("Vui lòng nhập số điện thoại"),
//       email: Yup.string()
//         .email("Email không hợp lệ")
//         .required("Vui lòng nhập email"),
//       password: Yup.string()
//         .matches(
//           /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
//           "Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ và số"
//         )
//         .required("Vui lòng nhập mật khẩu"),
//       rePassword: Yup.string()
//         .oneOf([Yup.ref("password"), null], "Mật khẩu không khớp")
//         .required("Vui lòng nhập lại mật khẩu"),
//     }),
//     onSubmit: async (values, { setSubmitting, setFieldError }) => {
//       try {
//         const res = await fetch("http://localhost:3000/register", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             fullname: values.fullname,
//             phone: values.phone,
//             email: values.email,
//             password: values.password,
//           }),
//         });

//         if (!res.ok) {
//           const errorData = await res.json();
//           if (res.status === 400 && errorData.message === "Email đã tồn tại") {
//             setFieldError("email", "Email đã tồn tại");
//           } else {
//             throw new Error(errorData.message || "Đăng ký thất bại");
//           }
//         }

//         // Đăng ký thành công, đóng modal và quay lại trang đăng nhập
//         alert("Đăng ký thành công");

//         // Đóng modal
//         const modalElement = document.getElementById("signUpModal");
//         if (modalElement) {
//           modalElement.classList.remove("show");
//           const backdropElement = document.querySelector(".modal-backdrop");
//           if (backdropElement) {
//             backdropElement.remove();
//           }
//         }
//         // window.location.href = "/dangnhap"; // Hoặc sử dụng React Router để điều hướng
//       } catch (error) {
//         setFieldError("general", error.message);
//       } finally {
//         setSubmitting(false);
//       }
//     },
//   });

//   return (
//     <div>
//       <div
//         className="modal fade"
//         id="signUpModal"
//         tabIndex="-1"
//         aria-labelledby="signUpModalLabel"
//         aria-hidden="true"
//       >
//         <div className="modal-dialog">
//           <div className="modal-content">
//             <img className="login_img" src="/img/logo_fashion.png" alt="" />
//             <div className="modal-header">
//               <h5 className="modal-title" id="signUpModalLabel">
//                 Đăng ký
//               </h5>
//               <button
//                 type="button"
//                 className="btn-close"
//                 data-bs-dismiss="modal"
//                 aria-label="Close"
//               ></button>
//             </div>
//             <div className="modal-body">
//               <form onSubmit={formik.handleSubmit}>
//                 <div className="mb-3">
//                   <label className="form-label" htmlFor="fullname">
//                     Họ và tên
//                   </label>
//                   <input
//                     type="text"
//                     id="fullname"
//                     name="fullname"
//                     className="form-control"
//                     placeholder="Nhập họ và tên"
//                     value={formik.values.fullname}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                   />
//                   {formik.touched.fullname && formik.errors.fullname && (
//                     <div className="text-danger">{formik.errors.fullname}</div>
//                   )}
//                 </div>

//                 <div className="row mb-3">
//                   <div className="col-12 col-md-6">
//                     <label className="form-label" htmlFor="phone">
//                       Số điện thoại
//                     </label>
//                     <input
//                       type="text"
//                       id="phone"
//                       name="phone"
//                       className="form-control"
//                       placeholder="Nhập số điện thoại"
//                       value={formik.values.phone}
//                       onChange={formik.handleChange}
//                       onBlur={formik.handleBlur}
//                     />
//                     {formik.touched.phone && formik.errors.phone && (
//                       <div className="text-danger">{formik.errors.phone}</div>
//                     )}
//                   </div>

//                   <div className="col-12 col-md-6">
//                     <label className="form-label" htmlFor="email">
//                       Email
//                     </label>
//                     <input
//                       type="email"
//                       id="email"
//                       name="email"
//                       className="form-control"
//                       placeholder="Nhập email"
//                       value={formik.values.email}
//                       onChange={formik.handleChange}
//                       onBlur={formik.handleBlur}
//                     />
//                     {formik.touched.email && formik.errors.email && (
//                       <div className="text-danger">{formik.errors.email}</div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="mb-3">
//                   <label className="form-label" htmlFor="password">
//                     Mật khẩu
//                   </label>
//                   <input
//                     type="password"
//                     id="password"
//                     name="password"
//                     className="form-control"
//                     placeholder="Nhập mật khẩu"
//                     value={formik.values.password}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                   />
//                   {formik.touched.password && formik.errors.password && (
//                     <div className="text-danger">{formik.errors.password}</div>
//                   )}
//                 </div>

//                 <div className="mb-3">
//                   <label className="form-label" htmlFor="rePassword">
//                     Xác nhận mật khẩu
//                   </label>
//                   <input
//                     type="password"
//                     id="rePassword"
//                     name="rePassword"
//                     className="form-control"
//                     placeholder="Nhập lại mật khẩu"
//                     value={formik.values.rePassword}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                   />
//                   {formik.touched.rePassword && formik.errors.rePassword && (
//                     <div className="text-danger">
//                       {formik.errors.rePassword}
//                     </div>
//                   )}
//                 </div>

//                 <div className="signup_text text-center mt-4">
//                   <button
//                     type="submit"
//                     className="btn"
//                     disabled={formik.isSubmitting}
//                   >
//                     Đăng ký
//                   </button>
//                   {formik.errors.general && (
//                     <div className="text-danger mt-2">
//                       {formik.errors.general}
//                     </div>
//                   )}
//                 </div>
//               </form>
//             </div>
//             <div className="modal-footer">
//               <p className="small fw-bold mb-0">
//                 Bạn đã có tài khoản?{" "}
//                 <Link
//                   href={""}
//                   onClick={() => true} // Mở modal khi nhấn Đăng nhập
//                   className="link-primary"
//                   data-bs-toggle="modal"
//                   data-bs-target="#signInModal"
//                 >
//                   Đăng nhập
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import Swal from "sweetalert2"; // Import SweetAlert2

export default function SignUpModal() {
  const formik = useFormik({
    initialValues: {
      fullname: "",
      phone: "",
      email: "",
      password: "",
      rePassword: "",
    },
    validationSchema: Yup.object({
      fullname: Yup.string()
        .max(30, "Họ và tên không quá 30 kí tự")
        .required("Vui lòng nhập họ tên"),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone phải là 10 chữ số")
        .required("Vui lòng nhập số điện thoại"),
      email: Yup.string()
        .email("Email không hợp lệ")
        .required("Vui lòng nhập email"),
      password: Yup.string()
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
          "Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ và số"
        )
        .required("Vui lòng nhập mật khẩu"),
      rePassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Mật khẩu không khớp")
        .required("Vui lòng nhập lại mật khẩu"),
    }),
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const res = await fetch("http://localhost:3000/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullname: values.fullname,
            phone: values.phone,
            email: values.email,
            password: values.password,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          if (res.status === 400 && errorData.message === "Email đã tồn tại") {
            setFieldError("email", "Email đã tồn tại");
          } else {
            throw new Error(errorData.message || "Đăng ký thất bại");
          }
        }

        // Hiển thị thông báo đăng ký thành công bằng SweetAlert2
        Swal.fire({
          title: "Đăng ký thành công!",
          text: "Bây giờ bạn có thể đăng nhập",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          // Đóng modal đăng ký đúng cách
          const signUpModalElement = document.getElementById("signUpModal");
          const signUpModal = bootstrap.Modal.getInstance(signUpModalElement);
          if (signUpModal) {
            signUpModal.hide();
          }

          // Mở modal đăng nhập
          const signInModalElement = document.getElementById("signInModal");
          const signInModal = new bootstrap.Modal(signInModalElement, {
            backdrop: "static",
            keyboard: false,
          });
          signInModal.show();
        });
      } catch (error) {
        setFieldError("general", error.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div>
      <div
        className="modal fade"
        id="signUpModal"
        tabIndex="-1"
        aria-labelledby="signUpModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <img className="login_img" src="/img/logo_fashion.png" alt="" />
            <div className="modal-header">
              <h5 className="modal-title" id="signUpModalLabel">
                Đăng ký
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={formik.handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="fullname">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    className="form-control"
                    placeholder="Nhập họ và tên"
                    value={formik.values.fullname}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.fullname && formik.errors.fullname && (
                    <div className="text-danger">{formik.errors.fullname}</div>
                  )}
                </div>

                <div className="row mb-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="phone">
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      className="form-control"
                      placeholder="Nhập số điện thoại"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.phone && formik.errors.phone && (
                      <div className="text-danger">{formik.errors.phone}</div>
                    )}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label" htmlFor="email">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      placeholder="Nhập email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className="text-danger">{formik.errors.email}</div>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="password">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control"
                    placeholder="Nhập mật khẩu"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <div className="text-danger">{formik.errors.password}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="rePassword">
                    Xác nhận mật khẩu
                  </label>
                  <input
                    type="password"
                    id="rePassword"
                    name="rePassword"
                    className="form-control"
                    placeholder="Nhập lại mật khẩu"
                    value={formik.values.rePassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.rePassword && formik.errors.rePassword && (
                    <div className="text-danger">
                      {formik.errors.rePassword}
                    </div>
                  )}
                </div>

                <div className="signup_text text-center mt-4">
                  <button
                    type="submit"
                    className="btn"
                    disabled={formik.isSubmitting}
                  >
                    Đăng ký
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
                Nếu bạn đã có tài khoản thì hãy{" "}
                <Link
                  href={""}
                  onClick={() => true} // Mở modal khi nhấn Đăng ký
                  className="text-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#signInModal"
                >
                  Đăng Nhập
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
