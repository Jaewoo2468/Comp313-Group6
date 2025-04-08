// src/components/DivisionFilter.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DivisionFilter = () => {
  const [division, setDivision] = useState('');
  const [results, setResults] = useState([]);

  const divisions = ['11', '14', '22', '31', '32', '41', '51']; // Customize this list

  useEffect(() => {
    const fetchData = async () => {
      if (!division) return;

      try {
        const response = await axios.get(`http://localhost:8080/api/homicide?division=${division}`);
        setResults(response.data);
      } catch (error) {
        console.error('Error fetching homicide data:', error);
      }
    };

    fetchData();
  }, [division]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Filter by Police Division</h2>

      <select value={division} onChange={(e) => setDivision(e.target.value)}>
        <option value="">Select Division</option>
        {divisions.map((div) => (
          <option key={div} value={div}>Division {div}</option>
        ))}
      </select>

      {division && (
        <div style={{ marginTop: '20px' }}>
          <h3>Results for Division {division}:</h3>
          {results.length === 0 ? (
            <p>No incidents found.</p>
          ) : (
            <ul>
              {results.map((item, index) => (
                <li key={index}>
                  <strong>Date:</strong> {item.OCC_DATE} | <strong>Death:</strong> {item.DEATH}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default DivisionFilter;
