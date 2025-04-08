function LoadingIndicator() {
    return (
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "rgba(255, 255, 255, 0.8)",
          padding: "20px",
          borderRadius: "5px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
          zIndex: 1000,
        }}
      >
        <h3>Loading data...</h3>
        <p>Please wait while we fetch the accident data.</p>
      </div>
    )
  }
  
  export default LoadingIndicator
  
  