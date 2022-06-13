import './UploadFileModal.scss';
import Modal from 'react-modal';
import DeleteIcon from '../../Images/Delete-icon.svg';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadImage } from '../../API/Endpoints/ImageController';
import ModalHeader from '../../Common/ModalHeader/ModalHeader';
import Button from '@mui/material/Button';
import { RotatingLines } from 'react-loader-spinner';

interface IUploadFileModal {
  showModal: boolean;
  handleCloseModal: () => void;
  setRefreshImages: React.Dispatch<React.SetStateAction<boolean>>;
}

const UploadFileModal = ({
  showModal,
  handleCloseModal,
  setRefreshImages,
}: IUploadFileModal) => {
  const [myFiles, setMyFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const onDrop = useCallback(
    (acceptedFiles) => {
      setMyFiles([...myFiles, ...acceptedFiles]);
    },
    [myFiles]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxSize: 10485760,
  });

  const removeFile = (file: File) => {
    const newFiles = [...myFiles];
    newFiles.splice(newFiles.indexOf(file), 1);
    setMyFiles(newFiles);
  };

  const uploadFiles = async () => {
    setIsUploading(true);

    await Promise.all(
      myFiles.map(async (fileToUpload) => {
        const formData = new FormData();
        formData.append('imageFile', fileToUpload);
        formData.append('title', fileToUpload.name);
        uploadImage(formData);
      })
    ).then(() => {
      setMyFiles([]);
      setIsUploading(false);
      setRefreshImages(true);
      handleCloseModal();
    });
  };

  return (
    <Modal
      isOpen={showModal}
      onRequestClose={handleCloseModal}
      className='upload-file-modal__modal'
      overlayClassName='upload-file-modal__overlay'
      ariaHideApp={false}
    >
      <div className='upload-file-modal__wrapper'>
        <div>
          <ModalHeader
            title='Upload file'
            handleCloseModal={handleCloseModal}
          />
          <div {...getRootProps({ className: 'upload-file-modal__dropzone' })}>
            <input {...getInputProps()} />
            {isUploading ? (
              <RotatingLines width='100' strokeColor='blue' />
            ) : (
              <p>Drag and drop files or select files</p>
            )}
          </div>
          <p className='upload-file-modal__files-text'>Files:</p>
          <br />
          {myFiles.map((file, index) => {
            return (
              <div className='upload-file-modal__file-wrapper' key={index}>
                <span>{file.name}</span>
                <img
                  src={DeleteIcon}
                  alt='Delete icon'
                  className='upload-file-modal_delete-icon'
                  onClick={() => removeFile(file)}
                ></img>
              </div>
            );
          })}
        </div>
        <div className='upload-file-modal__buttons--wrapper'>
          <Button
            variant='contained'
            onClick={handleCloseModal}
            style={{ marginRight: '20px' }}
          >
            Cancel
          </Button>
          <Button variant='contained' onClick={uploadFiles}>
            Upload
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UploadFileModal;
