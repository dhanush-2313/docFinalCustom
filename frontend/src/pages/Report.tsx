import { useLocation, useNavigate } from "react-router-dom";

const Report = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { report, patientDetails } = location.state || {};

  return (
    <div className="report-container bg-white p-4 rounded-md shadow-md">
      <style>
        {`
          @media print {
            .no-print {
              display: none;
            }
            @page {
              margin: 0;
            }
            body {
              margin: 1.6cm;
            }
          }
        `}
      </style>
      {report ? (
        <div className="report-content text-black">
          {/* <h2 className="text-3xl text-black font-bold mb-4">
            Report{" "}
            <img
              src="/logo.jpeg"
              alt=""
              style={{ height: "100px", width: "200px", float: "right" }}
            />
          </h2> */}

          <table className="min-w-full bg-white">
            <tbody>
              {/* <tr>
                <td className="border px-4 py-2 font-semibold">Name:</td>
                <td className="border px-4 py-2">{patientDetails?.fullName}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Age:</td>
                <td className="border px-4 py-2">{patientDetails?.age}</td>
              </tr> */}

              <tr>
                <td className="border px-4 py-2">
                  <pre className="whitespace-pre-wrap">{report}</pre>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="text-center mt-4 no-print">
            <button
              onClick={() => window.print()}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Print Report
            </button>
          </div>
          <div className="text-center mt-4 no-print">
            <button
              onClick={() => navigate("/dashboard")}
              className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Back to Home
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500">Loading report...</div>
      )}
    </div>
  );
};

export default Report;
