import React from "react";

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<string | Option>;
  required?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  styles: Record<string, string>;
  style?: React.CSSProperties; // Optional inline styles for overrides
}

export default function FormSelect({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  icon: Icon,
  styles,
  style,
}: FormSelectProps) {
  return (
    <div className={styles["field-group"]} style={style}>
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
        <select
          id={name}
          name={name}
          value={value}
          required={required}
          onChange={onChange}
          className={Icon ? styles.selectWithIcon : styles.select}
        >
          {options.map((opt) => {
            const val = typeof opt === "string" ? opt : opt.value;
            const lbl = typeof opt === "string" ? opt : opt.label;
            return (
              <option key={val} value={val}>
                {lbl}
              </option>
            );
          })}
        </select>
        <span className={styles.selectChevron} aria-hidden="true">
          ˅
        </span>
      </div>
    </div>
  );
}
