import React from "react";

const App = () => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      backgroundColor: "#0f172a",
      color: "#fff",
      fontFamily: "system-ui, -apple-system, sans-serif",
      padding: "20px",
    }}>
      <div style={{ maxWidth: "600px", textAlign: "center" }}>
        <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>
          ✅ DB Query Generator
        </h1>
        <p style={{ fontSize: "18px", marginBottom: "30px", opacity: 0.9 }}>
          Your React + TypeScript application is running successfully!
        </p>
        
        <div style={{
          backgroundColor: "#1e293b",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "30px",
          textAlign: "left",
        }}>
          <h2 style={{ marginTop: 0 }}>🎉 Status:</h2>
          <ul style={{ margin: "10px 0", paddingLeft: "20px" }}>
            <li>✅ Build successful</li>
            <li>✅ Server running</li>
            <li>✅ React loaded</li>
            <li>✅ App rendering</li>
          </ul>
        </div>

        <div style={{
          backgroundColor: "#1e293b",
          padding: "20px",
          borderRadius: "8px",
          textAlign: "left",
        }}>
          <h2 style={{ marginTop: 0 }}>📱 Project Info:</h2>
          <p><strong>Name:</strong> DB Query Generator</p>
          <p><strong>Framework:</strong> React 18 + TypeScript</p>
          <p><strong>Build Tool:</strong> Vite</p>
          <p><strong>Styling:</strong> TailwindCSS</p>
          <p><strong>Repository:</strong> https://github.com/racqediyo1-pixel/DB-QUERY-GENERATOR</p>
        </div>

        <p style={{ marginTop: "40px", opacity: 0.7, fontSize: "14px" }}>
          🚀 Your app is ready. You can now develop your DB Query Generator features!
        </p>
      </div>
    </div>
  );
};

export default App;
