import {
  useState,
  FormEvent,
  memo,
  MouseEvent,
  SetStateAction,
  Dispatch,
} from "react";
import { useRouter } from "next/router";

import { useDispatch, useSelector } from "react-redux";
import {
  select_disable_searchInput,
  setPageLoading,
  set_disable_searchInput,
} from "../../../utils/redux-store/layoutSlice";

// UI //
import { Grid, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import styles from "./__search-bar.module.css";

const smallProps = {
  display: { xs: "flex", md: "flex" },
  width: "60vw",
  inputProps: `${styles.input_props_small}`,
  InputLabelProps: `${styles.input_label_props_small}`,
};
const mediumProps = {
  display: { xs: "none", md: "flex" },
  width: "15vw",
  inputProps: `${styles.input_props}`,
  InputLabelProps: `${styles.input_label_props}`,
};

interface Props {
  size: string;
  setIsDrawerOpen?: Dispatch<SetStateAction<boolean>>;
}

function SearchInputBar({ size, setIsDrawerOpen }: Props): JSX.Element {
  const router = useRouter();
  const dispatch = useDispatch();
  const disable_searchInput = useSelector(select_disable_searchInput);

  const [value, setValue] = useState<string>("");

  const submitHandler = (e: FormEvent<HTMLFormElement> | MouseEvent) => {
    e.preventDefault();

    dispatch(setPageLoading(true));
    if (setIsDrawerOpen) setIsDrawerOpen(false);
    dispatch(set_disable_searchInput(true));

    const keywords = value.replaceAll(" ", "+");
    setValue("");

    router.push(`/shop/search-result?search=${keywords}`);
  };

  let props;
  if (size === "small") {
    props = smallProps;
  } else {
    props = mediumProps;
  }

  return (
    <Grid
      container
      flexDirection="row"
      justifyContent="center"
      alignItems="flex-end"
      sx={{ display: props.display }}
    >
      <Grid item>
        <form onSubmit={submitHandler}>
          <TextField
            id="search-field"
            label="SEARCH"
            variant="standard"
            sx={{ width: props.width }}
            inputProps={{ className: props.inputProps }}
            InputLabelProps={{ className: props.InputLabelProps }}
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
            disabled={disable_searchInput}
          />
        </form>
      </Grid>
      <Grid item onClick={submitHandler}>
        {size === "small" ? (
          <LoadingButton
            loading={false}
            loadingPosition="start"
            startIcon={<SearchSharpIcon />}
            variant="outlined"
            sx={{ borderRadius: 0 }}
          >
            Find
          </LoadingButton>
        ) : (
          <SearchSharpIcon className={styles.search_icon_small} />
        )}
      </Grid>
    </Grid>
  );
}

export default memo(SearchInputBar);
