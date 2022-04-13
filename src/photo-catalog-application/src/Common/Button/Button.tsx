import "./Button.scss";
import { Oval } from "react-loader-spinner";

interface IButton {
  text: string;
  onClick: () => void;
  isLoading?: boolean;
}

const Button = ({ text, onClick, isLoading = false }: IButton) => {
  return (
    <button className="button" onClick={onClick}>
      {!isLoading ? (
        <span className="button__text">{text}</span>
      ) : (
        <Oval color="blue" width={35} secondaryColor="white" strokeWidth={3} />
      )}
    </button>
  );
};

export default Button;
