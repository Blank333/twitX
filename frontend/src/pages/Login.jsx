import { toast } from "react-toastify";
import Authentication from "../components/Authentication";
import axios from "axios";
import { useState } from "react";

function Login() {
  const [loading, setLoading] = useState(false);

  const handleLogin = (formInfo) => {
    if (!formInfo.username || !formInfo.password) return toast.error("Please check form fields again!");

    setLoading(true);
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
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className='vh-100 d-flex justify-content-center align-items-center bg-secondary-subtle'>
      <Authentication sideMessage='Welcome Back' action='Login' handleAction={handleLogin} loading={loading} />
    </div>
  );
}

export default Login;
