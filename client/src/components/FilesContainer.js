import React from 'react';
import FileMetadata from '../components/FileMetadata';
function FilesContainer({ files, ownerRating, setOwnerRating, setCommentLoading}) {
  return (
    <div  style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#f9f9f9',
      padding: '20px',
    }}>
      {files.map((file) => (
        
        <div key={file.fileid} style={{ marginBottom: '20px', width: '100%' }}>
          <FileMetadata
            file={file}
            ownerRating={ownerRating}
            setOwnerRating={setOwnerRating}
            setCommentLoading={setCommentLoading}
          />
        </div>
      ))}
    </div>
  );
}

export default FilesContainer;
