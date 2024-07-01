import React, { useState } from 'react';
import ClassSelection from '../components/ClassSelection';
import FilesContainer from '../components/FilesContainer';
function Content() {
    const [files, setFiles] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    return (
        <div>
            <h1>Content</h1>
            <ClassSelection setFiles={setFiles} pageNumber = {pageNumber}/>
            <br></br>
            <FilesContainer files ={files}/>
        </div>
    );
};

export default Content;