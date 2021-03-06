/*  *  *  *  *  *  NOTE  *  *  *  *  *  *  */
/*
  Don't use the React "useReducer" !
  every single change in the states will trigger the re-rendering
  in the parent and ALL the children components. And the re-rendering 
  causes the "addImages" component to keep re-acquiring the local images

  Since this "useUpload" hook is depending on the states in the reducer,
  every single change in the states will invoke this "useUpload" hook,
  it makes re-rendering problem even worse
*/
/*  *  *  *  *  *  NOTE  *  *  *  *  *  *  */

import { useState } from "react";

import browserClient from "../axios-client/browser-client";
import { inputNames } from "../enums-types/input-names";
import {
  ReducerColorProps,
  ReducerProductInfo,
} from "./_ref_add-product-reducer";
import { Errors } from "../helper-functions/input-error-check";
import { useDispatch } from "react-redux";
import { setPageLoading } from "../redux-store/layoutSlice";

interface ColorPropsForUpload {
  colorName: string;
  colorCode: string;
  sizes: { [name: string]: number };
  imageCount: number;
  modifiedImages?: (string | File)[];
  modifiedIndex?: number[];
}

export default function useUpload({
  colorPropsList,
  productInfo,
  editMode,
  onSuccess,
  productId,
  deletedImgaes,
  admin_username,
  csrfToken,
}: {
  colorPropsList: ReducerColorProps[];
  productInfo: ReducerProductInfo;
  editMode: boolean;
  onSuccess: Function;
  productId: string;
  deletedImgaes?: string[];
  admin_username: string;
  csrfToken: string;
}) {
  const client = browserClient();
  const dispatch = useDispatch();

  const [errors, setErrors] = useState<Errors>({});
  const [uploading, setUploading] = useState<boolean>(false);

  const postUpload = async () => {
    try {
      setUploading(true);
      dispatch(setPageLoading(true));

      setErrors({});

      // re-format the props and put the imageFiles into "formData"
      let colorPropsUpload: ColorPropsForUpload[] = [];

      const formData = new FormData();
      for (let elem of colorPropsList) {
        let modifiedIndex = [];
        let modifiedImages = [...elem.imageFiles];
        // seperate Url and images files
        if (elem.imageFiles.length > 0) {
          for (let i = 0; i < elem.imageFiles.length; i++) {
            if (editMode) {
              if (typeof elem.imageFiles[i] !== "string") {
                formData.append("uploaded_images", elem.imageFiles[i]);
                modifiedImages[i] = "modified";
                modifiedIndex.push(i);
              }
            } else {
              formData.append("uploaded_images", elem.imageFiles[i]);
            }
          }
        }
        // we don't want to send the imageFiles again, so we create and send
        // a new array containing the colorProps
        if (editMode) {
          colorPropsUpload.push({
            colorName: elem.colorName,
            colorCode: elem.colorCode,
            sizes: { ...elem.sizes },
            imageCount: elem.imageCount,
            modifiedImages,
            modifiedIndex,
          });
        } else {
          colorPropsUpload.push({
            colorName: elem.colorName,
            colorCode: elem.colorCode,
            sizes: { ...elem.sizes },
            imageCount: elem.imageCount,
          });
        }
      }

      const body = {
        ...productInfo,
        colorPropsListFromClient: colorPropsUpload,
        deletedImgaes,
        productId,
        admin_username,
        csrfToken,
      };

      // the "body" cannot be put inside "req.body" directly while using FormData,
      // this "body" has to be added to "req.body.propName", and we need to parse this
      // "req.body.document" in the server
      formData.append("document", JSON.stringify(body));

      const response = await client.post(
        editMode
          ? "http://localhost:5000/api/admin/edit-product"
          : "http://localhost:5000/api/admin/add-product",
        formData
      );

      if (onSuccess) {
        onSuccess();
      }
      // setUploading(false);
      return response;
    } catch (err: any) {
      dispatch(setPageLoading(false));
      setUploading(false);
      // catch the errors from the "request-validator"
      // the error messages array sent from the server is inside "err.response.data.errors"
      console.log(
        "> > > useUpload - catch error < < <",
        err.response.data.errors
      );

      // "data" should be [ { message: string, field: string }, { message: string, field: string }, ... ]
      let errorMsg: Errors = {};
      for (let e of err.response.data.errors) {
        if (e.field !== "colorPropsListFromClient") {
          errorMsg[e.field] = e.message;
        } else {
          if (e.message === inputNames.colorCode) {
            errorMsg[inputNames.colorCode] = "Please select a color";
          } else if (e.message === inputNames.colorName) {
            errorMsg[inputNames.colorName] =
              "Please select a name for the color";
          } else if (e.message === inputNames.size) {
            errorMsg[inputNames.size] = "Invalid quantity";
          } else {
            errorMsg[inputNames.imagesCount] =
              "Please upload at least one image";
          }
        }
      }

      setErrors({ ...errorMsg });
    }
  };

  return { postUpload, errors, setErrors, uploading };
}
