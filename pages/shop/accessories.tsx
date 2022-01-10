import { GetServerSidePropsContext, NextPage } from "next";
import { useDispatch } from "react-redux";
import { SyntheticEvent, useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";

import { setPageLoading } from "../../utils/redux-store/layoutSlice";
import { instantlyToTop } from "../../utils/helper-functions/scrollToTopInstantly";
import { MainCat_PageProps } from "../../utils/enums-types/categories-interfaces";
import AccessoryTab from "../../components/shop/product/accessory-tab";

// UI //
import { Box, Tab, Grid, useMediaQuery } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import styles from "./__checkout.module.css";

interface Props extends MainCat_PageProps {
  tagNum: string;
}

const AccessoriesPage: NextPage<Props> = ({
  tagNum,
  products,
  subCatTitles,
}) => {
  const dispatch = useDispatch();

  const isSmall = useMediaQuery("(max-width: 765px)");
  const [stage, setStage] = useState<string>(tagNum);

  useEffect(() => {
    dispatch(setPageLoading(false));
  });
  useEffect(() => {
    return instantlyToTop();
  }, []);

  const tagChangeHandler = (event: SyntheticEvent, newValue: string) => {
    setStage(newValue);
  };

  const muiSX = { minWidth: isSmall ? "auto" : "150px" };

  return (
    <main className={styles.main_container_accessory}>
      <Head>
        <title>Accessories</title>
      </Head>

      <div className={styles.main_title_acc} style={{ textAlign: "center" }}>
        ACCESSORIES
      </div>

      <div className={styles.body}>
        <TabContext value={stage}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Grid container className={styles.tags_title_container}>
              <TabList
                onChange={tagChangeHandler}
                variant="scrollable"
                allowScrollButtonsMobile
                className={styles.tags_title_box}
              >
                <Tab
                  label="MEN"
                  value={"1"}
                  className={styles.tag}
                  sx={muiSX}
                />
                <Tab
                  label="WOMEN"
                  value={"2"}
                  className={styles.tag}
                  sx={muiSX}
                />
                <Tab
                  label="KIDS"
                  value={"3"}
                  className={styles.tag}
                  sx={muiSX}
                />
              </TabList>
            </Grid>
          </Box>
          <TabPanel value={"1"} className={styles.tab_container}>
            <AccessoryTab main_cat="men" />
          </TabPanel>
          <TabPanel value={"2"} className={styles.tab_container}>
            <AccessoryTab
              startProducts={products}
              star_subCatTitles={subCatTitles}
              main_cat="women"
            />
          </TabPanel>
          <TabPanel value={"3"} className={styles.tab_container}>
            <AccessoryTab main_cat="kids" />
          </TabPanel>
        </TabContext>
      </div>
    </main>
  );
};

export default AccessoriesPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  let main_cat = context.query.main_cat as string;

  if (!main_cat) {
    main_cat = "women";
  }

  const { data }: { data: MainCat_PageProps } = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/products/get-accessories?main_cat=${main_cat}`
  );

  let tagNum: string;
  if (main_cat === "men") {
    tagNum = "1";
  } else if (main_cat === "kids") {
    tagNum = "3";
  } else {
    tagNum = "2";
  }

  return {
    props: {
      products: data.products,
      subCatTitles: data.subCatTitles,
      tagNum,
      filter_view: true,
      page: "accessory",
    },
  };
}
