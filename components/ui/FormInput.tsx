import React from "react";

interface FormInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  styles: Record<string, string>;
}

export default function FormInput({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  icon: Icon,
  styles,
}: FormInputProps) {
  return (
    <div className={styles["field-group"]}>
      <label htmlFor={name}>
        {label}
        {required ? " *" : ""}
      </label>
      <div className={styles.inputWrapper}>
        {Icon && (
          <span className={styles.inputIcon} aria-hidden="true">
            <Icon />
          </span>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          required={required}
          onChange={onChange}
          className={Icon ? styles.inputWithIcon : styles.input}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
