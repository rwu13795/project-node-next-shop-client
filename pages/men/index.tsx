import type { NextPage } from "next";
import { useState } from "react";

import axios from "axios";

const Men: NextPage = ({}) => {
  // state for uploading image
  const [currentFile, setCurrentFile] = useState<File | null>();
  const [previewImg, setPreviewImg] = useState<string | null>();

  const [currentFile1, setCurrentFile1] = useState<File | null>();

  const selectImageHandler = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // declare "target.files" as FileList type in order to prevent "object may be null"
    const file = (event.target.files as FileList)[0];
    setCurrentFile(file);
    setPreviewImg(URL.createObjectURL(file));
  };

  const selectImageHandler1 = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // declare "target.files" as FileList type in order to prevent "object may be null"
    const file = (event.target.files as FileList)[0];
    setCurrentFile1(file);
  };

  const uploadImage = async () => {
    if (!currentFile || !currentFile1) {
      return;
    }
    console.log("uploading images");

    const formData = new FormData();
    //  the "uploaded_image" must match the "fieldname" of "multer" in the server
    formData.append("uploaded_images", currentFile);
    formData.append("uploaded_images", currentFile);
    formData.append("uploaded_images", currentFile);

    formData.append("uploaded_images", currentFile1);

    let colors = { ["red"]: { imagesCount: 3 }, ["blue"]: { imagesCount: 1 } };

    formData.append("document", JSON.stringify(colors));

    await axios.post("http://localhost:5000/api/admin/edit-product", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  return (
    <main>
      <h1>Men Home Page</h1>
      <div>
        <label htmlFor="image">Upload Image: </label>
        <input
          type="file"
          accept="image/jpeg"
          name="image"
          id="image"
          onChange={selectImageHandler}
        />
      </div>
      <div>
        <label htmlFor="image">Upload Image: </label>
        <input
          type="file"
          accept="image/jpeg"
          name="image"
          id="image"
          onChange={selectImageHandler1}
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
