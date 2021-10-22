import { Fragment, useState, FormEvent } from "react";

import { Divider, Grid, TextField, Box } from "@mui/material";

export default function SearchIcon(): JSX.Element {
  const [value, setValue] = useState<string>("");

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(value);
  };

  return (
    <Fragment>
      <form onSubmit={submitHandler}>
        <TextField
          id="standard-basic"
          label="SEARCH"
          variant="standard"
          sx={{
            width: "12vw",
          }}
          inputProps={{ style: { fontSize: "1.4vw" } }}
          InputLabelProps={{ style: { fontSize: "1.2vw" } }}
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
        />
      </form>
    </Fragment>
  );
}
