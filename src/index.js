import React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { loadTheme } from '@fluentui/react';

// lightweight Fluent theme aligned with CSS tokens
loadTheme({
  palette: {
    themePrimary: '#0063b1',
    themeLighter: '#cfe7fb',
    themeLighterAlt: '#eaf6ff',
    themeDarkAlt: '#00549a',
    themeDarker: '#003a6f',
    neutralPrimary: '#222222',
    neutralSecondary: '#666666',
    neutralLighterAlt: '#f3f2f1',
    white: '#ffffff',
    black: '#000000',
  },
  semanticColors: {
    bodyBackground: '#f8f9fa',
    bodyText: '#222222',
    link: '#0063b1',
  }
});

ReactDOM.render(
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById("root")
);
