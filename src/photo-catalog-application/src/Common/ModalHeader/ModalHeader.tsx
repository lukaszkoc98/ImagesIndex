import CancelIcon from "../../Images/Cancel-icon.svg";
import "./ModalHeader.scss";

interface IModalHeader {
  title: string;
  handleCloseModal: () => void;
}

const ModalHeader = ({ title, handleCloseModal }: IModalHeader) => {
  return (
    <div className="modal-header">
      <span>{title}</span>
      <img src={CancelIcon} alt="Cancel icon" onClick={handleCloseModal} />
    </div>
  );
};

export default ModalHeader;
