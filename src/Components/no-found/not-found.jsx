import React from "react";
import { Link } from "react-router-dom";
import "./not-found.css";
const scarecrow = "../../assets/Scarecrow.png";
const NotFound = () => {
  return (
    <div className="wrapper">
      <div className="image-container">
        <img src={scarecrow} alt="scarecrow" />
      </div>
      <div className="content">
        <h1>Uh OoH</h1>
        <p>
          The page you are looking for might be removed or is temporarily
          unavailable.
        </p>
        <Link className="button" to="/">
          Back to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
