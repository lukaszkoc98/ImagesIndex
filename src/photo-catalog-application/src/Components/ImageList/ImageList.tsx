import { useState } from "react";
import Button from "../../Common/Button/Button";
import ImageItem from "../ImageItem/ImageItem";
import UploadFileModal from "../UploadFileModal/UploadFileModal";
import "./ImageList.scss";

const ImageList = () => {
  const [showUploadFileModal, setShowUploadFileModal] =
    useState<boolean>(false);

  return (
    <>
      <UploadFileModal
        showModal={showUploadFileModal}
        handleCloseModal={() => setShowUploadFileModal(false)}
      />
      <div>
        <div className="image-list__header">
          <Button
            text="Upload file"
            onClick={() => {
              setShowUploadFileModal(true);
            }}
          />
        </div>
        <ImageItem />
      </div>
    </>
  );
};

export default ImageList;
