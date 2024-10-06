import { useNavigate } from "react-router-dom";
export const Appbar = () => {
  const navigate = useNavigate();
  return (
    <div className="shadow h-14 flex justify-between">
      <div
        className="flex flex-col justify-center h-full ml-4 cursor-pointer"
        onClick={() => {
          navigate("/dashboard");
        }}
      >
        Doctor's portal
      </div>
      <div className="flex">
        <button
          className="flex flex-col justify-center h-full mr-4"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/signin");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};
