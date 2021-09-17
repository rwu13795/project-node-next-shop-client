import type { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";

import useUpload from "../../util/react-hooks/use-upload";
import SelectCategory from "../../components/add-product/select-category";
import AddTitle from "../../components/add-product/add-title";
import AddPrice from "../../components/add-product/add-price";
import AddDescription from "../../components/add-product/add-description";
import AddColorsProps from "../../components/add-product/add-color-props";
import { FieldNames } from "../../util/enums/input-field-names-enum";

export interface ProductProps {
  colorName: string;
  colorCode: string;
  sizes: { [name: string]: number };
  imagesCount: number;
  imagesFiles: File[];
}

export interface ProductInfo {
  // have to use computed property type if we want to add the category using mapping
  [fieldName: string]: string | number | undefined;
}

export type PropsChangeHandler = (
  inputValue: string,
  inputFiled: string,
  listIndex: number,
  imageFile?: File,
  imageIndex?: number
) => void;

export type InfoChangeHandler = (
  inputValue: string | number | undefined,
  inputField: string
) => void;

const AddProduct: NextPage = ({}) => {
  const router = useRouter();

  const initialProductProps: ProductProps = {
    colorName: "",
    colorCode: "",
    sizes: { small: 0, medium: 0, large: 0 },
    imagesCount: 0,
    imagesFiles: [],
  };

  const [productPropList, setProductPropList] = useState<ProductProps[]>([
    {
      colorName: "",
      colorCode: "",
      sizes: { small: 0, medium: 0, large: 0 },
      imagesCount: 0,
      imagesFiles: [],
    },
    // have to initialize the props, or React will throw "uncontrolled input" warning,
    // when the value changing from undefined to a defined value
  ]);

  const [productInfo, setProductInfo] = useState<ProductInfo>({
    [FieldNames.main]: "",
    [FieldNames.sub]: "",
    [FieldNames.title]: "",
    [FieldNames.price]: 0,
  });

  // useUpload hook
  const { postUpload, errors } = useUpload({
    productInfo,
    productPropList,
    onSuccess: () => {
      console.log("OK");
      // router.push("/");
      // console.log(productPropList);
    },
  });

  const propsChangeHandler: PropsChangeHandler = (
    inputValue,
    inputFiled,
    listIndex,
    imageFile?,
    imageIndex?
  ): void => {
    let list = [...productPropList];

    switch (inputFiled) {
      case FieldNames.addImage:
        if (imageFile) {
          console.log("add product add image", listIndex);
          list[listIndex].imagesFiles.push(imageFile);
          list[listIndex].imagesCount = list[listIndex].imagesFiles.length;
          setProductPropList(list);
          break;
        }
      // imageFile = (e.target.files as FileList)[0];
      // if(editMode) {}
      case FieldNames.replaceImage:
        if (imageIndex !== undefined && imageFile !== undefined) {
          list[listIndex].imagesFiles[imageIndex] = imageFile;
          setProductPropList(list);
        }
        break;
      case FieldNames.removeImage:
        list[listIndex].imagesFiles.splice(imageIndex!, 1);
        list[listIndex].imagesCount = list[listIndex].imagesCount - 1;
        if (list[listIndex].imagesCount === 0) {
          const imageInput = document.getElementById(
            "upload-image"
          ) as HTMLInputElement;
          imageInput.value = "";
        }
        setProductPropList(list);
        break;
      case FieldNames.colorCode:
        console.log("colorCode", listIndex);
        list[listIndex].colorCode = inputValue;
        console.log("colorCode", list);
        setProductPropList(list);
        break;
      case FieldNames.colorName:
        console.log(listIndex);
        list[listIndex].colorName = inputValue;
        setProductPropList(list);
        break;
      case FieldNames.removeColor:
        list.splice(listIndex, 1);
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
        break;
      default:
        console.log("in add size, ", listIndex);
        list[listIndex].sizes[inputFiled] = parseInt(inputValue);
        setProductPropList(list);
        break;
    }
  };

  // material-ui <Select /> "onChange" SelectChangeEvent type is different from normal react ChangeEvent type
  const infoChangeHandler: InfoChangeHandler = (inputValue, inputField) => {
    let info = { ...productInfo };
    info[inputField] = inputValue;
    setProductInfo(info);
  };

  const uploadHandler = async () => {
    await postUpload();
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

  console.log(productInfo);
  console.log(productPropList);

  return (
    <main>
      <h1>Add New Product</h1>
      <div>
        <label>Category: </label>
        <SelectCategory
          infoChangeHandler={infoChangeHandler}
          productInfo={productInfo}
          propError={errors}
        />
      </div>
      <div>
        <AddTitle
          infoChangeHandler={infoChangeHandler}
          productInfo={productInfo}
        />
        {errors && errors[FieldNames.title] && (
          <div>{errors[FieldNames.title]}</div>
        )}
      </div>
      <div>
        <AddPrice
          infoChangeHandler={infoChangeHandler}
          productInfo={productInfo}
        />
      </div>
      <div>
        <AddDescription
          infoChangeHandler={infoChangeHandler}
          productInfo={productInfo}
        />
        {errors && errors[FieldNames.desc] && (
          <div>{errors[FieldNames.desc]}</div>
        )}
      </div>
      {productPropList.map((prop, index) => {
        return (
          <AddColorsProps
            key={index}
            productProp={prop}
            listIndex={index}
            propsChangeHandler={propsChangeHandler}
            propError={errors}
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
