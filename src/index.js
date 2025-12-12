import React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { loadTheme } from '@fluentui/react';

// lightweight Fluent theme aligned with CSS tokens
loadTheme({
  palette: {
    themePrimary: '#0063b1',
    neutralPrimary: '#222222',
    neutralLighterAlt: '#f3f2f1',
  },
});

ReactDOM.render(
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById("root")
);
