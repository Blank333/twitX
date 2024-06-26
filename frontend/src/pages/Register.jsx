import axios from "axios";
import Authentication from "../components/Authentication";
import { toast } from "react-toastify";
import { useState } from "react";

function Regsiter() {
  const [loading, setLoading] = useState(false);

  const handleRegister = (formInfo) => {
    if (!formInfo.username || !formInfo.password || !formInfo.name || !formInfo.email)
      return toast.error("Please check form fields again!");

    setLoading(true);
    axios
      .post(`${import.meta.env.VITE_API_URL}/auth/register`, formInfo)
      .then((res) => {
        toast.success(res.data.message);
        setTimeout(() => {
          window.location.href = `/login?username=${res.data.username}`;
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
      <Authentication action='Register' sideMessage='Join Us' handleAction={handleRegister} loading={loading} />
    </div>
  );
}
export default Regsiter;
