import './PreviewModal.scss';
import Modal from 'react-modal';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import ModalHeader from '../../Common/ModalHeader/ModalHeader';
import DraggableMarker from './DraggableMarker';
import { useEffect, useState } from 'react';
import { ImageMiniatureDto } from '../../API/Models/ImageMiniatureDto';
import {
  deleteImage,
  getImage,
  updateImage,
} from '../../API/Endpoints/ImageController';
import { ImageDTO } from '../../API/Models/ImageDto';
import { UpdateImageDto } from '../../API/Models/UpdateImageDto';
import { Oval } from 'react-loader-spinner';
import toast from 'react-hot-toast';
import TextField from '@mui/material/TextField';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Button from '@mui/material/Button';
import isNullOrWhiteSpace from '../../Functions/IsNullOrEmpty';
import DialogModal from '../../Common/DialogModal/DialogModal';

interface IPreviewModal {
  showModal: boolean;
  handleCloseModal: () => void;
  imageMiniature: ImageMiniatureDto;
  setImageMiniatures: React.Dispatch<React.SetStateAction<ImageMiniatureDto[]>>;
}

const PreviewModal = ({
  showModal,
  handleCloseModal,
  imageMiniature,
  setImageMiniatures,
}: IPreviewModal) => {
  const [path, setPath] = useState<string>('');
  const [aperture, setAperture] = useState<number | null>(null);
  const [model, setModel] = useState<string>('');
  const [make, setMake] = useState<string>('');
  const [exposureTime, setExposureTime] = useState<number | null>(null);
  const [focalLength, setFocalLength] = useState<number | null>(null);
  const [flash, setFlash] = useState<number | null>(null);
  const [width, setWidth] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [isoSpeed, setIsoSpeed] = useState<number | null>(null);
  const [createDate, setCreateDate] = useState<Date | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [image, setImage] = useState<ImageDTO>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [newLatitude, setNewLatitude] = useState<number>();
  const [newLongitude, setNewLongitude] = useState<number>();

  const handleSave = () => {
    const updateImageVm: UpdateImageDto = {
      ISOSpeed: isoSpeed,
      aperture: aperture,
      createDate: createDate,
      exposureTime: exposureTime,
      flash: flash,
      focalLength: focalLength,
      height: height,
      latitude: latitude,
      longitude: longitude,
      make: make,
      model: model,
      path: path,
      width: width,
    };

    updateImage(updateImageVm)
      .then(() => {
        toast.success('Successfully update image');
      })
      .catch(() => {
        toast.error('Cannot update image. Some error ocurred');
      });
  };

  const handleDeleteImage = () => {
    deleteImage(path).then(() => {
      setImageMiniatures((prevState) =>
        prevState.filter((item) => item.path !== path)
      );
      handleCloseModal();
    });
  };

  useEffect(() => {
    getImage(imageMiniature.path).then((data) => {
      setImage(data);
      setMake(data.make);
      setModel(data.model);
      setPath(data.path);
      setAperture(data.aperture);
      setCreateDate(data.createDate);
      setExposureTime(data.exposureTime);
      setFocalLength(data.focalLength);
      setFlash(data.flash);
      setHeight(data.height);
      setWidth(data.width);
      setLongitude(data.longitude);
      setLatitude(data.latitude);
      setIsoSpeed(data.ISOSpeed);

      setIsLoading(false);
    });
  }, [imageMiniature.path]);

  const CheckClick = () => {
    const map = useMapEvents({
      click: (e) => {
        setNewLatitude(e.latlng.lat);
        setNewLongitude(e.latlng.lng);
        setShowDialog(true);
      },
    });
    return null;
  };

  const addMarker = () => {
    if (newLatitude && newLongitude) {
      setLatitude(newLatitude);
      setLongitude(newLongitude);
      setShowDialog(false);
    }
  };

  return (
    <Modal
      isOpen={showModal}
      onRequestClose={handleCloseModal}
      className='preview-modal__modal'
      overlayClassName='preview-modal__overlay'
      ariaHideApp={false}
    >
      <DialogModal
        open={showDialog}
        handleClose={() => setShowDialog(false)}
        title='New marker'
        content='Do you want add to this image marker?'
        firstAction={addMarker}
        firstActionTitle='Add marker'
      />
      {isLoading ? (
        <div className='preview-modal__loader-wrapper'>
          <Oval
            color='blue'
            width={200}
            secondaryColor='white'
            strokeWidth={2}
            height={200}
          />
        </div>
      ) : (
        <>
          <ModalHeader
            title='Image details'
            handleCloseModal={handleCloseModal}
          />
          <div className='preview-modal__image-and-map--wrapper'>
            <img
              src={`data:image/jpeg;base64,${image?.dataString}`}
              alt='full size img'
              className='preview-modal__image'
            />
            <div className='preview-modal__map--wrapper'>
              {latitude && longitude ? (
                <MapContainer
                  center={[latitude, longitude]}
                  zoom={13}
                  scrollWheelZoom={false}
                  style={{ height: `100%`, width: `100%` }}
                >
                  <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
                  <DraggableMarker
                    latitude={latitude}
                    setLatitude={setLatitude}
                    longitude={longitude}
                    setLongitude={setLongitude}
                  />
                </MapContainer>
              ) : (
                <MapContainer
                  center={[52, 19]}
                  zoom={5}
                  scrollWheelZoom={false}
                  style={{ height: `100%`, width: `100%` }}
                >
                  <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
                  <CheckClick />
                </MapContainer>
              )}
            </div>
          </div>
          <div className='preview-modal__input-row'>
            <TextField
              label='Aperture'
              value={aperture ? aperture : ''}
              onChange={(e) => setAperture(+e.target.value)}
              type='number'
              className='preview-modal__input'
            />
            <TextField
              label='Model'
              value={model ? model : ''}
              onChange={(e) => setModel(e.target.value)}
              className='preview-modal__input'
            />
            <TextField
              label='Make'
              value={make ? make : ''}
              onChange={(e) => setMake(e.target.value)}
              className='preview-modal__input'
            />
            <TextField
              label='ISOSpeed'
              value={isoSpeed ? isoSpeed : ''}
              onChange={(e) => setIsoSpeed(+e.target.value)}
              className='preview-modal__input'
              type='number'
            />
          </div>
          <div className='preview-modal__input-row'>
            <TextField
              label='Path'
              value={path}
              onChange={(e) => setPath(e.target.value)}
              className='preview-modal__input'
            />
            <TextField
              label='Width'
              value={width ? width : ''}
              onChange={(e) => setWidth(+e.target.value)}
              className='preview-modal__input'
              type='number'
            />
            <TextField
              label='Height'
              value={height ? height : ''}
              onChange={(e) => setHeight(+e.target.value)}
              className='preview-modal__input'
              type='number'
            />
            <TextField
              label='Flash'
              value={flash ? flash : ''}
              onChange={(e) => setFlash(+e.target.value)}
              className='preview-modal__input'
              type='number'
            />
          </div>
          <div className='preview-modal__input-row'>
            <TextField
              label='Exposure time'
              value={exposureTime ? exposureTime : ''}
              onChange={(e) => setExposureTime(+e.target.value)}
              className='preview-modal__input'
              type='number'
            />
            <TextField
              label='FocalLength'
              value={focalLength ? focalLength : ''}
              onChange={(e) => setFocalLength(+e.target.value)}
              className='preview-modal__input'
              type='number'
            />
            <TextField
              label='Latitude'
              value={latitude ? latitude : ''}
              onChange={(e) => setLatitude(+e.target.value)}
              className='preview-modal__input'
              type='number'
            />
            <TextField
              label='Longitude'
              value={longitude ? longitude : ''}
              onChange={(e) => setLongitude(+e.target.value)}
              className='preview-modal__input'
              type='number'
            />
          </div>
          <div className='preview-modal__input-row'>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                renderInput={(props) => <TextField {...props} />}
                label='Create date'
                value={createDate}
                onChange={(e) => {
                  setCreateDate(e);
                }}
              />
            </LocalizationProvider>
            <div className='preview-modal__empty' />
            <div className='preview-modal__button-wrapper'>
              <Button
                variant='contained'
                onClick={handleDeleteImage}
                style={{ marginRight: '20px' }}
                disabled={isNullOrWhiteSpace(path)}
              >
                Delete image
              </Button>
              <Button variant='contained' onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

export default PreviewModal;
