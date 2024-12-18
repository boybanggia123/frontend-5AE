//import

import { createSlice } from '@reduxjs/toolkit';
// Khai báo 1 slice với tên là couter
const counterSlice = createSlice({
    // Tên của slice
  name: 'counter',
  // Giá trị ban đầu của state 0
  initialState: 0,
  // Các reducers là các action
  reducers: {
    // Action tăng giá trị cauwr state lên 1
    increment: (state) => state + 1,
    // Action giảm giá trị của state đi 1
    decrement: (state) => state - 1,
  },
});

export const { increment, decrement } = counterSlice.actions;
export default counterSlice.reducer;
