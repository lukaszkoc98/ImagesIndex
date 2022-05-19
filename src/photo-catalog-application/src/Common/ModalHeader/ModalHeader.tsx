import Typography from '@mui/material/Typography';
import './ModalHeader.scss';
import CloseIcon from '@mui/icons-material/Close';

interface IModalHeader {
  title: string;
  handleCloseModal: () => void;
}

const ModalHeader = ({ title, handleCloseModal }: IModalHeader) => {
  return (
    <div className='modal-header'>
      <Typography variant='h5' component='h2'>
        {title}
      </Typography>
      <CloseIcon className='modal-header__icon' onClick={handleCloseModal} />
    </div>
  );
};

export default ModalHeader;
