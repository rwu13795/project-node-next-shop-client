import { useState } from "react";

import browserClient from "../axios-client/browser-client";
import { ProductProps, ProductCategory } from "../../pages/admin/add-product";

interface Errors {
  message: string | null;
  field: string | null;
}

interface ColorProps {
  colorName: string;
  colorCode: string;
  sizes: { [name: string]: number };
  imagesCount: number;
}

const useUpload = ({
  productCategory,
  productPropList,
  price,
  description,
  onSuccess,
}: {
  productCategory: ProductCategory;
  productPropList: ProductProps[];
  price: number;
  description: string;
  onSuccess: Function;
}) => {
  const client = browserClient();

  const [errors, setErrors] = useState<Errors>();

  const postUpload = async () => {
    try {
      setErrors({ message: null, field: null });

      // re-format the props and put the imageFiles into "formData"
      const { title, main: main_cat, sub: sub_cat } = productCategory;
      let colorProps: ColorProps[] = [];

      const formData = new FormData();
      for (let elem of productPropList) {
        // "uploaded_images" is used in "multer"
        if (elem.imagesFiles) {
          for (let image of elem.imagesFiles) {
            formData.append("uploaded_images", image);
          }
        }
        // we don't want to send the imageFiles again, so we create and send
        // a new array containing the colorProps
        colorProps.push({
          colorName: elem.colorName,
          colorCode: elem.colorCode,
          sizes: { ...elem.sizes },
          imagesCount: elem.imagesCount,
        });
      }

      const body = {
        title,
        main_cat,
        sub_cat,
        price,
        colorProps,
        description,
      };

      formData.append("document", JSON.stringify(body));

      const response = await client.post(
        "http://localhost:5000/api/admin/post-new-product",
        formData
      );

      if (onSuccess) {
        onSuccess();
      }

      return response;
    } catch (err: any) {
      // the data in the errors which are sent from the server, are inside
      // the "err.response.data" field
      console.log("> > > useUpload - catch error < < <", err.response.data);

      // "data" should be { message: string, field: string }
      setErrors({ ...err.response.data });
    }
  };

  return { postUpload, errors };
};

export default useUpload;
