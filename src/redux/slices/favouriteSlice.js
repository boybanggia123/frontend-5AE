import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: typeof window !== 'undefined' && localStorage.getItem('favouriteItems')
    ? JSON.parse(localStorage.getItem('favouriteItems'))
    : [], // Lấy danh sách yêu thích từ localStorage nếu có
};

const favouriteSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    toggleFavouriteAction: (state, action) => {
      const productIndex = state.items.findIndex(item => item._id === action.payload._id);
      if (productIndex >= 0) {
        // Nếu sản phẩm đã có trong danh sách yêu thích, xóa nó
        state.items.splice(productIndex, 1);
      } else {
        // Nếu sản phẩm chưa có, thêm nó vào danh sách yêu thích
        state.items.push(action.payload);
      }
    },
    addToFavourites: (state, action) => {
      const existingItem = state.items.find(item => item._id === action.payload._id);
      if (!existingItem) {
        state.items.push(action.payload); // Thêm sản phẩm vào danh sách yêu thích
        localStorage.setItem('favouriteItems', JSON.stringify(state.items)); // Lưu vào localStorage
      }
    },
    removeFromFavourites: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload._id); // Xóa sản phẩm khỏi danh sách yêu thích
      localStorage.setItem('favouriteItems', JSON.stringify(state.items)); // Cập nhật localStorage
    },
  },
});

export const { toggleFavouriteAction, addToFavourites, removeFromFavourites } = favouriteSlice.actions;

export default favouriteSlice.reducer;