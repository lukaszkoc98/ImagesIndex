import "./Button.scss";

interface IButton {
  text: string;
  onClick: () => void;
}

const Button = ({ text, onClick }: IButton) => {
  return (
    <button className="button" onClick={onClick}>
      <span className="button__text">{text}</span>
    </button>
  );
};

export default Button;
