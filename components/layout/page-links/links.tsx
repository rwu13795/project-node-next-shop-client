import { memo, Fragment } from "react";
import Link from "next/link";

import { capitalize } from "../../../utils/helper-functions/capitalize-first-letter";

// UI //
import { Box, Tooltip } from "@mui/material";
import styles from "./__links.module.css";

interface Props {
  main_cat: string;
  sub_cat?: string;
  title?: string;
}

function PageLinks({ main_cat, sub_cat, title }: Props): JSX.Element {
  return (
    <div>
      <Tooltip title="Home Page">
        <Box className={styles.box}>
          <Link href="/">
            <a className={styles.page_link}>HOME</a>
          </Link>
        </Box>
      </Tooltip>
      <span>/</span>
      <Tooltip title={`${capitalize(main_cat)} Collection`}>
        <Box className={styles.box}>
          <Link href={`/shop/${main_cat}`}>
            <a className={styles.page_link}>{main_cat.toUpperCase()}</a>
          </Link>
        </Box>
      </Tooltip>
      {sub_cat && (
        <Fragment>
          <span>/</span>
          <Tooltip title={`${capitalize(main_cat)} ${capitalize(sub_cat)}`}>
            <Box className={styles.box}>
              <Link href={`/shop/${main_cat}/${sub_cat}`}>
                <a className={styles.page_link}>{sub_cat.toUpperCase()}</a>
              </Link>
            </Box>
          </Tooltip>
        </Fragment>
      )}
      {title && (
        <Fragment>
          <span>/</span>
          <div className={styles.grey}>{title}</div>
        </Fragment>
      )}
    </div>
  );
}

export default memo(PageLinks);
