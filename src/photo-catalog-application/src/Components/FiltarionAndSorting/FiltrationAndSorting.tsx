import { useState } from "react";
import { MarkerDto } from "../../API/Models/MarkerDto";
import Button from "../../Common/Button/Button";
import MapModal from "../MapModal/MapModal";
import UploadFileModal from "../UploadFileModal/UploadFileModal";
import "./FiltrationAndSorting.scss";

interface IFiltrationAndSorting {
  markers: MarkerDto[];
}

const FiltrationAndSorting = ({ markers }: IFiltrationAndSorting) => {
  const [showUploadFileModal, setShowUploadFileModal] =
    useState<boolean>(false);
  const [showMapModal, setShowMapModal] = useState<boolean>(false);
  return (
    <div>
      <UploadFileModal
        showModal={showUploadFileModal}
        handleCloseModal={() => setShowUploadFileModal(false)}
      />
      <MapModal
        showModal={showMapModal}
        handleCloseModal={() => setShowMapModal(false)}
        markers={markers}
      />
      <div className="filtration-and-sorting__header">
        <Button
          text="Show map"
          onClick={() => {
            setShowMapModal(true);
          }}
          marginRight={20}
        />
        <Button
          text="Upload file"
          onClick={() => {
            setShowUploadFileModal(true);
          }}
        />
      </div>
    </div>
  );
};

export default FiltrationAndSorting;
