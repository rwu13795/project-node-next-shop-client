import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/dist/client/router";
import { Fragment, useState, ChangeEvent } from "react";

import useUpload from "../../util/react-hooks/use-upload";
import SelectCategory from "../../components/add-product/select-category";
import AddTitle from "../../components/add-product/add-title";
import AddPrice from "../../components/add-product/add-price";
import AddDescription from "../../components/add-product/add-description";
import AddColorsProps from "../../components/add-product/add-colors-props";

export interface ProductProps {
  colorName: string;
  colorCode: string;
  sizes: { [name: string]: number };
  imagesCount: number;
  imagesFiles: File[];
}

export interface ProductCategory {
  // have to use computed property type if we want to add the category using mapping
  [name: string]: string;
}

const AddProduct: NextPage = ({}) => {
  const router = useRouter();

  const [productPropList, setProductPropList] = useState<ProductProps[]>([
    {
      colorName: "",
      colorCode: "",
      sizes: { small: 0, medium: 0, large: 0 },
      imagesCount: 0,
      imagesFiles: [],
    },
  ]);

  const [productCategory, setProductCategory] = useState<ProductCategory>({
    main: "",
    sub: "",
    title: "",
  });

  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState<string>("");

  // useUpload hook
  const { postUpload, errors } = useUpload({
    productCategory,
    productPropList,
    price,
    description,
    onSuccess: () => {
      console.log("OK");
      // router.push("/");
      // console.log(productPropList);
    },
  });
  // put the error message in html element
  const showError = errors && <h4>{errors.message}</h4>;

  const propsChangeHandler = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
    colorName?: string
  ): void => {
    let list = [...productPropList];

    // handle the "colorName"
    if (colorName) {
      list[index].colorName = colorName;
      setProductPropList(list);
      return;
    }

    // handlde images, sizes, and colorCode
    const { name, value } = e.currentTarget;
    if (name === "image") {
      const imageFile = (e.target.files as FileList)[0];
      list[index].imagesFiles.push(imageFile);
      list[index].imagesCount = list[index].imagesFiles.length;
      setProductPropList(list);
    } else if (name === "colorCode") {
      list[index].colorCode = value;
      setProductPropList(list);
    } else {
      list[index].sizes[name] = parseInt(value);
      setProductPropList(list);
    }
  };

  // material-ui <Select /> "onChange" ChangeEvent type is different from normal react ChangeEvent type
  const catChangeHandler = (
    e: ChangeEvent<{ name?: string; value: unknown }>
  ): void => {
    const value = e.target.value as string;
    const name = e.target.name as string;
    let category = { ...productCategory };
    category[name] = value;
    setProductCategory(category);
  };

  const addMoreColorHandler = (): void => {
    setProductPropList([
      ...productPropList,
      {
        colorName: "",
        colorCode: "",
        sizes: { small: 0, medium: 0, large: 0 },
        imagesCount: 0,
        imagesFiles: [],
      },
    ]);
  };

  const removeColorHandler = (index: number): void => {
    const list = [...productPropList];
    list.splice(index, 1);
    if (list.length === 0) {
      setProductPropList([
        {
          colorName: "",
          colorCode: "",
          sizes: { small: 0, medium: 0, large: 0 },
          imagesCount: 0,
          imagesFiles: [],
        },
      ]);
    } else {
      setProductPropList(list);
    }
  };

  const removeImageHandler = (index: number, imageIndex: number): void => {
    const list = [...productPropList];
    list[index].imagesFiles.splice(imageIndex, 1);
    setProductPropList(list);
  };

  const uploadHandler = async () => {
    await postUpload();
  };

  console.log(productCategory);
  console.log(productPropList);

  return (
    <main>
      <h1>Add New Product</h1>
      <div>
        {errors?.field === "main" && showError}
        <label>Category: </label>
        <SelectCategory
          catChangeHandler={catChangeHandler}
          productCategory={productCategory}
        />
      </div>
      <div>
        <AddTitle
          catChangeHandler={catChangeHandler}
          productCategory={productCategory}
        />
      </div>
      <div>
        {errors?.field === "main" && showError}
        <AddPrice price={price} setPrice={setPrice} />
      </div>
      <div>
        <AddDescription
          description={description}
          setDescription={setDescription}
        />
      </div>
      {productPropList.map((prop, index) => {
        return (
          <AddColorsProps
            key={index}
            productProp={prop}
            listIndex={index}
            propsChangeHandler={propsChangeHandler}
            removeColorHandler={removeColorHandler}
            removeImageHandler={removeImageHandler}
          />
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
