import "./PreviewModal.scss";
import Modal from "react-modal";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ModalHeader from "../../Common/ModalHeader/ModalHeader";
import DraggableMarker from "./DraggableMarker";
import { useEffect, useState } from "react";
import { ImageMiniatureDto } from "../../API/Models/ImageMiniatureDto";
import { getImage, updateImage } from "../../API/Endpoints/ImageController";
import { ImageDTO } from "../../API/Models/ImageDto";
import { UpdateImageDto } from "../../API/Models/UpdateImageDto";
import Button from "../../Common/Button/Button";
import InputWithLabel from "../../Common/InputWithLabel/InputWithLabel";
import { useForm } from "react-hook-form";
import { Oval } from "react-loader-spinner";

interface Localization {
  lat: number;
  lng: number;
}

interface IPreviewModal {
  showModal: boolean;
  handleCloseModal: () => void;
  imageMiniature: ImageMiniatureDto;
}

const PreviewModal = ({
  showModal,
  handleCloseModal,
  imageMiniature,
}: IPreviewModal) => {
  const [localization, setLocalization] = useState<Localization | null>(null);
  const [image, setImage] = useState<ImageDTO>();
  const [isLoading, setIsloading] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UpdateImageDto>();

  const onSubmit = async (data: UpdateImageDto): Promise<void> => {
    if (
      data.latitude &&
      data.longitude &&
      (data.latitude !== image?.latitude || data.longitude !== image?.longitude)
    ) {
      setLocalization({ lat: data.latitude, lng: data.longitude });
    }
    updateImage(data);
  };

  useEffect(() => {
    getImage(imageMiniature.path).then((data) => {
      setImage(data);
      if (data.latitude && data.longitude) {
        setLocalization({ lat: data.latitude, lng: data.longitude });
      }
      setIsloading(false);
    });
  }, [imageMiniature.path]);

  return (
    <Modal
      isOpen={showModal}
      onRequestClose={handleCloseModal}
      className="preview-modal__modal"
      overlayClassName="preview-modal__overlay"
      ariaHideApp={false}
    >
      {isLoading ? (
        <div className="preview-modal__loader-wrapper">
          <Oval
            color="blue"
            width={200}
            secondaryColor="white"
            strokeWidth={2}
            height={200}
          />
        </div>
      ) : (
        <>
          <ModalHeader
            title="Image details"
            handleCloseModal={handleCloseModal}
          />
          <div className="preview-modal__image-and-map--wrapper">
            <img
              src={`data:image/jpeg;base64,${image?.dataString}`}
              alt="full size img"
              className="preview-modal__image"
            />
            <div className="preview-modal__map--wrapper">
              {localization?.lat && localization.lng ? (
                <MapContainer
                  center={[localization.lat, localization.lng]}
                  zoom={13}
                  scrollWheelZoom={false}
                  style={{ height: `100%`, width: `100%` }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <DraggableMarker localization={localization} />
                </MapContainer>
              ) : (
                <MapContainer
                  center={[50, 13]}
                  zoom={13}
                  scrollWheelZoom={false}
                  style={{ height: `100%`, width: `100%` }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                </MapContainer>
              )}
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="preview-modal__input-row">
              <InputWithLabel
                label="Aperture"
                inputPlaceholder="Enter aperture"
                register={register}
                registerName="aperture"
                width={200}
                type="number"
                defaultValue={image?.aperture}
              />
              <InputWithLabel
                label="Model"
                inputPlaceholder="Enter model"
                register={register}
                registerName="model"
                width={200}
                type="text"
                defaultValue={image?.model}
              />
              <InputWithLabel
                label="Make"
                inputPlaceholder="Enter make"
                register={register}
                registerName="make"
                width={200}
                type="text"
                defaultValue={image?.make}
              />
            </div>
            <div className="preview-modal__input-row">
              <InputWithLabel
                label="Exposure time"
                inputPlaceholder="Enter exposure time"
                register={register}
                registerName="exposureTime"
                width={200}
                type="number"
                defaultValue={image?.exposureTime}
              />
              <InputWithLabel
                label="Focal lenght"
                inputPlaceholder="Enter focal length"
                register={register}
                registerName="focalLength"
                width={200}
                type="number"
                defaultValue={image?.focalLength}
              />
              <InputWithLabel
                label="Flash"
                inputPlaceholder="Enter flash"
                register={register}
                registerName="flash"
                width={200}
                type="number"
                defaultValue={image?.flash}
              />
            </div>
            <div className="preview-modal__input-row">
              <InputWithLabel
                label="Width"
                inputPlaceholder="Enter width"
                register={register}
                registerName="width"
                width={200}
                type="number"
                defaultValue={image?.width}
              />
              <InputWithLabel
                label="Height"
                inputPlaceholder="Enter height"
                register={register}
                registerName="height"
                width={200}
                type="number"
                defaultValue={image?.height}
              />
              <InputWithLabel
                label="ISOSpeed"
                inputPlaceholder="Enter ISOSpeed"
                register={register}
                registerName="ISOSpeed"
                width={200}
                type="number"
                defaultValue={image?.ISOSpeed}
              />
            </div>
            <div className="preview-modal__input-row">
              <InputWithLabel
                label="Create date"
                inputPlaceholder="Enter create date"
                register={register}
                registerName="createDate"
                width={200}
                type="text"
                defaultValue={image?.createDate?.toString()}
              />
              <InputWithLabel
                label="Latitude"
                inputPlaceholder="Enter latitude"
                register={register}
                registerName="latitude"
                width={200}
                type="number"
                defaultValue={image?.latitude}
              />
              <InputWithLabel
                label="Longitude"
                inputPlaceholder="Enter longitude"
                register={register}
                registerName="longitude"
                width={200}
                type="number"
                defaultValue={image?.longitude}
              />
            </div>
            <div className="preview-modal__button-wrapper">
              <Button
                text="Zapisz"
                onClick={() => {}}
                type="submit"
                disabled={isSubmitting}
              />
            </div>
          </form>
        </>
      )}
    </Modal>
  );
};

export default PreviewModal;
