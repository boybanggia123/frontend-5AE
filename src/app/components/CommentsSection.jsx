"use client"
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const CommentsAndReview = ({ user, productId, userId }) => {
  const [userComments, setUserComments] = useState([]);
  const [editReview, setEditReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // Hàm lấy bình luận của sản phẩm
  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/productreviews/${productId}`
      );
      if (response.status === 200) {
        setUserComments(response.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy bình luận:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [productId]);

  // Hàm thêm bình luận mới
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!rating || !comment) {
      Swal.fire(
        "Cảnh báo",
        "Vui lòng chọn đánh giá và viết bình luận.",
        "warning"
        
      );
      return;
    }

    if (!user) {
      Swal.fire("Cảnh báo", "Vui lòng đăng nhập để gửi đánh giá.", "warning");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/productreview/${productId}`,
        {
          userId: user._id,
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      if (response.status === 200) {
        Swal.fire(
          "Thành công",
          "Đánh giá và bình luận đã được gửi!",
          "success"
        );
        setUserComments((prevComments) => [
          ...prevComments,
          response.data.review,
        ]);
        setRating(0);
        setComment("");
      }
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      Swal.fire(
        "Lỗi",
        error.response?.data?.message || "Không thể gửi đánh giá.",
        "error"
      );
    }
  };

  // Hàm mở modal sửa bình luận
  const handleEditComment = (review) => {
    setEditReview(review);
    const modal = new bootstrap.Modal(
      document.getElementById("editCommentModal")
    );
    modal.show();
  };

  // Hàm xử lý sửa bình luận
  const handleUpdateComment = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_URL}/productreview/${productId}/${editReview?._id}`,
        {
          userId: editReview?.userId,
          rating: editReview?.rating,
          comment: editReview?.comment,
        }
      );

      if (response.status === 200) {
        const updatedReviews = userComments.map((review) =>
          review._id === editReview?._id ? response.data.review : review
        );
        setUserComments(updatedReviews);
        Swal.fire("Thành công", "Bình luận đã được cập nhật!", "success");
        setEditReview(null);
        const modalElement = document.getElementById("editCommentModal");
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật bình luận:", error);
      Swal.fire(
        "Lỗi",
        error.response?.data?.message || "Không thể cập nhật bình luận.",
        "error"
      );
    }
  };

  // Hàm xử lý xóa bình luận
  const handleDeleteComment = async (reviewId) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_URL}/productreview/${productId}/${reviewId}`
      );

      if (response.status === 200) {
        const updatedReviews = userComments.filter(
          (review) => review._id !== reviewId
        );
        setUserComments(updatedReviews);
        Swal.fire("Thành công", "Bình luận đã được xóa!", "success");
      } else {
        Swal.fire("Lỗi", "Không thể xóa bình luận. Vui lòng thử lại.", "error");
      }
    } catch (error) {
      console.error("Lỗi khi xóa bình luận:", error);
      Swal.fire("Lỗi", "Không thể xóa bình luận. Vui lòng thử lại.", "error");
    }
  };

  // Hàm tính điểm trung bình
  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  // Hàm lấy số lượng đánh giá theo sao
  const getRatingCount = (reviews, rating) =>
    reviews.filter((review) => review.rating === rating).length;

  return (
    <div>
      <div className="ratings-section d-flex flex-column flex-md-row align-items-center pt-4">
        <div className="text-center mb-3 mb-md-0" style={{ width: "150px" }}>
          <div className="display-5 font-weight-bold text-dark">
            {calculateAverageRating(userComments)}/5
          </div>
          <div className="text-warning fs-3">
            {Array.from({ length: 5 }, (_, i) =>
              i < Math.round(calculateAverageRating(userComments)) ? (
                <span key={i} className="text-warning">
                  ★
                </span>
              ) : (
                <span key={i} className="text-muted">
                  ★
                </span>
              )
            )}
          </div>
          <span className="text-muted">({userComments.length} đánh giá)</span>
        </div>
        <div className="rating-bars flex-grow-1 ms-md-4 w-100">
          {[5, 4, 3, 2, 1].map((rating, index) => (
            <div className="d-flex align-items-center mb-1" key={index}>
              <span className="me-2">{rating} ★</span>
              <div
                className="progress flex-grow-1 me-2"
                style={{ height: "8px" }}
              >
                <div
                  className="progress-bar bg-warning"
                  role="progressbar"
                  style={{
                    width: `${
                      (getRatingCount(userComments, rating) /
                        userComments.length) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
              <span>{getRatingCount(userComments, rating)}</span>
            </div>
          ))}
        </div>
      </div>

      {userComments.length > 0 && (
        <div className="comment-section mt-4">
          <h5 className="comment-title mb-3">Nhận xét</h5>
          <div className="comments-box p-3 rounded bg-light">
            {userComments.map((review, index) => (
              <div key={index} className="review-item mb-3">
                <div className="d-flex align-items-center mb-2">
                  <img
                    src={review.userImage}
                    alt="Người dùng"
                    className="user-avatar me-2"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                    }}
                  />
                  <div>
                    <strong className="user-name">{review.userName}</strong>
                    <span
                      className="user-date d-block text-muted"
                      style={{ fontSize: "0.85rem" }}
                    >
                      {review.date}
                    </span>
                  </div>
                  {userId === review.userId && (
                    <>
                      <button
                        className="btn btn-light btn-sm ms-auto"
                        title="Sửa bình luận"
                        onClick={() => handleEditComment(review)}
                      >
                        <i className="bi bi-pencil-fill"></i>{" "}
                      </button>
                      <button
                        className="btn btn-light btn-sm ms-2"
                        title="Xóa bình luận"
                        onClick={() => handleDeleteComment(review._id)}
                      >
                        <i className="bi bi-trash-fill"></i>{" "}
                      </button>
                    </>
                  )}
                </div>
                <div className="user-rating mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`me-1 ${
                        star <= review.rating ? "text-warning" : "text-muted"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <div className="user-comment">
                  <p>{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="comment-form-section mt-5 mb-5">
        <h5 className="comment-title mb-3">Gửi đánh giá của bạn</h5>
        {userComments.some((review) => review.userId === user?._id) ? (
          <div className="alert thongbao_reviews">
            Bạn đã gửi đánh giá cho sản phẩm này. Cảm ơn bạn!
          </div>
        ) : (
          <form className="p-3 bg-light rounded" onSubmit={handleSubmitReview}>
            <div className="mb-3">
              <label className="form-label">Chọn số sao:</label>
              <div className="rating-input d-flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`btn btn-sm me-1 ${
                      star <= rating ? "btn-warning" : "btn-outline-warning"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Viết nhận xét của bạn:</label>
              <textarea
                className="form-control"
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </div>
            <button type="submit" className="btn guidanhgia">
              Gửi đánh giá
            </button>
          </form>
        )}
      </div>

      {/* Modal sửa bình luận */}
      <div
        className="modal fade"
        id="editCommentModal"
        tabIndex="-1"
        aria-labelledby="editCommentModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editCommentModalLabel">
                Sửa bình luận
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleUpdateComment}>
                <div className="mb-3">
                  <label htmlFor="editRating" className="form-label">
                    Số sao
                  </label>
                  <div className="d-flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i
                        key={star}
                        className={`fa-star ${
                          star <= (editReview?.rating || 0)
                            ? "fa-solid text-warning"
                            : "fa-regular"
                        }`}
                        style={{ cursor: "pointer", fontSize: "24px" }}
                        onClick={() =>
                          setEditReview({ ...editReview, rating: star })
                        }
                      ></i>
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="editComment" className="form-label">
                    Bình luận
                  </label>
                  <textarea
                    id="editComment"
                    rows="4"
                    className="form-control"
                    value={editReview?.comment || ""}
                    onChange={(e) =>
                      setEditReview({
                        ...editReview,
                        comment: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Cập nhật
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentsAndReview;
