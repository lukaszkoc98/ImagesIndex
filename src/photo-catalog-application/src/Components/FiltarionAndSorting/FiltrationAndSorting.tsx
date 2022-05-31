import { useState } from 'react';
import { MarkerDto } from '../../API/Models/MarkerDto';
import MapModal from '../MapModal/MapModal';
import UploadFileModal from '../UploadFileModal/UploadFileModal';
import './FiltrationAndSorting.scss';
import TextField from '@mui/material/TextField';
import {
  Select,
  MenuItem,
  Button,
  OutlinedInput,
  InputLabel,
} from '@mui/material';
import { ImageGroupDto } from '../../API/Models/ImageGroupDto';
import { SortType } from '../../API/Models/SortEnum';

interface IFiltrationAndSorting {
  markers: MarkerDto[];
  allMakes: string[];
  allModels: string[];
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  getMiniaturesFromApi: (imageGroupDto: ImageGroupDto) => void;
  setImageGroupDto: React.Dispatch<React.SetStateAction<ImageGroupDto>>;
}

const FiltrationAndSorting = ({
  markers,
  allMakes,
  allModels,
  pageSize,
  setPageSize,
  setImageGroupDto,
  getMiniaturesFromApi,
}: IFiltrationAndSorting) => {
  const [showUploadFileModal, setShowUploadFileModal] =
    useState<boolean>(false);
  const [showMapModal, setShowMapModal] = useState<boolean>(false);

  const [makes, setMakes] = useState<string[] | null>(null);
  const [models, setModels] = useState<string[] | null>(null);

  const [apertureMin, setApertureMin] = useState<number | null>(null);
  const [apertureMax, setApertureMax] = useState<number | null>(null);

  const [exposureTimeMin, setExposureTimeMin] = useState<number | null>(null);
  const [exposureTimeMax, setExposureTimeMax] = useState<number | null>(null);

  const [focalLengthMin, setFocalLengthMin] = useState<number | null>(null);
  const [focalLengthMax, setFocalLengthMax] = useState<number | null>(null);

  const [flashMin, setFlashMin] = useState<number | null>(null);
  const [flashMax, setFlashMax] = useState<number | null>(null);

  const [sortType, setSortType] = useState<number>(SortType.NameASC);

  const sortingNames: string[] = [
    'Name ascending',
    'Name descending',
    'Modify data ascending',
    'Modify date descending',
    'Focal length ascending',
    'Focal length descending',
    'Exposure time ascending',
    'Exposure time descending',
  ];

  const applyFilters = () => {
    const imageGroupDto: ImageGroupDto = {
      pageSize: pageSize,
      pageIndex: 1,
      apertureMax: apertureMax,
      apertureMin: apertureMin,
      exposureTimeMax: null,
      exposureTimeMin: null,
      flashMax: flashMax,
      flashMin: flashMin,
      focalLengthMax: focalLengthMax,
      focalLengthMin: focalLengthMin,
      makes: makes?.length !== 0 ? makes : null,
      models: models?.length !== 0 ? models : null,
      sortType: sortType,
    };
    setImageGroupDto(imageGroupDto);
  };

  const setDefaultFilters = () => {
    const imageGroupDto: ImageGroupDto = {
      pageSize: pageSize,
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
    setImageGroupDto(imageGroupDto);

    setMakes(null);
    setModels(null);
    setApertureMin(null);
    setApertureMax(null);
    setExposureTimeMin(null);
    setExposureTimeMax(null);
    setFocalLengthMin(null);
    setFocalLengthMax(null);
    setFlashMin(null);
    setFlashMax(null);
    setSortType(SortType.NameASC);
    setPageSize(10);
  };

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
      <div className='filtration-and-sorting__header'>
        <Button
          variant='contained'
          onClick={() => setShowMapModal(true)}
          className='filtration-and-sorting__button'
          size='small'
        >
          Show map{' '}
        </Button>
        <Button
          variant='contained'
          onClick={() => setShowUploadFileModal(true)}
          size='small'
        >
          Upload file
        </Button>
      </div>
      <div className='filtration-and-sorting__content'>
        <div>
          <InputLabel id='sorting-label'>Page size</InputLabel>
          <TextField
            type='number'
            value={pageSize}
            onChange={(e) => setPageSize(parseInt(e.target.value))}
            margin='dense'
            size='small'
            style={{ marginTop: '-1px', width: '100%' }}
          />
        </div>
        <div>
          <InputLabel id='sorting-label'>Sorting by</InputLabel>
          <Select
            value={sortType}
            onChange={(e) => setSortType(+e.target.value)}
            input={<OutlinedInput label='Sorting' />}
            margin='dense'
            size='small'
            style={{ width: '100%' }}
          >
            {sortingNames.map((value, index) => (
              <MenuItem key={index} value={index}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div>
          <InputLabel id='name-label'>Makes</InputLabel>
          <Select
            multiple
            value={makes ? makes : []}
            onChange={(e) => setMakes(e.target.value as string[])}
            input={<OutlinedInput label='Makes' />}
            margin='dense'
            size='small'
            style={{ width: '100%' }}
          >
            {allMakes.map((value, index) => (
              <MenuItem key={index} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div>
          <InputLabel id='name-label'>Models</InputLabel>
          <Select
            labelId='name-label'
            multiple
            value={models ? models : []}
            onChange={(e) => setModels(e.target.value as string[])}
            input={<OutlinedInput label='Models' />}
            margin='dense'
            size='small'
            style={{ width: '100%' }}
          >
            {allModels.map((value, index) => (
              <MenuItem key={index} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </div>
        <TextField
          type='number'
          value={apertureMin}
          label='Aperture min'
          onChange={(e) => setApertureMin(parseInt(e.target.value))}
          margin='dense'
          size='small'
          style={{ marginTop: '15px' }}
        />
        <TextField
          type='number'
          value={apertureMax}
          label='Aperture max'
          onChange={(e) => setApertureMax(parseInt(e.target.value))}
          margin='dense'
          size='small'
          style={{ marginTop: '15px' }}
        />
        <TextField
          type='number'
          value={exposureTimeMin}
          label='Exposure time min'
          onChange={(e) => setExposureTimeMin(parseInt(e.target.value))}
          margin='dense'
          size='small'
          style={{ marginTop: '15px' }}
        />
        <TextField
          type='number'
          value={exposureTimeMax}
          label='Exposure time min'
          onChange={(e) => setExposureTimeMax(parseInt(e.target.value))}
          margin='dense'
          size='small'
          style={{ marginTop: '15px' }}
        />
        <TextField
          type='number'
          value={focalLengthMin}
          label='Focal length min'
          onChange={(e) => setFocalLengthMin(parseInt(e.target.value))}
          margin='dense'
          size='small'
          style={{ marginTop: '15px' }}
        />
        <TextField
          type='number'
          value={focalLengthMax}
          label='Focal length max'
          onChange={(e) => setFocalLengthMax(parseInt(e.target.value))}
          margin='dense'
          size='small'
          style={{ marginTop: '15px' }}
        />
        <TextField
          type='number'
          value={flashMin}
          label='Flash min'
          onChange={(e) => setFlashMin(parseInt(e.target.value))}
          margin='dense'
          size='small'
          style={{ marginTop: '15px' }}
        />
        <TextField
          type='number'
          value={flashMax}
          label='Flash max'
          onChange={(e) => setFlashMax(parseInt(e.target.value))}
          margin='dense'
          size='small'
          style={{ marginTop: '15px' }}
        />
        <Button
          style={{ marginTop: '15px' }}
          variant='contained'
          onClick={applyFilters}
        >
          Filter
        </Button>
        <Button
          style={{ marginTop: '15px' }}
          variant='contained'
          onClick={setDefaultFilters}
        >
          Set default
        </Button>
      </div>
    </div>
  );
};

export default FiltrationAndSorting;
