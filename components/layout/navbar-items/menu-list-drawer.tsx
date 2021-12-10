import { Fragment, useState, SetStateAction, Dispatch, memo } from "react";
import { useRouter } from "next/router";

import {
  mainCatArray,
  MainCategory,
  womenMenuList,
  menMenuList,
  kidsMenuList,
} from "../../../utils/enums-types/product-category";
import { ProductCatNumAdmin } from "../../../pages/admin/products-list";
import { useDispatch } from "react-redux";
import { setPageLoading } from "../../../utils/redux-store/layoutSlice";

// UI //
import {
  Drawer,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  List,
  Collapse,
  Divider,
  Box,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import styles from "./__menu-list.module.css";

interface Props {
  cat: string;
  page?: string;
  productCatNum?: ProductCatNumAdmin;
  setIsDrawerOpen?: Dispatch<SetStateAction<boolean>>;
  selectCatHandler?: (main: string, sub: string) => Promise<void>;
}

function MeunListDrawer({
  cat,
  page,
  productCatNum,
  setIsDrawerOpen,
  selectCatHandler,
}: Props): JSX.Element {
  const router = useRouter();
  const dispatch = useDispatch();

  const [expand, setExpand] = useState<boolean>(false);

  const toggleExpand = () => {
    setExpand(!expand);
  };

  const onProductClickHandler = (product: string) => {
    dispatch(setPageLoading(true));
    if (page === "admin" && selectCatHandler) {
      selectCatHandler(cat, product);

      let elem = document.getElementById("admin_cat_title");
      if (elem) elem.scrollIntoView({ block: "center" });
      return;
    }
    router.push(`/shop/${cat.toLowerCase()}/${product.toLowerCase()}`);
    if (setIsDrawerOpen) setIsDrawerOpen(false);
  };

  const onCatClickHandler = (cat: string) => {
    dispatch(setPageLoading(true));
    router.push(`/shop/${cat.toLowerCase()}`);
    if (setIsDrawerOpen) setIsDrawerOpen(false);
  };

  let list: { [key: string]: string[] } | undefined;
  let keys: string[] | undefined;
  switch (cat) {
    case MainCategory.women: {
      list = womenMenuList;
      keys = Object.keys(womenMenuList);
      break;
    }
    case MainCategory.men: {
      list = menMenuList;
      keys = Object.keys(menMenuList);
      break;
    }
    case MainCategory.kids: {
      list = kidsMenuList;
      keys = Object.keys(kidsMenuList);
      break;
    }
    default:
      break;
  }

  if (!list || !keys) {
    return (
      <Fragment>
        <ListItemButton
          sx={{ pl: 2 }}
          onClick={() => onProductClickHandler(cat)}
        >
          <ListItemText primary={cat.toUpperCase()} />
        </ListItemButton>
        <Divider />
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Divider />
      <ListItemButton onClick={toggleExpand} sx={{ pl: 2 }}>
        <ListItemText primary={cat.toUpperCase()} />
        {expand ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={expand} timeout="auto" unmountOnExit>
        <ListItemButton sx={{ pl: 4 }}>
          {page !== "admin" && (
            <ListItemText
              primary={`View all ${cat}'s collection`}
              onClick={() => onCatClickHandler(cat)}
            />
          )}
        </ListItemButton>
        <List component="div" disablePadding>
          {keys &&
            keys.map((key, index) => {
              return (
                <Box key={index}>
                  <Box className={styles.menu_drawer_items_column_head}>
                    {key.toUpperCase()}:
                  </Box>
                  {list &&
                    list[key].map((product) => {
                      let num = 0;
                      let main = cat.toLowerCase();
                      let sub = product.toLowerCase();
                      if (productCatNum && page === "admin") {
                        if (productCatNum[main]) {
                          if (productCatNum[main][sub]) {
                            num = productCatNum[main][sub];
                          }
                        }
                      }
                      return (
                        <ListItemButton
                          key={product}
                          className={styles.menu_drawer_items}
                        >
                          {productCatNum && page === "admin" ? (
                            <ListItemText
                              primary={`${product} [${num} item${
                                num > 0 ? "s" : ""
                              }] `}
                              onClick={() => onProductClickHandler(product)}
                            />
                          ) : (
                            <ListItemText
                              primary={product}
                              onClick={() => onProductClickHandler(product)}
                            />
                          )}
                        </ListItemButton>
                      );
                    })}
                </Box>
              );
            })}
        </List>
      </Collapse>
      <Divider />
    </Fragment>
  );
}

export default memo(MeunListDrawer);
