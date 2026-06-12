import React from "react";

interface FormTextareaProps {
  label: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  placeholder?: string;
  required?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  styles: Record<string, string>;
  style?: React.CSSProperties; // Optional inline styles for overrides
}

export default function FormTextarea({
  label,
  name,
  value,
  onChange,
  rows = 5,
  placeholder,
  required = false,
  icon: Icon,
  styles,
  style,
}: FormTextareaProps) {
  return (
    <div className={styles["field-group"]} style={style}>
      <label htmlFor={name}>
        {label}
        {required ? " *" : ""}
      </label>
      <div className={styles.inputWrapper}>
        {Icon && (
          <span className={styles.inputIcon} style={{ top: "16px", transform: "none" }} aria-hidden="true">
            <Icon />
          </span>
        )}
        <textarea
          id={name}
          name={name}
          rows={rows}
          value={value}
          required={required}
          onChange={onChange}
          className={Icon ? styles.textareaWithIcon : styles.textarea}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
