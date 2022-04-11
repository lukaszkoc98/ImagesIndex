import "./UploadFileModal.scss";
import Modal from "react-modal";
import CancelIcon from "../../Images/Cancel-icon.svg";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { maxFileSizeInBytes } from "../../Constants/FileConstants";
import Button from "../../Common/Button/Button";

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
    accept: [],
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
        formData.append("formFile", fileToUpload);
        formData.append("fileName", fileToUpload.name);
        console.log(formData);
      })
    ).then(() => {
      handleCloseModal();
      setIsUploading(false);
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
      <div className="upload-file-modal__header">
        <span>Upload File</span>
        <img src={CancelIcon} alt="Cancel icon" onClick={handleCloseModal} />
      </div>
      <div {...getRootProps({ className: "upload-file-modal__dropzone" })}>
        <input {...getInputProps()} />
        Drag and drop files or select files
      </div>
      <div className="upload-file-modal__buttons--wrapper">
        <Button text="Cancel" onClick={handleCloseModal} />
        <Button text="Upload" onClick={() => {}} />
      </div>
    </Modal>
  );
};

export default UploadFileModal;
