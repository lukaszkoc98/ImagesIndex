import { useEffect, useState } from 'react';
import { ImageMiniatureDto } from '../../API/Models/ImageMiniatureDto';
import PreviewModal from '../PreviewModal/PreviewModal';
import './ImageItem.scss';

interface IImageItem {
  imageMiniature: ImageMiniatureDto;
  setImageMiniatures: React.Dispatch<React.SetStateAction<ImageMiniatureDto[]>>;
  setRefreshImages: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImageItem = ({
  imageMiniature,
  setImageMiniatures,
  setRefreshImages,
}: IImageItem) => {
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);

  useEffect(() => {
    const L = require('leaflet');

    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    });
  }, []);

  return (
    <div>
      {showPreviewModal && (
        <PreviewModal
          showModal={showPreviewModal}
          handleCloseModal={() => {
            setShowPreviewModal(false);
          }}
          setRefreshImages={setRefreshImages}
          imageMiniature={imageMiniature}
          setImageMiniatures={setImageMiniatures}
        />
      )}
      <div className='image-item'>
        <span className='image-item__label'>
          {' '}
          {imageMiniature.name.split('.')[0]}{' '}
        </span>
        <img
          src={imageMiniature.stringData}
          alt='img miniature'
          className='image-item__image'
          onClick={() => setShowPreviewModal(true)}
        />
      </div>
    </div>
  );
};

export default ImageItem;
