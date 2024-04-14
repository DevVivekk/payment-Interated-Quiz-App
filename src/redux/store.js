import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { myuserSlice } from "./userSlice";
const rootReducer = combineReducers({
    user:myuserSlice.reducer
  });
export const store = configureStore({
    reducer:{
        rootReducer
    }
})
