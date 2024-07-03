import React, { useState } from 'react';
import ClassSelection from '../components/ClassSelection';
import FilesContainer from '../components/FilesContainer';
function Content() {
    const [files, setFiles] = useState([]);
    const [commentLoading, setCommentLoading] = useState(false);
    return (
        <div>
            <h1>Content</h1>
            <ClassSelection setFiles={setFiles} />
            <br></br>
            {commentLoading && <h3>Comments Loading...</h3>}
            <FilesContainer files = {files} ownerRating= {null} setOwnerRating = {null} setCommentLoading={setCommentLoading}/>
        </div>
    );
};

export default Content;