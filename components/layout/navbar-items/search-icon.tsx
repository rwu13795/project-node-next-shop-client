import { Fragment, useState, FormEvent } from "react";

import { Divider, Grid, TextField, Box } from "@mui/material";

import classes from "./_search-icon.module.css";

export default function SearchIcon(): JSX.Element {
  const [value, setValue] = useState<string>("");

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(value);
    setValue("");
  };

  return (
    <Fragment>
      <form onSubmit={submitHandler}>
        <TextField
          id="standard-basic"
          label="SEARCH"
          variant="standard"
          sx={{ width: "12vw" }}
          inputProps={{ className: `${classes.input_props}` }}
          InputLabelProps={{ className: `${classes.input_label_props}` }}
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
        />
      </form>
    </Fragment>
  );
}
