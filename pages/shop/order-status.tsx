import { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { instantlyToTop } from "../../utils/helper-functions/scrollToTopInstantly";
import { setPageLoading } from "../../utils/redux-store/layoutSlice";
import OrderDetail from "../../components/auth/user-profile/order-detail";
import { Order } from "../auth/profile";

// UI //
import {
  FormControl,
  FormHelperText,
  OutlinedInput,
  InputLabel,
  Button,
} from "@mui/material";
import styles from "./__order-status.module.css";
import browserClient from "../../utils/axios-client/browser-client";

const OrderStatusPage: NextPage = ({}) => {
  const client = browserClient();
  const dispatch = useDispatch();

  const [orderId, setOrderId] = useState<string>("");
  const [order, setOrder] = useState<Order | undefined>();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    dispatch(setPageLoading(false));
  });
  useEffect(() => {
    return instantlyToTop;
  }, []);

  const onChangeHandler = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setOrderId(e.target.value);
    setError("");
  };

  const onSubmitHandler = async (
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    console.log(orderId);
    try {
      const { data } = await client.post(
        "http://localhost:5000/api/shop/order-status",
        { orderId }
      );
      setOrder(data.order);
    } catch (err: any) {
      //   console.log(err.response.data.errors);
      const error: string = err.response.data.errors[0].message;
      setOrder(undefined);
      setError(error);
    }
  };

  return (
    <main className={styles.main_container}>
      <div className={styles.main_grid}>
        <div className={styles.title_box}>
          <div className={styles.main_title}>ORDER STATUS</div>
          <div className={styles.sub_text}>
            Enter your ORDER ID, which you can find in your order confirmation
            email, below
          </div>
        </div>

        <form onSubmit={onSubmitHandler} className={styles.form_grid}>
          <FormControl className={styles.form_control}>
            <InputLabel htmlFor="ORDER ID" className={styles.form_label}>
              ORDER ID
            </InputLabel>
            <OutlinedInput
              type="text"
              name="ORDER_ID"
              value={orderId}
              onChange={onChangeHandler}
              disabled={false}
              label="ORDER_ID"
              className={styles.input_box}
            />
            <FormHelperText className={styles.input_error}>
              {error}
            </FormHelperText>
          </FormControl>
          <Button
            type="submit"
            variant="outlined"
            onClick={onSubmitHandler}
            className={styles.button}
          >
            FIND MY ORDER
          </Button>
        </form>

        <div className={styles.order_box}>
          {order && <OrderDetail order={order} index={999} />}
        </div>
      </div>
    </main>
  );
};

export default OrderStatusPage;
