import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const BACKENDURL = import.meta.env.VITE_BACKEND_URL;

export const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [filter, setFilter] = useState("");
  const [debouncedFilter, setDebouncedFilter] = useState(filter);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilter(filter);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [filter]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(
          `${BACKENDURL}/patient/bulk?filter=${debouncedFilter}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        setPatients(response.data.Patients);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, [debouncedFilter]);

  return (
    <>
      <div className="flex justify-between ">
        <div className="font-bold mt-6 text-lg">Patients</div>
        <button
          type="button"
          className="mt-4 text-lg bg-black text-white rounded-lg p-1 "
          onClick={() => {
            navigate("/addpatient");
          }}
        >
          Add new
        </button>
      </div>
      <div className="my-2">
        <input
          type="text"
          placeholder="Search patients..."
          className="w-full px-2 py-1 border rounded border-slate-200"
          onChange={(e) => {
            setFilter(e.target.value);
          }}
        ></input>
      </div>
      <div>
        {patients.map((patient, index) => (
          <Patient patient={patient} key={index} />
        ))}
      </div>
    </>
  );
};

function Patient({ patient }: any) {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between ">
      <div
        className="flex cursor-pointer"
        onClick={() => {
          navigate(`/patient/${patient._id}`);
        }}
      >
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
          <div className="flex flex-col justify-center h-full text-xl">
            {patient.name[0]}
          </div>
        </div>
        <div className="flex flex-col justify-center h-ful">
          <div>
            <span>{patient._id}</span>
            &nbsp;&nbsp; <span>{patient.name.toUpperCase()}</span>
            &nbsp; &nbsp;<span>Age:{patient.age}</span>
          </div>
        </div>
      </div>

      {/* <div className="flex flex-col justify-center h-ful">
        <Button
          label={"Send Money"}
          onClick={() => {
            navigate("/send?id=" + user._id + "&name=" + user.firstName);
          }}
        />
      </div> */}
    </div>
  );
}
