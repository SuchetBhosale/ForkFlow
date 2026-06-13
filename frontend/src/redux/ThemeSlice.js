import { createSlice } from "@reduxjs/toolkit";

const saved = localStorage.getItem("ff-theme") || "light";

const themeSlice = createSlice({
  name: "theme",
  initialState: { mode: saved },
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === "light" ? "dark" : "light";
      localStorage.setItem("ff-theme", state.mode);
      document.documentElement.setAttribute("data-bs-theme", state.mode);
    },
  },
});

export const { toggleTheme } = themeSlice.actions;

// export
export default themeSlice.reducer; 