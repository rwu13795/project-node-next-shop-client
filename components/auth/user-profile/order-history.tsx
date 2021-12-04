import { ChangeEvent, useEffect, useState, memo, Fragment } from "react";
import Image from "next/image";

import browserClient from "../../../utils/axios-client/browser-client";
import { Order } from "../../../pages/auth/profile";
import { CartItem } from "../../../utils/redux-store/userSlice";

// UI //
import { Pagination, Grid } from "@mui/material";
import styles from "./__profile.module.css";

interface Props {
  orders: Order[];
  ordersTotal: number;
}
interface Props_sub {
  items: CartItem[];
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
            {orders.map((order) => {
              return (
                <div key={order._id} className={styles.order_container}>
                  <div className={styles.order_header}>
                    <div>
                      <span className={styles.order_date}>
                        Order placed on:
                      </span>
                      {" " + new Date(order.date).toDateString()}
                    </div>
                    <div className={styles.order_total}>
                      Total: ${order.total}
                    </div>
                  </div>
                  <div className={styles.order_body}>
                    <ItemSummaryMemo items={order.items} />
                  </div>
                </div>
              );
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

function ItemSummary({ items }: Props_sub): JSX.Element {
  return (
    <Fragment>
      {items.map((item, index) => {
        return (
          <div key={index} className={styles.item_container}>
            <div className={styles.image_container}>
              <Image
                src={item.imageUrl}
                alt={item.imageUrl}
                width={200}
                height={230}
              />
            </div>
            <div className={styles.desc_container}>
              <div className={styles.desc_title}>
                {item.title.toUpperCase()}
              </div>
              <div>Color: {item.colorName.toUpperCase()}</div>
              <div>Price: ${item.price}</div>
              <div>Size: {item.size.toUpperCase()}</div>
              <div>Qty: {item.quantity}</div>
            </div>
          </div>
        );
      })}
    </Fragment>
  );
}

const ItemSummaryMemo = memo(ItemSummary);
