import { useState } from "react";

import browserClient from "../axios-client/browser-client";
import { ProductProps, ProductCategory } from "../../pages/admin/add-product";

interface Errors {
  message: string | null;
  errorField: string | null;
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
      setErrors({ message: null, errorField: null });

      // re-format the props and put the imageFiles into "formData"
      const { title, main: main_cat, sub: sub_cat } = productCategory;
      let list = [...productPropList];

      const formData = new FormData();
      for (let elem of list) {
        // "uploaded_images" is used in "multer"
        if (elem.imagesFiles) {
          for (let image of elem.imagesFiles) {
            formData.append("uploaded_images", image);
          }
        }
        delete elem.imagesFiles;
      }

      const body = {
        title,
        main_cat,
        sub_cat,
        price,
        colorProps: productPropList,
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
      console.log(err);

      // "data" should be { message: string, errorField: string }

      //   setErrors({ ...err });
    }
  };

  return { postUpload, errors };
};

export default useUpload;
