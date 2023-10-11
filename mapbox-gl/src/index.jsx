import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/css/index.css";
import "animate.css";

const Start = React.lazy(()=>import('./start'));

const DOM = ReactDOM.createRoot(document.getElementById("root"));
DOM.render(
  <React.StrictMode>
    <React.Suspense fallback={<div>Loading...</div>}>
      <Start />
    </React.Suspense>
  </React.StrictMode>
);
