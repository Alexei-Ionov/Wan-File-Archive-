import React, { useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import universityData from '../data/universityData';
import { AuthContext } from './authContext';
import '../css/classSelection.css';

function ClassSelection() {
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [file, setFile] = useState(null); // State to hold the selected file
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const isContributePage = location.pathname === '/contribute';
  const reset = () =>  { 
    setFile(null);
    setSelectedClass('');
    setSelectedDepartment('');
    setSelectedType('');
    setSelectedUniversity('');
  }

  const handleUniversityChange = (event) => {
    const university = event.target.value;
    setSelectedUniversity(university);
    setSelectedDepartment('');
    setSelectedClass('');
    setSelectedType('');
  };

  const handleDepartmentChange = (event) => {
    const department = event.target.value;
    setSelectedDepartment(department);
    setSelectedClass('');
    setSelectedType('');
  };

  const handleClassChange = (event) => {
    const classVal = event.target.value;
    setSelectedClass(classVal);
    setSelectedType('');
  };

  const handleTypeChange = (event) => {
    const type = event.target.value;
    setSelectedType(type);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSuccessMsg('');
    setErrMsg('');

    if (!user) {
      isContributePage ? setErrMsg('Please login to contribute!') : setErrMsg('Please login to see content!');
      return;
    }

    try {
      if (isContributePage) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('university', selectedUniversity);
        formData.append('department', selectedDepartment);
        formData.append('course_number', selectedClass);
        formData.append('content_type', selectedType);

        const response = await fetch('http://localhost:8000/contribute', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        reset();

        const message = await response.text();
        if (!response.ok) {
          setErrMsg(message);
          console.log(message);
          return;
        }
        setSuccessMsg(message);
      } else {
        const params = new URLSearchParams({
          university: selectedUniversity,
          department: selectedDepartment,
          course_number: selectedClass,
          content_type: selectedType,
        }).toString();

        const response = await fetch(`http://localhost:8000/content?${params}`, {
          method: 'GET',
          credentials: 'include',
        });
        reset();

        if (!response.ok) {
          const message = await response.text();
          setErrMsg(message);
          console.log(message);
          return;
        }
        const files = await response.json();
        console.log(files);
      }
    } catch (error) {
      reset();
      console.error('Error:', error.message);
    }
  };

  return (
    <div>
      {errMsg && <div style={{ color: 'red' }}>{errMsg}</div>}
      {successMsg && <div style={{ color: 'green' }}>{successMsg}</div>}
      <br />
      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <label>
            University:
            <select value={selectedUniversity} onChange={handleUniversityChange}>
              <option value="">Select University</option>
              {universityData.map((uni) => (
                <option key={uni.university} value={uni.university}>
                  {uni.university}
                </option>
              ))}
            </select>
          </label>
          <label>
            Department:
            <select value={selectedDepartment} onChange={handleDepartmentChange} disabled={!selectedUniversity}>
              <option value="">Select Department</option>
              {selectedUniversity &&
                universityData
                  .find((uni) => uni.university === selectedUniversity)
                  ?.departments.map((dep) => (
                    <option key={dep.departmentName} value={dep.departmentName}>
                      {dep.departmentName}
                    </option>
                  ))}
            </select>
          </label>
          <label>
            Class:
            <select value={selectedClass} onChange={handleClassChange} disabled={!selectedDepartment}>
              <option value="">Select Class</option>
              {selectedDepartment &&
                universityData
                  .find((uni) => uni.university === selectedUniversity)
                  ?.departments.find((dep) => dep.departmentName === selectedDepartment)
                  ?.classes.map((cls) => (
                    <option key={cls.course_number} value={cls.course_number}>
                      {cls.course_number}
                    </option>
                  ))}
            </select>
          </label>
          <label>
            Type:
            <select value={selectedType} onChange={handleTypeChange} disabled={!selectedClass}>
              <option value="">Select Type</option>
              <option value="exam">Exam</option>
              <option value="cheatsheet">Cheatsheet</option>
              <option value="notes">Notes</option>
              <option value="outside_source">Outside Source</option>
            </select>
          </label>
          {isContributePage && (
            <label>
              Upload File:
              <input type="file" onChange={handleFileChange} />
            </label>
          )}
        </div>
        <div className="button-container">
          <button type="submit" disabled={!selectedUniversity || !selectedDepartment || !selectedClass || !selectedType}>
            {isContributePage ? 'Contribute' : 'Fetch Content'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ClassSelection;
