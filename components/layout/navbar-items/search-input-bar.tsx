import { Fragment, useState, FormEvent, memo } from "react";

// UI //
import { Divider, Grid, TextField, Box, Drawer, Button } from "@mui/material";
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

function SearchInputBar({ size }: { size: string }): JSX.Element {
  const [value, setValue] = useState<string>("");

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(value);
    setValue("");
  };
  const onButtonClickHandler = () => {
    console.log(value);
    setValue("");
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
            id="standard-basic"
            label="SEARCH"
            variant="standard"
            sx={{ width: props.width }}
            inputProps={{ className: props.inputProps }}
            InputLabelProps={{ className: props.InputLabelProps }}
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
          />
        </form>
      </Grid>
      <Grid item onClick={onButtonClickHandler}>
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
