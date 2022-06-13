import { useEffect, useState } from 'react';
import {
  getImagesLocalization,
  getMakes,
  getMiniatures,
  getModels,
} from '../../API/Endpoints/ImageController';
import { ImageGroupDto } from '../../API/Models/ImageGroupDto';
import { ImageMiniatureDto } from '../../API/Models/ImageMiniatureDto';
import { SortType } from '../../API/Models/SortEnum';
import FiltrationAndSorting from '../FiltarionAndSorting/FiltrationAndSorting';
import ImageItem from '../ImageItem/ImageItem';
import './ImageList.scss';
import { Pagination } from '@mui/material';
import { RotatingLines } from 'react-loader-spinner';
import { ImageLocalizationDto } from '../../API/Models/ImageLocalizationDto';

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
  const [pageCount, setPageCount] = useState<number>(1);
  const [models, setModels] = useState<string[]>([]);
  const [makes, setMakes] = useState<string[]>([]);
  const [imageGroupDto, setImageGroupDto] =
    useState<ImageGroupDto>(defaultImageGroupDto);
  const [imagesLocalization, setImagesLocalization] = useState<
    ImageLocalizationDto[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshImages, setRefreshImages] = useState<boolean>(false);

  const getMiniaturesFromApi = (imageGroupDto: ImageGroupDto) => {
    setImageMiniatures([]);
    setIsLoading(true);
    setImageGroupDto(imageGroupDto);
    getMiniatures(imageGroupDto).then((data) => {
      setImageMiniatures(data.items);
      setPageCount(data.totalPages);
      setIsLoading(false);
    });

    getModels().then((data) => {
      setModels(data);
    });

    getMakes().then((data) => {
      setMakes(data);
    });

    getImagesLocalization().then((data) => {
      setImagesLocalization(data);
    });
  };

  useEffect(() => {
    if (refreshImages) {
      getMiniaturesFromApi(imageGroupDto);
      setRefreshImages(false);
    }
  }, [refreshImages]);

  useEffect(() => {
    getMiniaturesFromApi(imageGroupDto);
  }, [imageGroupDto]);
  return (
    <div className='image-list__wrapper'>
      <aside className='image-list__filtration'>
        <FiltrationAndSorting
          imagesLocalization={imagesLocalization}
          allMakes={makes}
          allModels={models}
          pageSize={pageSize}
          setPageSize={setPageSize}
          setRefreshImages={setRefreshImages}
          setImageGroupDto={setImageGroupDto}
        />
      </aside>
      <main className='image-list__content'>
        {isLoading ? (
          <div className='image-list__loader'>
            <RotatingLines width='100' strokeColor='blue' />
          </div>
        ) : (
          <>
            <div className='image-list__miniatures--wrapper'>
              {imageMiniatures.map((image, index) => {
                return (
                  <ImageItem
                    imageMiniature={image}
                    key={index}
                    setImageMiniatures={setImageMiniatures}
                    setRefreshImages={setRefreshImages}
                    setImagesLocalization={setImagesLocalization}
                  />
                );
              })}
            </div>
            <div className='image-list__pagination--wrapper'>
              <Pagination
                count={pageCount}
                page={imageGroupDto.pageIndex}
                onChange={(
                  event: React.ChangeEvent<unknown>,
                  value: number
                ) => {
                  setImageGroupDto({ ...imageGroupDto, pageIndex: value });
                }}
                color='primary'
                className='image-list__pagination'
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ImageList;
