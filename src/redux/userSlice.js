import { createSlice } from "@reduxjs/toolkit";

export const myuserSlice = createSlice({
    name:"myuserSlice",
    initialState:{
        answered:[],
        user:[],
        error:null
    },
  reducers:{
    addAnswer:(state,action)=>{
        state.answered.push(action.payload);
    },
    addUser:(state,action)=>{
        state.user.push(action.payload);
    }
}
})
export const {addAnswer,addUser} = myuserSlice.actions
export default myuserSlice.reducer