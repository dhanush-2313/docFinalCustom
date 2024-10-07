import { useEffect, useState } from "react";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { doctorNameState, passwordState } from "../store/atoms";
const BACKENDURL = import.meta.env.VITE_BACKEND_URL;

export default function Signin() {
  const [name, setName] = useRecoilState(doctorNameState);
  const [password, setPassword] = useRecoilState(passwordState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const nameResponse = await axios.get(`${BACKENDURL}/doctor/info`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        if (nameResponse.data.name) navigate("/dashboard");
      } catch (error) {
        console.error("Error fetching data:", error);
        setName("");
      }
    };

    fetchData();
  }, []);

  const navigate = useNavigate();
  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign in"} />
          <SubHeading label={"Enter your credentials to access your account"} />
          <InputBox
            placeholder="name"
            label={"name"}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setName(e.target.value);
            }}
          />
          <InputBox
            placeholder="123456"
            type="password"
            label={"Password"}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
            }}
          />
          <div className="pt-4">
            <Button
              label={"Sign in"}
              onClick={async () => {
                try {
                  if (!name || !password) {
                    setError("All fields are required.");
                    setTimeout(() => setError(null), 3000); // Use setTimeout instead of setInterval
                    return;
                  }
                  setLoading(true);
                  const response = await axios.post(
                    `${BACKENDURL}/doctor/login`,
                    {
                      name,
                      password,
                    }
                  );
                  localStorage.setItem("token", response.data.token);
                  navigate("/dashboard");
                } catch (error) {
                  setError("An error occurred. Please try again.");
                } finally {
                  setLoading(false);
                }
              }}
            />
          </div>
          {loading && <div className="text-black">Loading...</div>}
          {error && <div className="text-red-500">{error}</div>}

          {/* <BottomWarning
            label={"Don't have an account?"}
            buttonText={"Sign up"}
            to={"/signup"}
          /> */}
        </div>
      </div>
    </div>
  );
}
