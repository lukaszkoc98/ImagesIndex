import { useEffect, useState } from 'react';
import { getMiniatures } from '../../API/Endpoints/ImageController';
import { ImageGroupDto } from '../../API/Models/ImageGroupDto';
import { ImageMiniatureDto } from '../../API/Models/ImageMiniatureDto';
import { MarkerDto } from '../../API/Models/MarkerDto';
import { SortType } from '../../API/Models/SortEnum';
import FiltrationAndSorting from '../FiltarionAndSorting/FiltrationAndSorting';
import ImageItem from '../ImageItem/ImageItem';
import './ImageList.scss';
import { Pagination } from '@mui/material';

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

  const getMiniaturesFromApi = (imageGroupDto: ImageGroupDto) => {
    setImageMiniatures([]);
    getMiniatures(imageGroupDto).then((data) => {
      setImageMiniatures(data);
    });
  };

  useEffect(() => {
    setImageMiniatures([]);
    const imageGroupDto: ImageGroupDto = {
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

    getMiniaturesFromApi(imageGroupDto);
  }, [pageNumber]);

  return (
    <div className='image-list__wrapper'>
      <aside className='image-list__filtration'>
        <FiltrationAndSorting
          markers={markers}
          allMakes={['Samsung', 'Xiaomi', 'Iphone']}
          allModels={['Galaxy', 'model1', 'model2']}
          getMiniaturesFromApi={getMiniaturesFromApi}
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
            count={20}
            onChange={(event: React.ChangeEvent<unknown>, value: number) =>
              setPageNumber(value)
            }
            color='primary'
            className='image-list__pagination'
          />
        </div>
      </main>
    </div>
  );
};

export default ImageList;
