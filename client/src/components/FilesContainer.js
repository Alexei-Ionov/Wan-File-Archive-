import React, { useEffect } from 'react';
import FileMetadata from '../components/FileMetadata';
import { useAnimate, usePresence } from 'framer-motion';

function FilesContainer({ files, ownerRating, setOwnerRating }) {
  // const [isPresent, safeToRemove] = usePresence();
  // const [scope, animate] = useAnimate();

  // useEffect(() => {
  //   const animateFiles = async () => {
  //     if (isPresent) {
  //       // Animate container enter
  //       await animate(scope.current, { opacity: 1 });
  //       for (let i = 0; i < files.length; i++) {
  //         await animate(files[i].fileid.toString(), { opacity: [0,1] }, { duration: 1, delay: 1000 * i });
  //       }
  //       // Animate each FileMetadata component
  //       // files.forEach((file, index) => {
  //       //   animate(file.fileid.toString(), { opacity: 1 }, { duration: 0.5, delay: 0.2 * index });
  //       // });
  //     } else {
  //       // Animate each FileMetadata component on exit
  //       // files.forEach((file) => {
  //       //   animate(file.fileid.toString(), { opacity: 0, x: -100 });
  //       // });
  //       for (let i = 0; i < files.length; i++) {
  //         await animate(files[i].fileid.toString(), { opacity: 0 }, { duration: 0.5, delay: 0.2 * i });
  //       }

  //       // Animate container exit
  //       await animate(scope.current, { opacity: 0 });
  //       safeToRemove();
  //     }
  //   };

  //   animateFiles();
  // }, [isPresent]);

  return (
    <div  style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#f9f9f9',
      padding: '20px',
    }}>
      {files.map((file) => (
        <FileMetadata
          key={file.fileid}
          id={file.fileid.toString()} // Assign the fileid as a unique ID
          file={file}
          ownerRating={ownerRating}
          setOwnerRating={setOwnerRating}
        />
      ))}
    </div>
  );
}

export default FilesContainer;
