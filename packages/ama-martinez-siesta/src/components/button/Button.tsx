import "./Button.scss";
import type { ButtonProps } from "./Button.interface";

function Button({ label, className, onClick }: ButtonProps) {
  return (
    <button className={`button ${className || ""}`} onClick={onClick}>
      {label}
    </button>
  );
}

export default Button;
