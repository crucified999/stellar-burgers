import { ChangeEvent, useState } from 'react';

export function useForm<TForm>(inputValues: TForm) {
  const [values, setValues] = useState(inputValues);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;

    setValues({ ...values, [name]: value });
  };

  return { values, handleChange, setValues };
}
