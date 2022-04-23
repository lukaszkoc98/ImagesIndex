import "./PreviewModal.scss";
import Modal from "react-modal";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ModalHeader from "../../Common/ModalHeader/ModalHeader";
import DraggableMarker from "./DraggableMarker";
import { useState } from "react";

interface Localization {
  lat: number;
  lng: number;
}

interface IPreviewModal {
  showModal: boolean;
  handleCloseModal: () => void;
}

const PreviewModal = ({ showModal, handleCloseModal }: IPreviewModal) => {
  const [localization, setLocalization] = useState<Localization | null>(null);
  return (
    <Modal
      isOpen={showModal}
      onRequestClose={handleCloseModal}
      className="preview-modal__modal"
      overlayClassName="preview-modal__overlay"
      ariaHideApp={false}
    >
      <ModalHeader title="Image details" handleCloseModal={handleCloseModal} />
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
            {localization && (
              <>
                <DraggableMarker />
                <Marker position={[50.28233, 18.688]}>
                  <Popup>Marker1</Popup>
                </Marker>
              </>
            )}
          </MapContainer>
        </span>
      </div>
      <div className="preview-modal__details">details</div>
    </Modal>
  );
};

export default PreviewModal;
