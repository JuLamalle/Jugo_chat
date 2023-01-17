import { createBrowserRouter } from "react-router-dom";
import App from './App.js';
import Home from "./pages/Home";
import ChatPage from "./pages/ChatPage";

const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/chats",
          element: <ChatPage />,
        }
      ],
    },
  ]);

  export default router;