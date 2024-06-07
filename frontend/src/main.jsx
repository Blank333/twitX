import ReactDOM from "react-dom/client";
import router from "./router.jsx";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(<RouterProvider router={router} />);
