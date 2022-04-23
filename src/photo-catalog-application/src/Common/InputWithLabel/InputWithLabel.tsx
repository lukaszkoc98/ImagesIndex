import { FieldError, UseFormRegister } from "react-hook-form";
import ErrorText from "../ErrorText/ErrorText";
import "./InputWithLabel.scss";

interface IInputWithLabel {
  label: string;
  inputPlaceholder: string;
  marginTop?: number;
  marginBottom?: number;
  maxInputLength?: number;
  type?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  requirements?: any;
  fieldError?: FieldError | undefined;
  errorText?: string;
  value?: string | number;
  registerName?: string;
  min?: number;
  inputMode?: string;
  fontSize?: number;
  labelSize?: number;
  disabled?: boolean;
  width?: number;
}

const InputWithLabel = ({
  label,
  inputPlaceholder,
  marginTop,
  marginBottom,
  maxInputLength,
  register,
  fieldError,
  errorText,
  requirements,
  type,
  value,
  registerName,
  min,
  inputMode,
  fontSize = 14,
  labelSize = 14,
  disabled = false,
  width,
}: IInputWithLabel) => {
  return (
    <div
      className={"input-with-label__wrapper"}
      style={{
        marginTop: marginTop,
        marginBottom: marginBottom,
      }}
    >
      <div
        style={{ fontSize: labelSize }}
        className={"input-with-label__content"}
      >
        <span>{label}</span>
      </div>
      <input
        style={{ fontSize: fontSize, width: width ? `${width}px` : "100%" }}
        type={type}
        min={min}
        maxLength={maxInputLength}
        {...register(registerName ? registerName : label, requirements)}
        className="input-with-label__input"
        inputMode={inputMode ? "numeric" : "text"}
        placeholder={inputPlaceholder}
        value={value}
        disabled={disabled}
      />
      <ErrorText
        isVisible={fieldError !== undefined}
        text={errorText ? errorText : "c"}
      />
    </div>
  );
};

export default InputWithLabel;
