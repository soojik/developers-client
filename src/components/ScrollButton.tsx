import React from "react";

const ScrollToTopButton = () => {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={handleClick}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        padding: "10px",
        borderRadius: "5px", // 변경된 부분
        backgroundColor: "#87CEEB",
        color: "white",
        border: "none",
        boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
        cursor: "pointer",
      }}
    >
      ↑
    </button>
  );
};

export default ScrollToTopButton;
