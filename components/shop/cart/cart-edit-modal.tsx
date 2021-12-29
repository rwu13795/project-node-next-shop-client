import { useCallback, useState, memo } from "react";
import dynamic from "next/dynamic";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

import ProductDetail from "../product/product-detail/product-detail";
import { PageProductProps } from "../../../utils/react-hooks/get-more-products";
import { CartItem, setEditItem } from "../../../utils/redux-store/userSlice";
import browserClient from "../../../utils/axios-client/browser-client";

// UI //
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import styles from "./__edit-modal.module.css";
import { setPageLoading } from "../../../utils/redux-store/layoutSlice";

interface ProductProps {
  product: PageProductProps;
}

interface Props {
  category: string;
  productId: string;
  index: number;
  editItem: CartItem;
}

function CartEditModal({ category, productId, index, editItem }: Props) {
  const client = browserClient();
  const isSmall = useMediaQuery({ query: "(max-width: 765px)" });
  const dispatch = useDispatch();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState<PageProductProps | undefined>();

  // fetch the item which is being edited for the modal in large screen
  const fetchProduct = useCallback(async () => {
    try {
      const { data } = await client.get<ProductProps>(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/products/detail/${productId}`
      );
      setProduct(data.product);
    } catch (err) {
      console.log(err);
      setProduct(undefined);
    }
  }, []);

  const handleClose = () => setOpen(false);
  const editItemHandler = async () => {
    dispatch(setEditItem({ index, item: editItem }));
    if (isSmall) {
      dispatch(setPageLoading(true));
      // if the screen is small, don't use the modal, render a new product detail
      // page with the editItem info
      router.push(`/shop/product-detail/${category}_edit_${productId}`);
    } else {
      await fetchProduct();
      setOpen(true);
    }
  };

  return (
    <div>
      <Button
        variant="outlined"
        onClick={editItemHandler}
        className={styles.edit_button}
      >
        Edit Details
      </Button>
      {!isSmall && (
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <Box className={styles.edit_modal_box}>
              {!product ? (
                <h1>No product found</h1>
              ) : (
                <ProductDetail
                  product={product}
                  editModeItem={true}
                  handleClose={handleClose}
                />
              )}
            </Box>
          </Fade>
        </Modal>
      )}
    </div>
  );
}

export default memo(
  dynamic(() => Promise.resolve(CartEditModal), {
    ssr: false,
  })
);
