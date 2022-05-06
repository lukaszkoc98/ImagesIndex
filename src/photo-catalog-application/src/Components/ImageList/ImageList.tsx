import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { getMiniatures } from "../../API/Endpoints/ImageController";
import { ImageMiniatureDto } from "../../API/Models/ImageMiniatureDto";
import { MarkerDto } from "../../API/Models/MarkerDto";
import FiltrationAndSorting from "../FiltarionAndSorting/FiltrationAndSorting";
import ImageItem from "../ImageItem/ImageItem";
import "./ImageList.scss";

const ImageList = () => {
  const [imageMiniatures, setImageMiniatures] = useState<ImageMiniatureDto[]>(
    []
  );

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
    getMiniatures().then((data) => {
      setImageMiniatures(data);
    });
  }, []);

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
            forcePage={1}
            onPageChange={() => console.log("page changed")}
            containerClassName={"pagination"}
            activeClassName={"active"}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageList;
