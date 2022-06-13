import ModalHeader from '../../Common/ModalHeader/ModalHeader';
import Modal from 'react-modal';
import './MapModal.scss';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ImageLocalizationDto } from '../../API/Models/ImageLocalizationDto';

interface IMapModal {
  showModal: boolean;
  handleCloseModal: () => void;
  imagesLocalization: ImageLocalizationDto[];
}

const MapModal = ({
  showModal,
  handleCloseModal,
  imagesLocalization,
}: IMapModal) => {
  return (
    <Modal
      isOpen={showModal}
      onRequestClose={handleCloseModal}
      className='map-modal__modal'
      overlayClassName='map-modal__overlay'
      ariaHideApp={false}
    >
      <ModalHeader title='Map' handleCloseModal={handleCloseModal} />
      <div className='map-modal__map-wrapper'>
        <MapContainer
          center={[50.28233, 18.667]}
          zoom={6}
          scrollWheelZoom={false}
          style={{ height: `100%`, width: `100%` }}
        >
          <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
          {imagesLocalization.map((marker, index) => {
            return (
              <Marker
                position={[marker.latitude, marker.longitude]}
                key={index}
              >
                <Popup>{marker.name}</Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </Modal>
  );
};

export default MapModal;
