import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import universityData from '../data/universityData';

function ClassSelection() {
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [file, setFile] = useState(null); // State to hold the selected file
  const location = useLocation();

  const isContributePage = location.pathname === '/contribute';

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

    let response;
    try {
      if (isContributePage) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('university', selectedUniversity);
        formData.append('department', selectedDepartment);
        formData.append('class', selectedClass);
        formData.append('type', selectedType);

        response = await fetch('http://localhost:8000/contribute', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });

      } else {
        const params = new URLSearchParams({
          university: selectedUniversity,
          department: selectedDepartment,
          course_number: selectedClass,
          content_type: selectedType,
        }).toString();

        response = await fetch(`http://localhost:8000/content?${params}`, {
          method: 'GET',
          credentials: 'include',
        });
      }
      const msg = await response.text();
      if (!response.ok) {
        setErrMsg(msg);
        console.log(msg); 
      } else { 
        setSuccessMsg(msg);
        console.log(msg); 
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div>
        {errMsg && <div style={{ color: 'red' }}>{errMsg}</div>}
        {successMsg && <div style={{ color: 'green' }}>{successMsg}</div>}
        <br></br>
        <form onSubmit={handleSubmit}>
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
        <br />
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
        <br />
        <label>
            Class:
            <select value={selectedClass} onChange={handleClassChange} disabled={!selectedDepartment}>
            <option value="">Select Class</option>
            {selectedDepartment &&
              universityData
                .find((uni) => uni.university === selectedUniversity)
                ?.departments.find((dep) => dep.departmentName === selectedDepartment)
                ?.classes.map((cls) => (
                  <option key={cls.classNumber} value={cls.classNumber}>
                    {cls.classNumber}
                  </option>
                ))}
            </select>
        </label>
        <br />
        <label>
            Type:
            <select value={selectedType} onChange={handleTypeChange}>
            <option value="">Select Type</option>
            <option value="exam">Exam</option>
            <option value="cheatsheet">Cheatsheet</option>
            <option value="notes">Notes</option>
            <option value="outside source">Outside Source</option>
            </select>
        </label>
        <br />
        {isContributePage && (
            <div>
            <label>
                Upload File:
                <input type="file" onChange={handleFileChange} />
            </label>
            <br />
            </div>
        )}
        <button type="submit" disabled={!selectedUniversity || !selectedDepartment || !selectedClass || !selectedType}>
            {isContributePage ? 'Contribute' : 'Fetch Content'}
        </button>
        </form>
    </div>
  );
}

export default ClassSelection;
