import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { getMiniatures } from "../../API/Endpoints/ImageController";
import { ImageGroupDto } from "../../API/Models/ImageGroupDto";
import { ImageMiniatureDto } from "../../API/Models/ImageMiniatureDto";
import { MarkerDto } from "../../API/Models/MarkerDto";
import { SortType } from "../../API/Models/SortEnum";
import FiltrationAndSorting from "../FiltarionAndSorting/FiltrationAndSorting";
import ImageItem from "../ImageItem/ImageItem";
import "./ImageList.scss";

const ImageList = () => {
  const [imageMiniatures, setImageMiniatures] = useState<ImageMiniatureDto[]>(
    []
  );
  const [pageNumber, setPageNumber] = useState<number>(0);

  let markers: MarkerDto[] = [];
  imageMiniatures.forEach((image) => {
    if (image.latitude && image.longitude) {
      const newMarker: MarkerDto = {
        latitude: image.latitude,
        longitude: image.longitude,
        name: image.name,
      };
      markers.push(newMarker);
    }
  });

  useEffect(() => {
    setImageMiniatures([]);
    const imageGroupDto: ImageGroupDto = {
      pageSize: 5,
      pageIndex: pageNumber + 1,
      apertureMax: null,
      apertureMin: null,
      exposureTimeMax: null,
      exposureTimeMin: null,
      flashMax: null,
      flashMin: null,
      focalLengthMax: null,
      focalLengthMin: null,
      makes: null,
      models: null,
      sortType: SortType.NameASC,
    };

    getMiniatures(imageGroupDto).then((data) => {
      setImageMiniatures(data);
    });
  }, [pageNumber]);

  return (
    <div className="image-list__wrapper">
      <div className="image-list__filtration">
        <FiltrationAndSorting markers={markers} />
      </div>
      <div className="image-list__content">
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
            forcePage={0}
            onPageChange={(e) => setPageNumber(e.selected)}
            containerClassName={"pagination"}
            activeClassName={"active"}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageList;
