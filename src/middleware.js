import { NextResponse } from "next/server";
import SignInModal from "./app/components/SignInModal";
export async function middleware(request) {
  const token = request.cookies.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/dangnhap", request.url));
  }
  // Gọi đến API xác thực token
  const res = await fetch("http://localhost:3000/checktoken", {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  });
  if (!res.ok) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  // Nếu token hợp lệ, cho phép yêu cầu tiếp tục
  return NextResponse.next();
}
export const config = {
  matcher: "/info",
};
