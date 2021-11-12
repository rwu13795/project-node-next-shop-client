import { Fragment, memo, useState } from "react";
import dynamic from "next/dynamic";
import { useMediaQuery } from "react-responsive";

// UI //
import {
  Drawer,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  List,
  Collapse,
  Divider,
  Grid,
  Box,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import styles from "./__product-detail.module.css";

interface Props {
  description: string | undefined;
}

function ProductDescriptionWrapper({ description }: Props): JSX.Element {
  const isSmall = useMediaQuery({ query: "(max-width: 765px)" });

  const [expand, setExpand] = useState<boolean>(false);

  const toggleExpand = () => {
    setExpand(!expand);
  };

  return (
    <Fragment>
      {isSmall ? (
        <Grid sx={{ width: "90vw" }}>
          <Divider />
          <ListItemButton onClick={toggleExpand} className={_collapse_box}>
            <ListItemText primary="PRODUCT DETAILS" />
            {expand ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Divider />

          <Collapse in={expand} timeout="auto" unmountOnExit>
            <Grid sx={{ display: { xs: "block", md: "none" } }}>
              <div className={styles.product_desc_detail_box}>
                <div className={_detail}>{description}</div>
              </div>
            </Grid>
            <Divider />
          </Collapse>
        </Grid>
      ) : (
        <Grid
          sx={{ display: { xs: "none", sm: "none", md: "flex", lg: "none" } }}
        >
          <div className={styles.product_desc_detail_box}>
            <div style={{ fontSize: "18px" }}>Product Detail: </div>
            <div className={_detail}>{description}</div>
            <div className={_divider} style={{ width: "100%" }}></div>
          </div>
        </Grid>
      )}
    </Fragment>
  );
}

export default memo(
  dynamic(() => Promise.resolve(ProductDescriptionWrapper), {
    ssr: false,
  })
);

const _divider = styles.product_desc_divider;
const _collapse_box = styles.product_desc_detail_collapse_box;
const _detail = styles.product_desc_detail;
