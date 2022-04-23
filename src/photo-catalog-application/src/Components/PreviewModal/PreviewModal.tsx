import "./PreviewModal.scss";
import Modal from "react-modal";
import CancelIcon from "../../Images/Cancel-icon.svg";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

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
      ariaHideApp={false}
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
        <span className="preview-modal__map--wrapper">
          <MapContainer
            center={[50.28233, 18.667]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: `100%`, width: `100%` }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[50.28233, 18.667]}>
              <Popup>Marker1</Popup>
            </Marker>
            <Marker position={[50.28233, 18.688]}>
              <Popup>Marker1</Popup>
            </Marker>
          </MapContainer>
        </span>
      </div>
      <div className="preview-modal__details">details</div>
    </Modal>
  );
};

export default PreviewModal;
