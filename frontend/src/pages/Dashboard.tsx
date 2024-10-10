import { useEffect } from "react";
import { Appbar } from "../components/Appbar";
import { WelcomeMessage } from "../components/WelcomeMessage";
import { Patients } from "../components/Patients";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { doctorNameState } from "../store/atoms";
const BACKENDURL = import.meta.env.VITE_BACKEND_URL;

const Dashboard = () => {
  const [name, setName] = useRecoilState(doctorNameState);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setTimeout(() => navigate("/signin"), 1000);
        return;
      }

      try {
        const response = await axios.get(`${BACKENDURL}/doctor/info`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        setName(response.data.name);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token, navigate]);

  if (!token) {
    return (
      <>
        <h1>Login/Signup first</h1>
        <h2>Redirecting you to signin page...</h2>
      </>
    );
  }

  return (
    <>
      <Appbar />
      <div className="m-8">
        <WelcomeMessage name={name.toUpperCase()} />
        <Patients />
      </div>
    </>
  );
};

export default Dashboard;
