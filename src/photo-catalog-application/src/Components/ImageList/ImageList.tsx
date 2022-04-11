import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { getMiniatures } from "../../API/Endpoints/ImageController";
import { ImageMiniatureDto } from "../../API/Models/ImageMiniatureDto";
import Button from "../../Common/Button/Button";
import ImageItem from "../ImageItem/ImageItem";
import UploadFileModal from "../UploadFileModal/UploadFileModal";
import "./ImageList.scss";

const ImageList = () => {
  const [showUploadFileModal, setShowUploadFileModal] =
    useState<boolean>(false);
  const [imageMiniatures, setImageMiniatures] = useState<ImageMiniatureDto[]>(
    []
  );

  useEffect(() => {
    getMiniatures().then((data) => {
      setImageMiniatures(data);
      console.log(data[1].name);
      console.log(data[1].latitude);
    });
  }, []);

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
        <div className="image-list__miniatures--wrapper">
          {imageMiniatures.map((image, index) => {
            return <ImageItem imageMiniature={image} key={index} />;
          })}
        </div>
        <div id="image-list__pagination">
          <ReactPaginate
            previousLabel={"<-- previous"}
            nextLabel={"next -->"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={5}
            marginPagesDisplayed={1}
            pageRangeDisplayed={10}
            forcePage={1}
            onPageChange={() => console.log("page changed")}
            containerClassName={"pagination"}
            activeClassName={"active"}
          />
        </div>
      </div>
    </>
  );
};

export default ImageList;
