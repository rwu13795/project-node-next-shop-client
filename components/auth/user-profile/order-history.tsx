import { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";

import { Pagination } from "@mui/material";

import browserClient from "../../../utils/axios-client/browser-client";
import { Order } from "../../../pages/auth/profile";

interface Props {
  orders: Order[];
  ordersTotal: number;
}

export default function OrderHistory({
  orders: startOrders,
  ordersTotal,
}: Props): JSX.Element {
  const client = browserClient();

  const PRODUCT_PER_PAGE = 5;
  const [pageNum, setPageNum] = useState<number>(1);
  const [orders, setOrders] = useState<Order[]>(startOrders);

  const pageChangeHandler = async (
    e: ChangeEvent<any>,
    currentPageNum: number
  ) => {
    if (pageNum === currentPageNum) return;
    try {
      const { data }: { data: Props } = await client.post(
        "http://localhost:5000/api/shop/get-order-history",
        { pageNum: currentPageNum }
      );
      setPageNum(currentPageNum);
      setOrders(data.orders);
    } catch (err) {
      console.log(err);
    }
  };

  console.log(orders);

  return (
    <main>
      {orders.map((order) => {
        return (
          <div key={order._id}>
            <div>Order placed on: {new Date(order.date).toDateString()}</div>
            <div>Total: ${order.total}</div>
            <div>
              {order.items.map((item) => {
                return (
                  <div key={item.title + item.colorName}>
                    <div>{item.title}</div>
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      width={100}
                      height={100}
                    />
                    <div>Price: ${item.price}</div>
                    <div>Quantity: {item.quantity}</div>
                    <div>
                      Size: {item.size} Color: {item.colorName} ColorCode:{" "}
                      {item.colorCode}
                    </div>
                  </div>
                );
              })}
            </div>
            <hr />
            <br />
            <br />
          </div>
        );
      })}

      <Pagination
        count={Math.ceil(ordersTotal / PRODUCT_PER_PAGE)}
        variant="outlined"
        color="primary"
        onChange={pageChangeHandler}
        page={pageNum}
      />
    </main>
  );
}
