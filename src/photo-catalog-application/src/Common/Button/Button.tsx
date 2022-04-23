import "./Button.scss";
import { Oval } from "react-loader-spinner";

interface IButton {
  text: string;
  onClick: () => void;
  isLoading?: boolean;
  marginRight?: number;
}

const Button = ({
  text,
  onClick,
  isLoading = false,
  marginRight = 0,
}: IButton) => {
  return (
    <button
      className="button"
      onClick={onClick}
      style={{ marginRight: `${marginRight}px` }}
    >
      {!isLoading ? (
        <span className="button__text">{text}</span>
      ) : (
        <Oval color="blue" width={35} secondaryColor="white" strokeWidth={3} />
      )}
    </button>
  );
};

export default Button;
