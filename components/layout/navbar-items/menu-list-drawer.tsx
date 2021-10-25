import { Fragment, useState, SetStateAction, Dispatch } from "react";
import { useRouter } from "next/router";

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

import {
  mainCatArray,
  MainCategory,
  womenMenuList,
  menMenuList,
  kidsMenuList,
} from "../../../utils/enums-types/product-category";
import classes from "./_menu-list.module.css";

interface Props {
  cat: string;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

export default function MeunListDrawer({
  cat,
  setIsDrawerOpen,
}: Props): JSX.Element {
  const router = useRouter();

  const [expand, setExpand] = useState<boolean>(false);

  const toggleExpand = () => {
    setExpand(!expand);
  };

  const onProductClickHandler = (product: string) => {
    router.push(`/shop/${cat.toLowerCase()}/${product.toLowerCase()}`);
    setIsDrawerOpen(false);
  };

  const onCatClickHandler = (cat: string) => {
    router.push(`/shop/${cat.toLowerCase()}`);
    setIsDrawerOpen(false);
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
      <ListItemButton onClick={toggleExpand} sx={{ pl: 2 }}>
        <ListItemText primary={cat.toUpperCase()} />
        {expand ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Divider />

      <Collapse in={expand} timeout="auto" unmountOnExit>
        <ListItemButton sx={{ pl: 4 }}>
          <ListItemText
            primary={`View all ${cat}'s collection`}
            onClick={() => onCatClickHandler(cat)}
          />
        </ListItemButton>
        <List component="div" disablePadding>
          {keys &&
            keys.map((key, index) => {
              return (
                <Box key={index}>
                  <Box className={classes.menu_drawer_items_column_head}>
                    {key.toUpperCase()}:
                  </Box>
                  {list &&
                    list[key].map((product) => {
                      return (
                        <ListItemButton
                          key={product}
                          className={classes.menu_drawer_items}
                        >
                          <ListItemText
                            primary={product}
                            onClick={() => onProductClickHandler(product)}
                          />
                        </ListItemButton>
                      );
                    })}
                </Box>
              );
            })}
        </List>
        <Divider />
      </Collapse>
    </Fragment>
  );
}
