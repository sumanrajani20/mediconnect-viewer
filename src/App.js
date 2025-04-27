import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { useSearchParams } from "react-router-dom";

function App() {
  const [params] = useSearchParams();
  const token = params.get("token");

  const [data, setData] = useState({
    prescriptions: [],
    doctorVisits: [],
    temperatures: [],
    allergies: [],
    bloodGlucose: [],
    labResults: [],
    radiology: [],
    heartRate: [],
    vitalSigns: [],
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokenDoc = await getDoc(doc(db, "shareTokens", token));
        if (!tokenDoc.exists()) {
          setError("Invalid or expired token.");
          return;
        }

        const { userId } = tokenDoc.data();
        
        // List of possible subcollections
        const subcollections = [
          "prescriptions",
          "doctorVisits",
          "temperature",
          "allergies",
          "bloodGlucose",
          "labResults",
          "radiology",
          "heartRate",
          "vitalSigns",
        ];

        // Fetch all subcollections and their data
        const fetchedData = {};
        for (let subcollection of subcollections) {
          const subRef = collection(db, "users", userId, subcollection);
          const snapshot = await getDocs(subRef);

          // If there is data, save it in the fetchedData object
          if (!snapshot.empty) {
            fetchedData[subcollection] = snapshot.docs.map(doc => doc.data());
          }
        }

        setData(fetchedData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("An error occurred while fetching data.");
      }
    };

    if (token) fetchData();
  }, [token]);

  if (error) return <p>{error}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Medical Summary</h1>
      {data.doctorVisits && data.doctorVisits.length > 0 && (
        <div>
          <h2>Doctor Visits</h2>
          <ul>
            {data.doctorVisits.map((v, idx) => (
              <li key={idx}>
                {v.date} - {v.doctorName}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Render Prescriptions */}
      {data.prescriptions && data.prescriptions.length > 0 && (
        <div>
          <h2>Prescriptions</h2>
          <ul>
            {data.prescriptions.map((p, idx) => (
              <li key={idx}>
                {p.medicineName} - {p.dosage}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Render Doctor Visits */}


      {/* Render Temperatures */}
      {data.temperature && data.temperature.length > 0 && (
        <div>
          <h2>Temperature</h2>
          <ul>
            {data.temperature.map((t, idx) => (
              <li key={idx}>{t.temperature}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Render Allergies */}
      {data.allergies && data.allergies.length > 0 && (
        <div>
          <h2>Allergies</h2>
          <ul>
            {data.allergies.map((a, idx) => (
              <li key={idx}>{JSON.stringify(a)}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Render Blood Glucose */}
      {data.bloodGlucose && data.bloodGlucose.length > 0 && (
        <div>
          <h2>Blood Glucose</h2>
          <ul>
            {data.bloodGlucose.map((b, idx) => (
              <li key={idx}>{b.level}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Render Lab Results */}
      {data.labResults && data.labResults.length > 0 && (
        <div>
          <h2>Lab Results</h2>
          <ul>
            {data.labResults.map((lr, idx) => (
              <li key={idx}>{lr.result}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Render Radiology */}
      {data.radiology && data.radiology.length > 0 && (
        <div>
          <h2>Radiology</h2>
          <ul>
            {data.radiology.map((r, idx) => (
              <li key={idx}>{r.imageUrl}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Render Heart Rate */}
      {data.heartRate && data.heartRate.length > 0 && (
        <div>
          <h2>Heart Rate</h2>
          <ul>
            {data.heartRate.map((hr, idx) => (
              <li key={idx}>{hr.bpm}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Render Vital Signs */}
      {data.vitalSigns && data.vitalSigns.length > 0 && (
        <div>
          <h2>Vital Signs</h2>
          <ul>
            {data.vitalSigns.map((vs, idx) => (
              <li key={idx}>{vs.name}: {vs.value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
