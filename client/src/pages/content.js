import React, { useState } from 'react';
import ClassSelection from '../components/ClassSelection';
import FilesContainer from '../components/FilesContainer';
function Content() {
    const [files, setFiles] = useState([]);
    return (
        <div>
            <h1>Content</h1>
            <ClassSelection setFiles={setFiles}/>
            <br></br>
            <FilesContainer files ={files}/>
        </div>
    );
};

export default Content;