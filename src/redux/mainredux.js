"use client";
import { Provider } from "react-redux";
import { store } from "./store";
import Mycontext from "@/context/mycontext";
const Mainredux = ({ children }) => {
  return (
    <Provider store={store}>
      <Mycontext>
        {children}
      </Mycontext>
    </Provider>
  );
};

export default Mainredux;
