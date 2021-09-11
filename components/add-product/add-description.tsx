import { SetStateAction } from "react";

interface Props {
  setDescription: (value: SetStateAction<string>) => void;
  description: string;
}

const AddDescription = (props: Props): JSX.Element => {
  const { description, setDescription } = props;

  return (
    <div>
      <label htmlFor="description">Description: </label>
      <textarea
        name="description"
        id="description"
        rows={6}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
    </div>
  );
};

export default AddDescription;
