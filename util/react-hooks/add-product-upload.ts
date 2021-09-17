import { useState } from "react";

import browserClient from "../axios-client/browser-client";
import { FieldNames } from "../enums/input-field-names";
import { ColorProps, ProductInfo } from "./add-product-reducer";

export interface Errors {
  [field: string]: string;
}

interface ColorPropsForUpload {
  colorName: string;
  colorCode: string;
  sizes: { [name: string]: number };
  imagesCount: number;
}

const useUpload = ({
  colorPropsList,
  productInfo,
  onSuccess,
}: {
  colorPropsList: ColorProps[];
  productInfo: ProductInfo;
  onSuccess: Function;
}) => {
  const client = browserClient();

  const [errors, setErrors] = useState<Errors | null>();

  const postUpload = async () => {
    try {
      setErrors(null);

      // re-format the props and put the imageFiles into "formData"
      let colorPropsUpload: ColorPropsForUpload[] = [];

      const formData = new FormData();
      for (let elem of colorPropsList) {
        // "uploaded_images" is used in "multer"
        if (elem.imagesFiles) {
          for (let image of elem.imagesFiles) {
            formData.append("uploaded_images", image);
          }
        }
        // we don't want to send the imageFiles again, so we create and send
        // a new array containing the colorProps
        colorPropsUpload.push({
          colorName: elem.colorName,
          colorCode: elem.colorCode,
          sizes: { ...elem.sizes },
          imagesCount: elem.imagesCount,
        });
      }

      let body = {
        ...productInfo,
        colorPropsList: colorPropsUpload,
      };

      console.log(body);

      // use the index of old imagesUrl to update
      // if (updatedImageIndex) { body = {...body, updatedImageIndex } }

      // the "body" cannot be put inside "req.body" directly while using FormData,
      // this "body" has to be added to "req.body.propName", and we need to parse this
      // "req.body.document" in the server
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
      // catch the errors from the "request-validator"
      // the error messages array sent from the server is inside "err.response.data.errors"
      console.log(
        "> > > useUpload - catch error < < <",
        err.response.data.errors
      );

      // "data" should be [ { message: string, field: string }, { message: string, field: string }, ... ]
      let errorMsg: Errors = {};
      for (let e of err.response.data.errors) {
        if (e.field !== "colorPropsList") {
          errorMsg[e.field] = e.message;
        } else {
          if (e.message === FieldNames.colorCode) {
            errorMsg[FieldNames.colorCode] = "Please select a color";
          } else if (e.message === FieldNames.colorName) {
            errorMsg[FieldNames.colorName] =
              "Please select a name for the color";
          } else {
            errorMsg[FieldNames.imagesCount] =
              "Please upload at least one image";
          }
        }
      }
      console.log(errorMsg);

      setErrors({ ...errorMsg });
    }
  };

  return { postUpload, errors };
};

export default useUpload;
