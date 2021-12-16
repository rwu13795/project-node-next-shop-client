import { useState, memo, Fragment } from "react";
import Image from "next/image";

import browserClient from "../../../utils/axios-client/browser-client";
import { Order } from "../../../pages/auth/profile";
import { CartItem } from "../../../utils/redux-store/userSlice";

// UI //
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import styles from "./__order-detail.module.css";

interface Props {
  order: Order;
  index: number;
}
interface Props_sub {
  items: CartItem[];
}

function OrderDetail({ order, index }: Props): JSX.Element {
  const [expandDetail, setExpandDetail] = useState<boolean>(false);

  const address = order.shippingAddress;
  const detailBoxId = `detail_box_${index}`;

  const order_detail_box =
    index !== 999 ? styles.order_detail_box : styles.order_detail_box_show;

  const expandDetailHandler = (detailBoxId: string) => {
    setExpandDetail((prev) => {
      return !prev;
    });

    let box = document.getElementById(detailBoxId);
    if (box) {
      if (box.style.maxHeight === "0px" || box.style.maxHeight === "") {
        box.style.maxHeight = box.scrollHeight + "px";
      } else {
        box.style.maxHeight = "0px";
      }
    }
  };

  return (
    <div className={styles.order_container}>
      <div className={styles.order_header}>
        <div>
          <span className={styles.order_date}>Order placed on:</span>
          {" " + new Date(order.date).toDateString()}
        </div>
        <div className={styles.order_total}>Total: ${order.total}</div>
      </div>
      <div className={styles.order_body_container}>
        <div className={styles.order_body}>
          <ItemSummaryMemo items={order.items} />
        </div>
        <div className={styles.order_detail_container}>
          {index !== 999 && (
            <div
              onClick={() => expandDetailHandler(detailBoxId)}
              className={styles.view_order_detail}
            >
              {expandDetail ? (
                <div className={styles.expand_buttons}>
                  <ExpandLessIcon />
                  Close Order Detail
                  <ExpandLessIcon />
                </div>
              ) : (
                <div className={styles.expand_buttons}>
                  <ExpandMoreIcon />
                  View Order Detail
                  <ExpandMoreIcon />
                </div>
              )}
            </div>
          )}

          <div className={order_detail_box} id={detailBoxId}>
            <div className={styles.order_detail_box_inner}>
              <div className={styles.order_detail_text}>
                <div className={styles.order_detail_sub_title}>
                  Shipping Address
                </div>
                <div>{address.first_name + " " + address.last_name}</div>
                <div>{address.address_1}</div>
                <div>{address.address_2}</div>
                <div>{`${address.city}, ${address.state} ${address.zip_code}`}</div>
              </div>
              <div className={styles.order_detail_text}>
                <div className={styles.order_detail_sub_title}>
                  Payment Method
                </div>
                <div>{order.paymentDetail.payment_processer}</div>
                <div className={styles.order_detail_sub_title}>
                  Payment Status
                </div>
                <div>{order.paymentDetail.payment_status}</div>
              </div>
              <div className={styles.order_detail_text}>
                <div className={styles.order_detail_sub_title}>Order ID</div>
                <div>{order._id}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(OrderDetail);

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
