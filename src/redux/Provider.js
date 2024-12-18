"use client";
// Nhúng provider từ redux
import { Provider } from "react-redux";
// Nhúng store
import { store } from "./store";

function Providers({ children }) {
  // Truyền store cho các component con
  return <Provider store={store}>{children}</Provider>;
}

export default Providers;
