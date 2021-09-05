import type { NextPage } from "next";
import { useState } from "react";

import axios from "axios";

const Men: NextPage = ({}) => {
  // state for uploading image
  const [currentFile, setCurrentFile] = useState<File | null>();
  const [previewImg, setPreviewImg] = useState<string | null>();

  const selectImageHandler = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // declare "target.files" as FileList type in order to prevent "object may be null"
    const file = (event.target.files as FileList)[0];
    setCurrentFile(file);
    setPreviewImg(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    if (!currentFile) {
      return;
    }

    const formData = new FormData();
    formData.append("image", currentFile);

    await axios.post(
      "http://localhost:5000/api/admin/post-new-item",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
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
      <div>
        <button onClick={uploadImage}>upload</button>
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
