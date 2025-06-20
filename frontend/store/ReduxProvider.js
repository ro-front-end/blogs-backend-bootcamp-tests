"use client";
import { Provider } from "react-redux";
import reduxStore from "./reduxStore";

function ReduxProvider({ children }) {
  return <Provider store={reduxStore}>{children} </Provider>;
}

export default ReduxProvider;
