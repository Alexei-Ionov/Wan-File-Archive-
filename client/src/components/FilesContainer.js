import React, { useState, useEffect } from 'react';
import FileMetadata from '../components/FileMetadata';
import CommentContainer from './CommentContainer';
function FilesContainer({ files, ownerRating, setOwnerRating, setCommentLoading}) {
  /* active file is one where user has clicked to see the comments! */
  const [activeFiles, setActiveFiles] = useState([]);
  /* garuntees that files is fully loaded */
  useEffect(()=> {
    if (files && files.length) {
      const temp_files = new Array(files.length).fill(null).map(() => []);
      setActiveFiles(temp_files);
    }
  },[files]);
  return (
    <div  style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#f9f9f9',
      padding: '20px',
    }}>
      {files.map((file, index) => (
        
        <div key={file.fileid} style={{ marginBottom: '20px', width: '100%' }}>
          <FileMetadata
            file={file}
            ownerRating={ownerRating}
            setOwnerRating={setOwnerRating}
            setCommentLoading={setCommentLoading}
            activeFiles={activeFiles}
            setActiveFiles={setActiveFiles}
            index={index}
          />
          {activeFiles[index] && activeFiles[index].length !== 0  && (
            <CommentContainer comments={activeFiles[index]} />
          )}
        </div>
      ))}
    </div>
  );
}

export default FilesContainer;
