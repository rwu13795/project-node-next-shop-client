import { SetStateAction } from "react";
import { FieldNames } from "../../util/enums/input-field-names-enum";

interface Props {
  setDescription: (value: SetStateAction<string | undefined>) => void;
  description?: string;
}

export default function AddDescription(props: Props): JSX.Element {
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
}
