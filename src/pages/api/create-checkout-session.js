// pages/api/create-checkout-session.js
export default async function handler(req, res) {
  if (req.method === "POST") {
    // Gọi đến backend của bạn ở đây
    const response = await fetch(
      "http://localhost:3000/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body), // Gửi dữ liệu giỏ hàng từ frontend
      }
    );

    const data = await response.json();

    // Xử lý phản hồi từ backend
    if (response.ok) {
      res.status(200).json(data);
    } else {
      res.status(response.status).json({ error: data.error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
