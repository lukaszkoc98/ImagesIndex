import "./ErrorText.scss";

interface IErrorText {
  isVisible: boolean;
  text: string;
}

const ErrorText = ({ isVisible, text }: IErrorText) => {
  return <>{isVisible && <p className="error-text">{text}</p>}</>;
};

export default ErrorText;
