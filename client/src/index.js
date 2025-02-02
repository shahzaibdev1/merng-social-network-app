import React from "react";
import ReactDOM from "react-dom";
import ApolloProvider from "./ApolloProvider";

import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>{ApolloProvider}</React.StrictMode>,
  document.getElementById("root")
);
reportWebVitals(console.log);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
