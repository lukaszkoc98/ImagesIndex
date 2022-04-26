import "./Button.scss";
import { Oval } from "react-loader-spinner";

interface IButton {
  text: string;
  onClick: () => void;
  isLoading?: boolean;
  marginRight?: number;
  marginTop?: number;
  type?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
  width?: number;
}

const Button = ({
  text,
  onClick,
  isLoading = false,
  marginRight = 0,
  marginTop = 0,
  type = "button",
  disabled = false,
  width = 120,
}: IButton) => {
  return (
    <button
      className="button"
      onClick={onClick}
      style={{
        marginRight: `${marginRight}px`,
        marginTop: `${marginTop}px`,
        width: `${width}px`,
      }}
      type={type}
      disabled={disabled}
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
