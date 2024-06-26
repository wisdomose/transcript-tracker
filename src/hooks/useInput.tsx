import { useState } from "react";

interface InputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: any;
}

const useInput = (
  initialValue: string
): [string, InputProps, (v: string) => void] => {
  const [value, setValue] = useState(initialValue);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const updateValue = (v: string) => setValue(v);

  return [value, { value, onChange }, updateValue];
};

export default useInput;
