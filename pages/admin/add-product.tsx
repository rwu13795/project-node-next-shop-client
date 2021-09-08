import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/dist/client/router";
import { ChangeEvent } from "react";
import { Fragment, useState } from "react";

import useUpload from "../../util/react-hooks/use-upload";

export interface ProductProps {
  colorAndSize: { [name: string]: string };
  imagesCount: number;
  imagesFiles: File[] | undefined; // need to use "delete" on this preporty, have to set it as optional
}

export interface ProductCategory {
  // have to use computed property type if we want to add the category using mapping
  [name: string]: string;
}

const AddProduct: NextPage = ({}) => {
  const [productPropList, setProductPropList] = useState<ProductProps[]>([
    {
      colorAndSize: { color: "", small: "", medium: "", large: "" },
      imagesCount: 0,
      imagesFiles: [],
    },
  ]);

  const [productCategory, setProductCategory] = useState<ProductCategory>({
    main: "",
    sub: "",
    title: "",
  });

  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);

  const sizesArray = ["small", "medium", "large"];
  const categoryArray = ["main", "sub", "title"];

  const router = useRouter();

  const { postUpload, errors } = useUpload({
    productCategory,
    productPropList,
    price,
    description,
    onSuccess: () => {
      console.log("OK");
      router.push("/");
    },
  });

  const propsChangeHandler = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.currentTarget;
    let list = [...productPropList];

    if (name !== "image") {
      list[index].colorAndSize[name] = value;
      setProductPropList(list);
    } else {
      const imageFile = (e.target.files as FileList)[0];
      list[index].imagesFiles?.push(imageFile);
      list[index].imagesCount = list[index].imagesFiles?.length || 0;
      setProductPropList(list);
    }
  };

  const catChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    let category = { ...productCategory };
    category[name] = value;
    setProductCategory(category);
  };

  const addMoreColorHandler = () => {
    setProductPropList([
      ...productPropList,
      {
        colorAndSize: { color: "", small: "", medium: "", large: "" },
        imagesCount: 0,
        imagesFiles: [],
      },
    ]);
  };

  const removeColorHandler = (index: number) => {
    const list = [...productPropList];
    list.splice(index, 1);
    if (list.length === 0) {
      setProductPropList([
        {
          colorAndSize: { color: "", small: "", medium: "", large: "" },
          imagesCount: 0,
          imagesFiles: [],
        },
      ]);
    } else {
      setProductPropList(list);
    }
  };

  const removeImageHandler = (index: number, imageIndex: number) => {
    const list = [...productPropList];
    list[index].imagesFiles?.splice(imageIndex, 1);
    setProductPropList(list);
  };

  const uploadHandler = async () => {
    await postUpload();
  };

  return (
    <main>
      <h1>Add New Product</h1>
      <div>
        <label>Category: </label>
        {categoryArray.map((cat) => {
          return (
            <Fragment key={cat}>
              <label>{cat}</label>
              <input
                required
                type="text"
                name={cat}
                value={productCategory[cat]}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  catChangeHandler(e)
                }
              />
            </Fragment>
          );
        })}
      </div>
      <div>
        <label htmlFor="price">Price: $</label>
        <input
          name="price"
          id="price"
          type="number"
          value={price}
          min="0"
          onChange={(e) => setPrice(parseFloat(e.target.value))}
        ></input>
      </div>
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
      {productPropList.map((prop, index) => {
        return (
          <div key={index}>
            <div>
              <label>Colors:</label>
              <input
                required
                type="text"
                name="color"
                value={prop.colorAndSize.color}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  propsChangeHandler(e, index)
                }
              />
            </div>
            <div>
              <label>Sizes: </label>
              {sizesArray.map((size) => {
                return (
                  <Fragment key={size}>
                    <label>{size}</label>
                    <input
                      required
                      placeholder={"0"}
                      type="number"
                      name={size}
                      value={prop.colorAndSize[size]}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        propsChangeHandler(e, index)
                      }
                    />
                  </Fragment>
                );
              })}
            </div>
            <div>
              <label htmlFor="image">Upload Image: </label>
            </div>
            <div>
              {prop.imagesFiles &&
                prop.imagesFiles.length > 0 &&
                prop.imagesFiles.map((file, imageIndex) => {
                  return (
                    <div
                      key={imageIndex}
                      style={{
                        height: "100%",
                        width: "155px",
                        position: "relative",
                        border: "red 2px solid",
                        display: "inline-block",
                      }}
                    >
                      <button
                        style={{
                          position: "absolute",
                          zIndex: 9,
                          right: "5%",
                          cursor: "pointer",
                        }}
                        onClick={() => removeImageHandler(index, imageIndex)}
                      >
                        X
                      </button>
                      <Image
                        src={URL.createObjectURL(file)}
                        alt="selected image"
                        width={150}
                        height={150}
                      />
                    </div>
                  );
                })}
              <span>
                <input
                  type="file"
                  accept="image/jpeg"
                  name="image"
                  id="image"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    propsChangeHandler(e, index)
                  }
                />
              </span>
            </div>

            <div>
              <button onClick={() => removeColorHandler(index)}>
                Remove this color
              </button>
            </div>
          </div>
        );
      })}
      <button onClick={addMoreColorHandler}>Add more colors</button>

      <div>
        <button onClick={uploadHandler}>upload</button>
      </div>
    </main>
  );
};

export default AddProduct;
