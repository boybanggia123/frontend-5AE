// components/ClientModal.js
"use client";
import { useEffect, useRef, useState } from "react";


// Dynamic import Bootstrap Modal only on client side


const ClientModal = ({ selectedOrder, modalId }) => {
  const modalRef = useRef("");

  const modalInstanceRef = useRef(""); 

  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  useEffect(() => {
    if (showModal && modalRef.current) {
      const modalElement = modalRef.current;
      const Modal = window.bootstrap?.Modal;
      if (Modal && modalElement) {
        const modalInstance = new Modal(modalElement);
        modalInstanceRef.current = modalInstance;
        modalInstance.show(); // Show modal when state `showModal` is true
      }
    }
  }, [showModal]); // Run effect when `showModal` changes

  const handleClose = () => {
    // Manually hide the modal when the close button is clicked
    if (modalInstanceRef.current) {
      modalInstanceRef.current.hide();
    }
    setShowModal(false); // Close modal when the button is clicked
  };

  const handleShow = () => {
    setShowModal(true); // Show modal when a specific action occurs, like clicking a button
  };


  return (
    <div
        ref={modalRef}
        className="modal fade"
        id="orderDetailsModal"
        tabIndex="-1"
        aria-labelledby="orderDetailsModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="orderDetailsModalLabel">
                Chi tiết đơn hàng
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
          {selectedOrder ? (
            <>
              <div className="mb-3 d-flex">
                <strong className="me-2 text-muted">Địa chỉ giao hàng:</strong>
                <span>
                  {selectedOrder.shipping.address.line1},{" "}
                  {selectedOrder.shipping.address.city},{" "}
                  {selectedOrder.shipping.country}
                </span>
              </div>
              <div className="mb-3 d-flex">
                <strong className="me-2 text-muted">Email:</strong>
                <span>{selectedOrder.shipping.email}</span>
              </div>
              <div className="mb-3 d-flex">
                <strong className="me-2 text-muted">Số điện thoại:</strong>
                <span>{selectedOrder.phone || "Không có thông tin"}</span>
              </div>
              <div className="mb-3 d-flex">
                <strong className="me-2 text-muted">Trạng thái giao hàng:</strong>
                <span>{selectedOrder.order_status}</span>
              </div>
              <div className="mb-3 d-flex">
                <strong className="me-2 text-muted">Trạng thái thanh toán:</strong>
                <span>{selectedOrder.payment_status}</span>
              </div>
              <div className="mb-3">
                <strong className="text-muted d-block">Sản phẩm:</strong>
                {selectedOrder.products.map((product) => (
                  <div key={product._id} className="border rounded p-2 mb-2">
                    <div className="d-flex align-items-center">
                      <img
                        src={product.image}
                        alt=""
                        className="img-thumbnail me-3"
                        style={{ width: "80px", height: "80px" }}
                      />
              <div>
                <strong>{product.name}</strong>
                <p className="mb-1">Size: {product.size}</p>
                <p className="mb-1">Giá gốc: {selectedOrder.subtotal.toLocaleString('vi-VN')}đ</p>
                <p className="mb-1">Giảm giá: {product.discountedPrice}%</p>
              </div>
            </div>
            <p className="mt-2 mb-0">Số lượng: {product.quantity}</p>
          </div>
        ))}
      </div>
      <div className="mb-3 d-flex">
        <strong className="me-2 text-muted">Mã khuyến mãi:</strong>
        <span>{selectedOrder.coupon || "Không có"}</span>
      
        
      </div>
      <div className="mb-3 d-flex">
        <strong className="me-2 text-muted">Phần trăm khuyến mãi:</strong>
      
        <span>{selectedOrder.discount || 0}%</span>
      </div>
     
      <div className="mb-3 d-flex">
        <strong className="me-2 text-muted">Tổng tiền thanh toán:</strong>
        <span>{selectedOrder.total.toLocaleString('vi-VN')}đ</span>
      </div>
      <hr />
      <h5>Thông tin thanh toán</h5>
      <div className="mb-3 d-flex">
        <strong className="me-2 text-muted">Payment Intent ID:</strong>
        <span>{selectedOrder.paymentIntentId}</span>
      </div>
    </>
  ) : (
    <p>Đang tải thông tin...</p>
  )}
</div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={handleClose}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ClientModal;
