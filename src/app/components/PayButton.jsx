

"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";

// Giải mã token JWT
const decodeToken = (token) => {
  if (!token) return null;
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`) // Chuyển đổi base64 thành chuỗi
      .join("")
  );
  return JSON.parse(jsonPayload);
};

// Component chính
export default function PayButton({ total }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const totalAmount = useSelector((state) => state.cart.totalAmount); // Lấy totalAmount từ Redux
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponStatus, setCouponStatus] = useState(null);

  // Khi trang tải, lấy thông tin người dùng từ cookie
  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      const decoded = decodeToken(token);
      setUserId(decoded?.userId); // Lưu userId vào state
    }
  }, []);

  // Khi có userId, tải giỏ hàng
  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:3000/cart/${userId}`)
        .then((res) => {
          // Lấy giỏ hàng và dispatch để cập nhật Redux
          dispatch(updateTotalAmount());
        })
        .catch((err) => console.error("Error fetching cart:", err));
    }
  }, [userId, dispatch]);

  // Form xử lý mã giảm giá
  const formik = useFormik({
    initialValues: {
      couponCode: "",
    },
    validationSchema: Yup.object({
      couponCode: Yup.string(),
    }),
    onSubmit: async (values) => {
      setCouponMessage("");
      setCouponStatus(null);

      try {
        const response = await axios.post(
          `${process.env.URL_REACT}/stripe/apply-coupon`,
          { couponCode: values.couponCode, totalAmount: 100 }
        );

        if (response.data.valid) {
          const discountDetails = response.data.discountDetails;
          const discountPercent = discountDetails.discountValue || 0;
          setDiscountAmount(discountPercent);
          setCouponMessage(`Mã giảm giá đã áp dụng: Giảm ${discountPercent}%`);
          setCouponStatus(true);
          setAppliedCoupon(values.couponCode);
        } else {
          setDiscountAmount(0);
          setCouponMessage("Mã giảm giá không hợp lệ. Vui lòng thử lại.");
          setCouponStatus(false);
        }
      } catch (error) {
        console.error(
          "Lỗi khi áp dụng mã giảm giá:",
          error.response?.data || error.message
        );
        setCouponMessage("Mã giảm giá không đúng. Vui lòng thử lại.");
        setCouponStatus(false);
      }
    },
  });

  // Hàm xử lý thanh toán
  const handleCheckout = async () => {
    const token = Cookies.get("token");

    if (!token || !cartItems || cartItems.length === 0 || !userId) {
      alert("Vui lòng kiểm tra thông tin trước khi thanh toán.");
      return;
    }

    setLoading(true);

    try {
      const decoded = decodeToken(token); // Giải mã token để lấy email
      const email = decoded?.email;

      const checkoutResponse = await axios.post(
        `${process.env.URL_REACT}/stripe/create-checkout-session`,
        {
          cartItems,
          userId,
          email,
          totalAmount: totalAmount,
          couponId: appliedCoupon || null, // Truyền mã giảm giá (nếu có)
          discount: discountAmount.toString(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (checkoutResponse.data.url) {
        window.location.href = checkoutResponse.data.url; // Chuyển hướng đến Stripe Checkout
      } else {
        alert("Không thể tạo phiên thanh toán.");
      }
    } catch (error) {
      console.error("Lỗi khi tạo phiên thanh toán:", error);
      alert("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý khi thay đổi mã giảm giá
  const handleInputChange = (e) => {
    const { value } = e.target;
    formik.setFieldValue("couponCode", value);

    if (!value.trim()) {
      setDiscountAmount(0); // Reset giảm giá
      setAppliedCoupon("");
      setCouponMessage("");
      setCouponStatus(null);
    }
  };
  console.log("Cart Items từ Redux:", cartItems);
  console.log("Total Amount từ Redux:", totalAmount);
  return (
    <div className="col-lg-4 col-md-12">
      <div className="card p-3 mb-3">
        <div className="mb-3 text-center">
          <p className="text-danger mb-2">
            Nhập mã giảm giá <strong>FREECASH</strong>
          </p>
          <form onSubmit={formik.handleSubmit}>
            <div className="input-group w-auto">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={formik.values.couponCode}
                onChange={handleInputChange}
                className={`form-control ${
                  formik.touched.couponCode && formik.errors.couponCode
                    ? "is-invalid"
                    : ""
                }`}
              />
              <button
                className="btn btn-success"
                type="submit"
                disabled={formik.isSubmitting}
              >
                Áp dụng
              </button>
            </div>
            {formik.touched.couponCode && formik.errors.couponCode && (
              <div className="invalid-feedback">{formik.errors.couponCode}</div>
            )}
            {couponMessage && (
              <div
                className={`mt-2 ${
                  couponStatus ? "text-success" : "text-danger"
                }`}
              >
                {couponMessage}
              </div>
            )}
          </form>
        </div>
        <hr />
        <ul className="list-unstyled mb-2">
          <li className="d-flex justify-content-between">
            <span>Giảm giá</span>
            <span>{discountAmount}%</span>
          </li>
          <li className="d-flex justify-content-between">
            <span>Tổng phụ</span>
            <span>
                {totalAmount && discountAmount ? (
                  <>
                    <span className="text-decoration-line-through text-muted">
                      {totalAmount.toLocaleString('vi-VN')}đ
                    </span>{" "}
                    <strong>
                      {(
                        totalAmount - totalAmount * (discountAmount / 100)
                      ).toLocaleString('vi-VN')}đ
                    </strong>
                  </>
                ) : (
                  totalAmount?.toLocaleString('vi-VN') + "đ"
                )}
              </span>

          </li>
        </ul>
        <button
          className="btn btn-dark w-100 mt-3"
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Thanh toán"}
        </button>
        <div className="mt-3">
          <Link href="/" className="text-center">
            Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
