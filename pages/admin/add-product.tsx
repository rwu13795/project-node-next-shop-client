import type { NextPage } from "next";
import Image from "next/image";
import { useState } from "react";

import axios from "axios";

interface ColorProps {
  colorAndSize: { [name: string]: string };
  imagesCount: number;
  imagesFiles: File[];
}

const AddProduct: NextPage = ({}) => {
  const [colorPropList, setColorPropList] = useState<ColorProps[]>([
    {
      colorAndSize: { color: "", small: "", medium: "", large: "" },
      imagesCount: 0,
      imagesFiles: [],
    },
  ]);

  // state for uploading image
  const [currentFile, setCurrentFile] = useState<File | null>();
  const [previewImg, setPreviewImg] = useState<string | null>();

  const inputChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.currentTarget;
    let list = [...colorPropList];

    if (name !== "image") {
      list[index].colorAndSize[name] = value;
      setColorPropList(list);
    } else {
      const imageFile = (e.target.files as FileList)[0];
      list[index].imagesFiles.push(imageFile);
      list[index].imagesCount = list[index].imagesFiles.length;
      setColorPropList(list);
    }

    console.log(list);
  };

  const addMoreColorHandler = () => {
    setColorPropList([
      ...colorPropList,
      {
        colorAndSize: { color: "", small: "", medium: "", large: "" },
        imagesCount: 0,
        imagesFiles: [],
      },
    ]);
  };

  const removeColorHandler = (index: number) => {
    const list = [...colorPropList];
    list.splice(index, 1);
    if (list.length === 0) {
      setColorPropList([
        {
          colorAndSize: { color: "", small: "", medium: "", large: "" },
          imagesCount: 0,
          imagesFiles: [],
        },
      ]);
    } else {
      setColorPropList(list);
    }
  };

  const uploadImage = async () => {
    if (!currentFile) {
      return;
    }
    console.log("uploading images");

    const formData = new FormData();
    //  the "uploaded_image" must match the "fieldname" of "multer" in the server
    formData.append("uploaded_images", currentFile);

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
      <h1>Add New Product</h1>
      {colorPropList.map((prop, index) => {
        return (
          <div key={index}>
            <div>
              <label>Colors:</label>
              <input
                type="text"
                name="color"
                value={prop.colorAndSize.color}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  inputChangeHandler(e, index)
                }
              />
            </div>
            <div>
              <label>Sizes: </label>
              <label>small</label>
              <input
                type="number"
                name="small"
                value={prop.colorAndSize.small}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  inputChangeHandler(e, index)
                }
              />
              <label>medium</label>
              <input
                type="number"
                name="medium"
                value={prop.colorAndSize.medium}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  inputChangeHandler(e, index)
                }
              />
              <label>large</label>
              <input
                type="number"
                name="large"
                value={prop.colorAndSize.large}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  inputChangeHandler(e, index)
                }
              />
            </div>
            <div>
              <label htmlFor="image">Upload Image: </label>
              <div>
                {prop.imagesFiles.length > 0 &&
                  prop.imagesFiles.map((file, index) => {
                    return (
                      <Image
                        key={index}
                        src={URL.createObjectURL(file)}
                        alt="selected image"
                        width={200}
                        height={200}
                      />
                    );
                  })}
                <input
                  type="file"
                  accept="image/jpeg"
                  name="image"
                  id="image"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    inputChangeHandler(e, index)
                  }
                />
              </div>
            </div>
            <button onClick={() => removeColorHandler(index)}>
              Remove this color
            </button>
          </div>
        );
      })}
      <button onClick={addMoreColorHandler}>Add more colors</button>

      <div>
        <button onClick={uploadImage}>upload</button>
      </div>
    </main>
  );
};

export default AddProduct;
