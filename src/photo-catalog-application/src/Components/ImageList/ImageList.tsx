import { useEffect, useState } from 'react';
import {
  getImageCount,
  getMakes,
  getMiniatures,
  getModels,
} from '../../API/Endpoints/ImageController';
import { ImageGroupDto } from '../../API/Models/ImageGroupDto';
import { ImageMiniatureDto } from '../../API/Models/ImageMiniatureDto';
import { MarkerDto } from '../../API/Models/MarkerDto';
import { SortType } from '../../API/Models/SortEnum';
import FiltrationAndSorting from '../FiltarionAndSorting/FiltrationAndSorting';
import ImageItem from '../ImageItem/ImageItem';
import './ImageList.scss';
import { Pagination } from '@mui/material';

const ImageList = () => {
  const defaultImageGroupDto: ImageGroupDto = {
    pageSize: 10,
    pageIndex: 1,
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

  const [imageMiniatures, setImageMiniatures] = useState<ImageMiniatureDto[]>(
    []
  );
  const [pageSize, setPageSize] = useState<number>(10);
  const [imagesCount, setImagesCount] = useState<number>(1);
  const [models, setModels] = useState<string[]>([]);
  const [makes, setMakes] = useState<string[]>([]);
  const [imageGroupDto, setImageGroupDto] =
    useState<ImageGroupDto>(defaultImageGroupDto);

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

  const getMiniaturesFromApi = (imageGroupDto: ImageGroupDto) => {
    setImageMiniatures([]);
    setImageGroupDto(imageGroupDto);
    getMiniatures(imageGroupDto).then((data) => {
      setImageMiniatures(data);
    });

    getImageCount().then((data) => {
      setImagesCount(data);
    });

    getModels().then((data) => {
      setModels(data);
    });

    getMakes().then((data) => {
      setMakes(data);
    });
  };

  useEffect(() => {
    getMiniaturesFromApi(imageGroupDto);
  }, [imageGroupDto]);

  return (
    <div className='image-list__wrapper'>
      <aside className='image-list__filtration'>
        <FiltrationAndSorting
          markers={markers}
          allMakes={makes}
          allModels={models}
          getMiniaturesFromApi={getMiniaturesFromApi}
          pageSize={pageSize}
          setPageSize={setPageSize}
          setImageGroupDto={setImageGroupDto}
        />
      </aside>
      <main className='image-list__content'>
        <div className='image-list__miniatures--wrapper'>
          {imageMiniatures.map((image, index) => {
            return (
              <ImageItem
                imageMiniature={image}
                key={index}
                setImageMiniatures={setImageMiniatures}
              />
            );
          })}
        </div>
        <div className='image-list__pagination--wrapper'>
          <Pagination
            count={Math.ceil(imagesCount / pageSize)}
            onChange={(event: React.ChangeEvent<unknown>, value: number) => {
              setImageGroupDto({ ...imageGroupDto, pageIndex: value });
            }}
            color='primary'
            className='image-list__pagination'
          />
        </div>
      </main>
    </div>
  );
};

export default ImageList;
