import { SetStateAction } from "react";
import { FieldNames } from "./enums/field-names-enum";

interface Props {
  setDescription: (value: SetStateAction<string | undefined>) => void;
  description?: string;
}

const AddDescription = (props: Props): JSX.Element => {
  const { description, setDescription } = props;

  return (
    <div>
      <label>Description: </label>
      <textarea
        name={FieldNames.desc}
        rows={6}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
    </div>
  );
};

export default AddDescription;
