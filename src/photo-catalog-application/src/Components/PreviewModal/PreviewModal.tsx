import "./PreviewModal.scss";
import Modal from "react-modal";
import CancelIcon from "../../Images/Cancel-icon.svg";

interface IPreviewModal {
  showModal: boolean;
  handleCloseModal: () => void;
}

const PreviewModal = ({ showModal, handleCloseModal }: IPreviewModal) => {
  return (
    <Modal
      isOpen={showModal}
      onRequestClose={handleCloseModal}
      className="preview-modal__modal"
      overlayClassName="preview-modal__overlay"
    >
      <div className="preview-modal__header">
        <img src={CancelIcon} alt="Cancel icon" onClick={handleCloseModal} />
      </div>
      <div className="preview-modal__image-and-map--wrapper">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Sunflower_from_Silesia2.jpg/1200px-Sunflower_from_Silesia2.jpg"
          alt="something"
          className="preview-modal__image"
        />
        <span className="preview-modal__map--wrapper">map</span>
      </div>
      <div className="preview-modal__details">details</div>
    </Modal>
  );
};

export default PreviewModal;
