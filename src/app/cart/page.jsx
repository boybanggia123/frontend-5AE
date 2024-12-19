"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  removeFromCart,
  updateCartItemQuantity,
  fetchCart,
} from "../../redux/slices/cartslice";
import Cookies from "js-cookie";
import axios from "axios";
import Link from "next/link";
import Swal from "sweetalert2";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);
import PayButton from "../components/PayButton";

export default function Cart() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { items = [] } = useSelector((state) => state.cart || {});
  const [userId, setUserId] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get("token");
        if (token) {
          const response = await axios.get(`${process.env.URL_REACT}/detailuser`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const fetchedUserId = response.data._id;
          if (fetchedUserId) {
            setUserId(fetchedUserId);
            dispatch(fetchCart(fetchedUserId));
          }
        }
      } catch (err) {
        console.error("Lỗi khi tìm nạp dữ liệu người dùng:", err);
      }
    };

    fetchUserData();
  }, [dispatch]);

  const fetchRelatedProducts = async (productId) => {
    console.log("Fetching related products for productId:", productId); // Kiểm tra giá trị productId
    try {
      const response = await axios.get(
        `${process.env.URL_REACT}/related-products?productId=${productId}`
      );
      if (response.data) {
        console.log("Related products:", response.data); // Kiểm tra dữ liệu trả về
        setRelatedProducts(response.data);
      }
    } catch (err) {
      console.error("Lỗi khi lấy sản phẩm liên quan:", err);
    }
  };

  useEffect(() => {
    if (items.length > 0) {
      // Lấy sản phẩm liên quan cho mỗi sản phẩm trong giỏ hàng
      items.forEach((item) => {
        fetchRelatedProducts(item.productId);
      });
    }
  }, [items]);

  const handleRemoveItem = async (item) => {
    // Hiển thị modal xác nhận với SweetAlert2
    Swal.fire({
      title: "Bạn có chắc chắn muốn xóa sản phẩm này?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Nếu người dùng chọn "Đồng ý", thực hiện xóa sản phẩm khỏi giỏ hàng
        try {
          await dispatch(
            removeFromCart({
              userId,
              productId: item.productId,
              size: item.size,
            })
          );
          dispatch(fetchCart(userId));

          // Hiển thị thông báo thành công
          Swal.fire("Đã xóa!", "Sản phẩm đã bị xóa khỏi giỏ hàng.", "success");
        } catch (err) {
          console.error("Lỗi khi xóa mục:", err);
          Swal.fire("Có lỗi xảy ra!", "Không thể xóa sản phẩm.", "error");
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Nếu người dùng chọn "Hủy", không làm gì cả
        Swal.fire("Đã hủy", "Sản phẩm không bị xóa.", "info");
      }
    });
  };

  const handleQuantityChange = async (item, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await dispatch(
        updateCartItemQuantity({
          userId,
          productId: item.productId,
          quantity: newQuantity,
          size: item.size,
        })
      );
      dispatch(fetchCart(userId));
    } catch (err) {
      console.error("Lỗi cập nhật số lượng:", err);
    }
  };

  const total = (Array.isArray(items) ? items : []).reduce((total, item) => {
    const discountAmount = (item.price * item.discountedPrice) / 100; // Tính toán giá trị giảm giá
    const finalPrice = item.price - discountAmount; // Giá sau khi giảm giá
    return total + finalPrice * item.quantity; // Cộng tổng tiền giỏ hàng
  }, 0);

  return (
    <div className="container my-4">
      <div className="row">
        <div className="d-flex align-items-center">
          <span className="cart-giohang ">GIỎ HÀNG</span>
          <span className="so_luong_cart"> ({items.length} sản phẩm)</span>
        </div>
        <div className="col-lg-8 col-md-12">
          <div className="card-1 mt-2 mb-2">
            {items.length > 0 ? (
              items.map((item) => (
                <div
                  className="row mb-3"
                  key={`${item._id}-${item.productId}-${item.size}`}
                >
                  <div className="col-4 col-sm-3 col-md-2 product-image-container">
                    <img
                      src={`${item.image}`}
                      className="img-fluid product-image"
                      alt="Product Image"
                    />
                    <div
                      className="remove-icon"
                      onClick={() => handleRemoveItem(item)}
                    >
                      <i className="fa-regular fa-trash-can"></i>
                    </div>
                  </div>

                  <div className="col-8 col-sm-9 col-md-10">
                    <Link href={""}>{item.name}</Link>
                    <span className="cart_price">
                        {item.discountedPrice > 0 ? (
                          <>
                            <p className="cart_discountedPrice">
                              {((item.price - (item.price * item.discountedPrice) / 100).toLocaleString('vi-VN'))}đ
                            </p>
                            <del className="cart_goc">
                              {(item.price.toLocaleString('vi-VN') )}đ
                            </del>
                          </>
                        ) : (
                          <p className="cart_discountedPrice">
                            {(item.price.toLocaleString('vi-VN') )}đ
                          </p>
                        )}
                      </span>


                    <div className="d-flex align-items-center mb-2">
                      <select className="form-select">
                        <option>{item.size}</option>
                      </select>
                    </div>
                    <div className="d-flex justify-content-between">
                      <div className="d-flex align-items-center">
                        <button
                          className="btn btn-outline-secondary-1"
                          onClick={() => {
                            handleQuantityChange(item, item.quantity - 1);
                          }}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          className="form-control-2"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            handleQuantityChange(
                              item,
                              parseInt(e.target.value)
                            );
                          }}
                        />
                        <button
                          className="btn btn-outline-secondary-1"
                          onClick={() => {
                            handleQuantityChange(item, item.quantity + 1);
                          }}
                        >
                          +
                        </button>
                      </div>

                      <Link href="#" className="text-danger">
                        Move to Wishlist <i className="fa-solid fa-heart"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-danger">Giỏ hàng của bạn đang trống ?</p>
            )}
          </div>
          <div className="recommended-section mt-4">
            <div className="row mt-3">
              <h6 className="text-uppercase">Sản phẩm liên quan</h6>
              {relatedProducts.length > 0 ? (
                relatedProducts.map((product) => (
                  <div
                    className="col-6 col-sm-4 col-md-3 p-1"
                    key={product._id}
                  >
                    <div className="card rounded-0 products_lienquan">
                      <div className="product-image-container">
                        <Link href={"#"}>
                          <img
                            src={`${product.image}`}
                            className="card-img-top rounded-0"
                            alt={`Product ${product.name}`}
                          />
                          <div className="cart-icon">
                            <svg
                              alt-text="Add to my Bag"
                              data-testid="bag-plus-icon"
                              width="18"
                              height="17"
                              fill="none"
                              viewBox="0 0 18 17"
                            >
                              <g>
                                <g fill="#000">
                                  <path
                                    fill-rule="evenodd"
                                    d="M5.776 4.183a3.317 3.317 0 013.31-3.31 3.275 3.275 0 013.292
                                    3.31v1.051h4.226c.218 0 .396.179.396.397v6.88a4.375 4.375 0 01-4.362
                                    4.361H5.362A4.375 4.375 0 011 12.511V5.63c0-.218.178-.397.397-.397h4.379v-1.05zm3.31-2.537A2.522
                                    2.522 0 006.57 4.164v1.05h5.036v-1.05a2.522 2.522 0 00-2.518-2.518zm7.14 10.865V6.027h-3.848l.02
                                    1.702h-.793l-.02-1.702H6.569V7.73h-.793V6.027H1.793v6.483a3.58 3.58 0 003.569 3.57h7.296a3.58
                                    3.58 0 003.569-3.57zm-6.76-1.836h2.036a.429.429 0 010 .857H9.466a.107.107
                                    0 00-.107.107v2.036a.429.429 0 11-.857 0v-2.036a.107.107 0 00-.107-.107H6.359a.429.429
                                    0 010-.857h2.036a.107.107 0 00.107-.108V8.532a.429.429 0 01.857 0v2.035a.107.107 0 00.107.107z"
                                    clip-rule="evenodd"
                                  ></path>
                                  <path
                                    d="M12.378 4.183l-.125-.001v.001h.125zm0 1.051h-.125v.125h.125v-.125zm-6.602 0v.125H5.9v-.125h-.125zm.793-1.07h-.125.125zm0
                                    1.05h-.125v.125h.125v-.125zm5.036 0v.125h.125v-.125h-.125zm4.622.813h.125v-.125h-.125v.125zm-3.85 0v-.125h-.126l.002.127.125-.002zm.02
                                    1.702v.125h.127l-.001-.126-.125.001zm-.792 0l-.125.002.001.123h.124V7.73zm-.02-1.702l.125-.001-.002-.124h-.123v.125zm-5.016 0v-.125h-.125v.125h.125zm0
                                    1.702v.125h.125V7.73h-.125zm-.793 0H5.65v.125h.125V7.73zm0-1.702H5.9v-.125h-.125v.125zm-3.983 0v-.125h-.125v.125h.125zM5.362 16.08v-.125.125zm7.296
                                    0v.125-.125zm-.853-5.279l-.088.088.088-.088zm0 .606l-.088-.088.088.088zm-2.414.157l.088.088-.088-.088zm-.92
                                    0l-.089.088.089-.088zm-2.415-.157l.089-.088-.089.088zm0-.606l.089.088-.089-.088zm2.415-.157l-.089-.088.089.088zm.157-2.414l-.089-.089.089.089zm.606
                                    0l.088-.089-.088.089zm.157 2.414l.088-.088-.088.088zM9.087.747A3.442 3.442 0 005.65 4.183h.25A3.192 3.192 0 019.087.997v-.25zm3.416 3.438A3.4 3.4
                                    0 009.087.747v.25a3.15 3.15 0 013.166 3.185l.25.003zm0 1.05V4.182h-.25v1.051h.25zm4.1-.126h-4.225v.25h4.226v-.25zm.522.522a.523.523
                                    0 00-.521-.522v.25c.149 0 .271.123.271.272h.25zm0 6.88V5.63h-.25v6.88h.25zm-4.487 4.486a4.5 4.5 0 004.487-4.486h-.25a4.25 4.25 0 01-4.237
                                    4.236v.25zm-7.276 0h7.276v-.25H5.362v.25zM.875 12.511a4.5 4.5 0 004.487 4.486v-.25a4.25 4.25 0 01-4.237-4.236h-.25zm0-6.88v6.88h.25V5.63h-.25zm.522-.522a.523.523
                                    0 00-.522.522h.25c0-.15.122-.272.272-.272v-.25zm4.379 0h-4.38v.25h4.38v-.25zm-.125-.926v1.051h.25v-1.05h-.25zm1.043-.02a2.397 2.397 0 012.393-2.392v-.25a2.647 2.647
                                    0 00-2.643 2.643h.25zm0 1.051v-1.05h-.25v1.05h.25zm4.91-.125H6.57v.25h5.036v-.25zm-.124-.925v1.05h.25v-1.05h-.25zM9.087 1.77a2.397 2.397 0
                                    012.393 2.393h.25A2.647 2.647 0 009.087 1.52v.25zm7.015 4.256v6.484h.25V6.027h-.25zm-3.724.125h3.849v-.25h-3.85v.25zm.145 1.576l-.02-1.702-.25.003.02
                                    1.702.25-.003zm-.918.126h.793v-.25h-.793v.25zM11.46 6.03l.02 1.702.25-.003-.02-1.702-.25.003zm-4.891.123h5.016v-.25H6.569v.25zm.125
                                    1.577V6.027h-.25V7.73h.25zm-.918.125h.793v-.25h-.793v.25zM5.65 6.027V7.73h.25V6.027h-.25zm-3.858.125h3.983v-.25H1.793v.25zm.125 6.358V6.027h-.25v6.483h.25zm3.444
                                    3.444a3.454 3.454 0 01-3.444-3.444h-.25a3.704 3.704 0 003.694 3.694v-.25zm7.296 0H5.362v.25h7.296v-.25zm3.444-3.443a3.454 3.454 0 01-3.444 3.443v.25a3.704 3.704
                                    0 003.694-3.693h-.25zm-4.6-1.961H9.466v.25h2.036v-.25zm.392.162a.553.553 0 00-.392-.162v.25c.08 0 .158.031.215.088l.177-.176zm.162.391a.554.554 0
                                    00-.162-.391l-.177.176a.304.304 0 01.089.215h.25zm-.162.392a.554.554 0 00.162-.392h-.25c0 .08-.032.158-.09.215l.178.177zm-.392.162a.554.554 0 
                                    00.392-.162l-.177-.177a.304.304 0 01-.215.089v.25zm-2.036 0h2.036v-.25H9.466v.25zm.013-.006a.018.018 0 01-.013.006v-.25a.232.232 0 00-.164.068l.177.176zm.005-.012c0
                                    .005-.002.01-.005.012l-.177-.176a.232.232 0 00-.068.164h.25zm0 2.036v-2.036h-.25v2.036h.25zm-.162.391a.554.554 0 00.162-.392h-.25c0 .081-.032.158-.089.215l.177.177zm-.391.162a.554.554
                                    0 00.391-.162l-.177-.177a.304.304 0 01-.214.09v.25zm-.392-.162a.554.554 0 00.392.162v-.25a.304.304 0 01-.215-.089l-.177.177zm-.162-.392c0 .147.059.288.162.392l.177-.177a.304.304 0 
                                    01-.089-.214h-.25zm0-2.035v2.036h.25v-2.036h-.25zm.005.012a.018.018 0 01-.005-.012h.25a.232.232 0 00-.068-.164l-.177.176zm.013.006a.018.018 0 01-.013-.006l.177-.176a.232.232
                                    0 00-.164-.068v.25zm-2.036 0h2.036v-.25H6.359v.25zm-.391-.162a.554.554 0 00.391.162v-.25a.303.303 0 01-.214-.09l-.177.178zm-.162-.392c0 .147.058.288.162.392l.177-.177a.303.303 
                                    0 01-.09-.215h-.25zm.162-.391a.553.553 0 00-.162.391h.25c0-.08.032-.158.089-.215l-.177-.176zm.391-.162a.553.553 0 00-.391.162l.177.176a.304.304 0 01.214-.088v-.25zm2.036 0H6.359v.25h2.036v-.25zm-.013.005a.018.018
                                    0 01.013-.005v.25c.062 0 .12-.025.164-.069l-.177-.176zm-.005.012c0-.004.002-.009.005-.012l.177.177a.232.232 0 00.068-.165h-.25zm0-2.035v2.035h.25V8.532h-.25zm.162-.392a.554.554 0 
                                    00-.162.392h.25c0-.08.032-.158.09-.215l-.178-.177zm.392-.162a.554.554 0 00-.392.162l.177.177a.304.304 0 01.215-.089v-.25zm.391.162a.554.554 0 00-.391-.162v.25c.08 0 .158.032.214.089l.177-.177zm.162.392a.554.554 
                                    0 00-.162-.392l-.177.177a.304.304 0 01.09.215h.25zm0 2.035V8.532h-.25v2.035h.25zm-.005-.012a.018.018 0 01.005.012h-.25c0 .062.025.121.068.165l.177-.177zm-.013-.005c.005 0 .01.001.013.005l-.177.177a.232.232 0 00.164.068v-.25z"
                                  ></path>
                                </g>
                              </g>
                            </svg>
                          </div>
                        </Link>
                      </div>
                      <div className="mt-2 fw-medium">
                        <div className="d-flex justify-content-between">
                          <Link href={""} className="namesup">
                            {product.name}
                          </Link>
                        </div>
                        <span className="price">
                              {product.discountedPrice > 0 ? (
                                <>
                                  <p className="priceSale">
                                    {(
                                      product.price -
                                      (product.price * product.discountedPrice) / 100
                                    ).toLocaleString('vi-VN')}đ
                                  </p>
                                  <del>{product.price.toLocaleString('vi-VN')}đ</del>
                                </>
                              ) : (
                                <p className="priceSale">{product.price.toLocaleString('vi-VN')}đ</p>
                              )}
                            </span>

                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-danger">Không có sản phẩm liên quan</p>
              )}
            </div>
          </div>
        </div>
        <PayButton />
        {/* <div className="col-lg-4 col-md-12">
          <div className="card p-3 mb-3">
            <div className="mb-3 text-center">
              <p className="text-danger mb-2">
                Nhập mã giảm giá <strong>FREECASH</strong>
              </p>
              <div className="codegiamgia input-group-2">
                <PayButton items={items} />
              </div>
            </div>
            <hr />
            <ul className="list-unstyled mb-2">
              <li className="d-flex justify-content-between">
                <span>Tổng phụ</span>
                <span>
                  {total.toLocaleString("en-US", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </li>
              <li className="d-flex justify-content-between">
                <span>Giảm giá</span>
                <span>0%</span>
              </li>
            </ul>
            <hr />
            <span className="d-flex justify-content-between">
              <span className="Total">Total</span>
              <span className="tongtien">
                {total.toLocaleString("en-US", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
            </span>

            <div className="mt-3">
              <Link href="/" className="text-center">
                Quay về trang chủ
              </Link>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
