import "./UploadFileModal.scss";
import Modal from "react-modal";
import DeleteIcon from "../../Images/Delete-icon.svg";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Button from "../../Common/Button/Button";
import { uploadImage } from "../../API/Endpoints/ImageController";
import ModalHeader from "../../Common/ModalHeader/ModalHeader";

interface IUploadFileModal {
  showModal: boolean;
  handleCloseModal: () => void;
}

const UploadFileModal = ({ showModal, handleCloseModal }: IUploadFileModal) => {
  const [myFiles, setMyFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const onDrop = useCallback(
    (acceptedFiles) => {
      setMyFiles([...myFiles, ...acceptedFiles]);
    },
    [myFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
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
        formData.append("imageFile", fileToUpload);
        formData.append("title", fileToUpload.name);
        uploadImage(formData);
      })
    ).then(() => {
      setMyFiles([]);
      setIsUploading(false);
      handleCloseModal();
    });
  };

  return (
    <Modal
      isOpen={showModal}
      onRequestClose={handleCloseModal}
      className="upload-file-modal__modal"
      overlayClassName="upload-file-modal__overlay"
      ariaHideApp={false}
    >
      <ModalHeader title="Upload file" handleCloseModal={handleCloseModal} />
      <div {...getRootProps({ className: "upload-file-modal__dropzone" })}>
        <input {...getInputProps()} />
        Drag and drop files or select files
      </div>
      <span>Files:</span>
      <br />
      {myFiles.map((file, index) => {
        return (
          <div className="upload-file-modal__file-wrapper" key={index}>
            <span>{file.name}</span>;
            <img
              src={DeleteIcon}
              alt="Delete icon"
              className="upload-file-modal_delete-icon"
              onClick={() => removeFile(file)}
            ></img>
          </div>
        );
      })}
      <div className="upload-file-modal__buttons--wrapper">
        <Button text="Cancel" onClick={handleCloseModal} />
        <Button text="Upload" onClick={uploadFiles} isLoading={isUploading} />
      </div>
    </Modal>
  );
};

export default UploadFileModal;
