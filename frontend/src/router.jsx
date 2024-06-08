import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import Regsiter from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import TweetDetails from "./pages/TweetDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/:username",
        element: <Profile />,
      },
      {
        path: "/tweet/:id",
        element: <TweetDetails />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Regsiter />,
  },
]);

export default router;
