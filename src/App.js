import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { useSearchParams } from "react-router-dom";

function App() {
  const [params] = useSearchParams();
  const token = params.get("token");

  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState({});

  const toggleSection = (section) => {
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokenDoc = await getDoc(doc(db, "shareTokens", token));
        if (!tokenDoc.exists()) {
          setError("Invalid or expired token.");
          return;
        }

        const { userId } = tokenDoc.data();
        const subcollections = [
          "prescriptions",
          "doctorVisits",
          "temperature",
          "allergies",
          "bloodGlucose",
          "labResults",
          "radiology",
          "heartRate",
          "bloodPressure",
          "vitalSigns",
        ];

        const fetchedData = {};
        for (let sub of subcollections) {
          const subRef = collection(db, "users", userId, sub);
          const snapshot = await getDocs(subRef);
          if (!snapshot.empty) {
            fetchedData[sub] = snapshot.docs.map((doc) => doc.data());
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

  if (error) return <p className="error">{error}</p>;

  const renderSection = (title, key, contentFn) => {
    if (!data[key] || data[key].length === 0) return null;
    return (
      <div className="section">
        <div className="section-title" onClick={() => toggleSection(key)}>
          {title}
        </div>
        <div className={`section-content ${expanded[key] ? "open" : ""}`}>
          <ul>{data[key].map(contentFn)}</ul>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <style>{`
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f5f7fa;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
          background-color: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        h1 {
          text-align: center;
          color: #2c3e50;
          margin-bottom: 30px;
        }
        .section {
          margin-top: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
        }
        .section-title {
          background-color: #3498db;
          color: white;
          padding: 14px 20px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
        }
        .section-content {
          padding: 15px 20px;
          background-color: #fafafa;
          display: none;
        }
        .section-content.open {
          display: block;
        }
        ul {
          list-style: none;
          padding-left: 0;
        }
        li {
          background-color: #fff;
          margin-bottom: 10px;
          padding: 10px 15px;
          border-radius: 6px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        img {
          max-width: 100%;
          margin-top: 10px;
          border-radius: 6px;
        }
      `}</style>

      <h1>Medical Summary</h1>

      {renderSection("Blood Glucose", "bloodGlucose", (b, i) => (
        <li key={i}>
        Date: {new Date(b.date).toLocaleDateString()} <br />
          Glucose Level: {b.glucoseLevel} <br />
          Type: {b.measurementType} <br />
          Notes: {b.notes}
        </li>
      ))}

      {renderSection("Temperature", "temperature", (t, i) => (
        <li key={i}>
        Date: {new Date(t.date).toLocaleDateString()} <br />
          Temperature: {t.temperature}°C <br />
          Notes: {t.notes}
        </li>
      ))}

      {renderSection("Heart Rate", "heartRate", (hr, i) => (
        <li key={i}>
        Date: {new Date(hr.date).toLocaleDateString()} <br />
          Heart Rate: {hr.heartRate} bpm <br />
          Notes: {hr.notes}
        </li>
      ))}

      {renderSection("Blood Pressure", "bloodPressure", (bp, i) => (
        <li key={i}>
        Date: {new Date(bp.date).toLocaleDateString()} <br />
          Systolic: {bp.systolic}, Diastolic: {bp.diastolic}, Pulse:{" "}
          {bp.pulse} <br />
          Classification: {bp.classification} <br />
          Notes: {bp.notes}
        </li>
      ))}

      {renderSection("Blood pressure", "vitalSigns", (vs, i) => (
  <li key={i}>
  Date: {new Date(vs.date).toLocaleDateString()} <br />
    Systolic: {vs.systolic} <br />
    Diastolic: {vs.diastolic} <br />
    Pulse: {vs.pulse} <br />
    Notes: {vs.notes}
    <br />
  </li>
))}

      {renderSection("Allergies", "allergies", (a, i) => (
       <li key={i}>
       Allergen: {a.title} <br />
       Items: {a.items?.join(", ")}
       </li>
    ))}

      {renderSection("Lab Results", "labResults", (lr, i) => (
       <li key={i}>
       {lr.results.map((r, idx) => (
         <div key={idx}>
        Date: {r.date} <br />
        Test: {r.test} <br />
        Result: {r.result}
        <br />
      </div>
    ))}
  </li>
))}

      {renderSection("Radiology", "radiology", (r, i) => (
        <li key={i}>
          Scan Type: {r.scanType} <br />
          Date: {r.date} <br />
          Notes: {r.notes} <br />
          {r.imageUrl && <img src={r.imageUrl} alt="Radiology" />}
        </li>
      ))}

      {renderSection("Prescriptions", "prescriptions", (p, i) => (
        <li key={i}>
          Medicines: {p.medicines?.join(", ")} <br />
          Notes: {p.notes} <br />
          Date: {p.date}
        </li>
      ))}

      {renderSection("Doctor Visits", "doctorVisits", (v, i) => (
      <li key={i}>
        Date: {v.visitDate} <br />
       Doctor: {v.doctorName} <br />
       Diagnosis: {v.diagnosis} <br />
       Notes: {v.notes}
  </li>
))}
    </div>
  );
}

export default App;
