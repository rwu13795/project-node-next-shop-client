import type { NextPage } from "next";
import { useState } from "react";

const Men: NextPage = ({}) => {
  // state for uploading image
  const [currentFile, setCurrentFile] = useState<File | null>();
  const [previewImg, setPreviewImg] = useState<string | null>();

  const selectImageHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    // declare "target.files" as FileList type in order to prevent "object may be null"
    const file = (event.target.files as FileList)[0];
    setCurrentFile(file);
    setPreviewImg(URL.createObjectURL(file));
  };

  return (
    <main>
      <h1>Men Home Page</h1>
      <div>
        <label htmlFor="image">Upload Image: </label>
        <input
          type="file"
          accept="image/*"
          name="image"
          id="image"
          onChange={selectImageHandler}
        />
      </div>
      {previewImg && (
        <img
          src={previewImg}
          alt="selected image"
          style={{ width: "200px", height: "200px" }}
        />
      )}
    </main>
  );
};

export default Men;
