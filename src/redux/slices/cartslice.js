


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk lấy giỏ hàng từ server
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (userId, thunkAPI) => {
    try {
      const response = await axios.get(`${process.env.URL_REACT}/cart/${userId}`, {
        headers: {
          "Cache-Control": "no-store",
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error fetching cart");
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity, size }, thunkAPI) => {
    if (!userId) {
      return thunkAPI.rejectWithValue({ message: "User is not logged in" });
    }
    try {
      const response = await axios.post(`${process.env.URL_REACT}/cart`, {
        userId,
        productId,
        quantity,
        size,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error adding to cart");
    }
  }
);


// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ userId, productId, size }, thunkAPI) => {
    try {
      const response = await axios.delete(`${process.env.URL_REACT}/cart`, {
        data: { userId, productId, size },
      });
      return { productId, size };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "lỗi khi xóa sản phẩm");
    }
  }
);

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async ({ userId, productId, quantity, size }, thunkAPI) => {
    try {
      const response = await axios.put(`${process.env.URL_REACT}/cart`, {
        userId,
        productId,
        quantity,
        size,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "lỗi khi cập nhật");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalAmount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0; // Đặt lại tổng tiền khi giỏ hàng bị xóa
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.totalAmount = action.payload.reduce(
          (total, item) => total + item.price * (1 - item.discountedPrice / 100) * item.quantity,
          0
        ); // Tính lại tổng tiền khi giỏ hàng được tải
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // addToCart
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        const existingItem = state.items.find(
          (item) =>
            item.id === action.payload.productId && item.size === action.payload.size
        );

        if (existingItem) {
          existingItem.quantity += action.payload.quantity; // Cập nhật số lượng sản phẩm
        } else {
          state.items.push({
            id: action.payload.productId,
            name: action.payload.name,
            image: action.payload.image,
            size: action.payload.size,
            price: action.payload.price,
            discountedPrice: action.payload.discountedPrice,
            quantity: action.payload.quantity,
          });
        }

        // Cập nhật lại totalAmount sau khi thêm sản phẩm
        state.totalAmount = state.items.reduce(
          (total, item) => total + item.price * (1 - item.discountedPrice / 100) * item.quantity,
          0
        );
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      // removeFromCart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(
          (item) =>
            !(item.id === action.payload.productId && item.size === action.payload.size)
        );

        // Cập nhật lại totalAmount sau khi xóa sản phẩm
        state.totalAmount = state.items.reduce(
          (total, item) => total + item.price * (1 - item.discountedPrice / 100) * item.quantity,
          0
        );
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateCartItemQuantity
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        const item = state.items.find(
          (item) =>
            item.id === action.payload.productId && item.size === action.payload.size
        );
        if (item) {
          item.quantity = action.payload.quantity; // Cập nhật số lượng
        }

        // Cập nhật lại totalAmount sau khi thay đổi số lượng
        state.totalAmount = state.items.reduce(
          (total, item) => total + item.price * (1 - item.discountedPrice / 100) * item.quantity,
          0
        );
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
