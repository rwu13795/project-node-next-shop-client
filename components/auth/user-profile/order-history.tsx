import { ChangeEvent, useEffect, useState, memo, Fragment } from "react";

import browserClient from "../../../utils/axios-client/browser-client";
import { Order } from "../../../pages/auth/profile";
import OrderDetail from "./order-detail";

// UI //
import { Pagination } from "@mui/material";
import styles from "./__profile.module.css";

interface Props {
  orders: Order[];
  ordersTotal: number;
}

function OrderHistory({
  orders: startOrders,
  ordersTotal,
}: Props): JSX.Element {
  const ORDER_PER_PAGE = 5;
  const client = browserClient();

  const [pageNum, setPageNum] = useState<number>(1);
  const [orders, setOrders] = useState<Order[]>(startOrders);

  useEffect(() => {});

  const pageChangeHandler = async (e: ChangeEvent<any>, newPage: number) => {
    if (pageNum === newPage) return;
    try {
      const { data }: { data: Props } = await client.get(
        "http://localhost:5000/api/shop/get-order-history",
        { params: { pageNum: newPage } }
      );
      setPageNum(newPage);
      setOrders(data.orders);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className={styles.main_container}>
      <div className={styles.main_grid}>
        {orders.length === 0 ? (
          <h1>You {"don't"} have any order</h1>
        ) : (
          <Fragment>
            {orders.map((order, index) => {
              return <OrderDetail key={index} order={order} index={index} />;
            })}

            <Pagination
              count={Math.ceil(ordersTotal / ORDER_PER_PAGE)}
              variant="outlined"
              color="primary"
              onChange={pageChangeHandler}
              page={pageNum}
              className={styles.pagination_box}
            />
          </Fragment>
        )}
      </div>
    </main>
  );
}

export default memo(OrderHistory);
