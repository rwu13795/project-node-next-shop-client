import { useCallback, useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";

import ProductDetail from "../product/product-detail/product-detail";
import { PageProductProps } from "../../../utils/react-hooks/get-more-products";
import { CartItem } from "../../../utils/redux-store/userSlice";
import browserClient from "../../../utils/axios-client/browser-client";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  outerHeight: 800,
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface ProductProps {
  product: PageProductProps;
}

interface Props {
  category: string;
  productId: string;
  index: number;
  editItem: CartItem;
}

export default function CartEditModal({
  category,
  productId,
  index,
  editItem,
}: Props) {
  const client = browserClient();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [product, setProduct] = useState<PageProductProps | undefined>();

  const fetchProduct = useCallback(async () => {
    try {
      const { data } = await client.get<ProductProps>(
        `http://localhost:5000/api/products/detail/${productId}`
      );
      console.log(data.product);

      setProduct(data.product);
    } catch (err) {
      console.log(err);
      setProduct(undefined);
    }
  }, []);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return (
    <div>
      <Button onClick={handleOpen}>Edit Details</Button>
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
          <Box sx={style}>
            {!product ? (
              <h1>No product found</h1>
            ) : (
              <ProductDetail
                product={product}
                editMode={true}
                index={index}
                handleClose={handleClose}
                editItem={editItem}
              />
            )}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
