import React from "react";
import ReactDOM from "react-dom/client";

import * as Ably from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";
import "animate.css";

import App from "./App.jsx";
import "./index.css";
import "./App.css";
import "./Responsive.css";
import { UserProvider } from "./modules/context/UserProvider";
import { CommentUpdateProvider } from "./modules/context/comment/CommentContex.jsx";
import { IsLoadingContextProvider } from "./modules/context/LoaderContext.jsx";

const client = new Ably.Realtime({
  key: import.meta.env.VITE_ABLY_KEY,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <CommentUpdateProvider>
        <IsLoadingContextProvider>
          <AblyProvider client={client}>
            <ChannelProvider channelName='comment-channel'>
              <App />
            </ChannelProvider>
          </AblyProvider>
        </IsLoadingContextProvider>
      </CommentUpdateProvider>
    </UserProvider>
  </React.StrictMode>
);
