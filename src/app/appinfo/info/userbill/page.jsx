"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import ClientModal from "../../../components/modalinfo";
import Link from "next/link";

export default function InfoBillModern() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [userId, setUserId] = useState("");
  const itemsPerPage = 5; // Số lượng đơn hàng trên mỗi trang

  // Xác định tổng số trang
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  // Lấy các đơn hàng cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setUserId(decodedToken.userId);
    }
  }, []);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  useEffect(() => {
    if (userId) {
      const fetchOrders = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_URL_REACT}/stripe/orderuser/${userId}`
          );
          const data = await response.json();
          setOrders(data);
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      };

      fetchOrders();
    }
  }, [userId]);

  const handleOrderClick = async (orderId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_REACT}/stripe/orders/${orderId}`
      );
      const data = await response.json();
      setSelectedOrder(data);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  return (
    <div className="col-9">
      <div className="container mt-3">
        <h2 className="text-primary">Thông tin mua hàng</h2>
        <table className="table table-hover shadow p-3 mb-5 bg-body rounded mt-4">
          <thead className="table-light">
            <tr>
              <th>Tên thanh toán</th>
              <th>Email</th>
              <th>Địa chỉ</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.length > 0 ? (
              currentOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order.shipping.name}</td>
                  <td>{order.shipping.email}</td>
                  <td>
                    {order.shipping.address.line1}, {order.shipping.address.city}
                  </td>
                  <td>
                    <button
                      className="btn btn-info btn-sm"
                      data-bs-toggle="modal"
                      data-bs-target="#orderDetailsModal"
                      onClick={() => handleOrderClick(order._id)}
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  Không có đơn hàng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination mt-3">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`pagination-btn ${currentPage === 1 ? "disabled" : ""}`}
        >
          «
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`pagination-btn ${
              page === currentPage ? "active" : ""
            }`}
            onClick={() => paginate(page)}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`pagination-btn ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          »
        </button>
      </div>

      {/* Modal for Order Details */}
      <ClientModal selectedOrder={selectedOrder} modalId="orderDetailsModal" />
    </div>
  );
}
