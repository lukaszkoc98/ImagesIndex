import { useState } from "react";
import PreviewModal from "../PreviewModal/PreviewModal";
import "./ImageItem.scss";

const ImageItem = () => {
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);

  return (
    <div>
      {showPreviewModal && (
        <PreviewModal
          showModal={showPreviewModal}
          handleCloseModal={() => {
            setShowPreviewModal(false);
            console.log("yes");
          }}
        />
      )}
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Sunflower_from_Silesia2.jpg/1200px-Sunflower_from_Silesia2.jpg"
        alt="something"
        className="image-item__image"
        onClick={() => setShowPreviewModal(true)}
      />
    </div>
  );
};

export default ImageItem;
