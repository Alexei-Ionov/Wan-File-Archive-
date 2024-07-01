import React from 'react';
import FileMetadata from '../components/FileMetadata';

function FilesContainer({ files, ownerRating, setOwnerRating }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#f9f9f9',
      padding: '20px',
    }}>
      {files.map((file, index) => (
        <FileMetadata key={index} file={file} ownerRating={ownerRating} setOwnerRating={setOwnerRating}/>
      ))}
    </div>
  );
}

export default FilesContainer;
