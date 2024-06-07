import { toast } from "react-toastify";
import Authentication from "../components/Authentication";
import axios from "axios";

function Login() {
  const handleLogin = (formInfo) => {
    if (!formInfo.username || !formInfo.password) return toast.error("Please check form fields again!");

    axios
      .post(`${import.meta.env.VITE_API_URL}/auth/login`, formInfo)
      .then((res) => {
        toast.success(res.data.message);
        localStorage.setItem("token", res.data.token);
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      })
      .catch((err) => {
        toast.error(err.response.data.error);
      });
  };
  return (
    <div className='vh-100 d-flex justify-content-center align-items-center bg-secondary-subtle'>
      <Authentication sideMessage='Welcome Back' action='Login' handleAction={handleLogin} />;
    </div>
  );
}

export default Login;
