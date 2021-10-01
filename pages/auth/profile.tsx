import { NextPage } from "next";
import { useEffect, useState } from "react";

import { Box, styled, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import UpdateProfile from "../../components/auth/user-profile/update-info";
import { useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectIsLoggedIn,
} from "../../utils/redux-store/userSlice";
import { loadUserInfo } from "../../utils/redux-store/checkoutSlice";
import { inputNames } from "../../utils/enums-types/input-names";

// export const Tab_styled = styled(Tab)(({ theme }) => ({
//   "&.Mui-selected": {
//     // backgroundColor: "black",
//     // color: "#ffffff",
//     // "&:hover": { backgroundColor: "black" },
//     // "&:active": { backgroundColor: "grey" },
//     // border: "solid",
//   },
//   //   "&:hover": {
//   //     backgroundColor: theme.palette.info.light,
//   //     color: "white",
//   //   },
//   //   "&:active": {
//   //     backgroundColor: "grey",
//   //   },
// }));

const ProfilePage: NextPage = ({}) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const currentUser = useSelector(selectCurrentUser);

  const [value, setValue] = useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  if (!isLoggedIn) {
    return <h1>Sign in to see your profile</h1>;
  }

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange}>
            <Tab label="PERSONAL INFO" value={"1"} />
            <Tab label="ORDER HISTORY" value={"2"} />
            <Tab label="RESET PASSWORD" value={"3"} />
          </TabList>
        </Box>
        <TabPanel value={"1"}>
          <UpdateProfile />
        </TabPanel>
        <TabPanel value={"2"}>ORDER HISTORY</TabPanel>
        <TabPanel value={"3"}>RESET PASSWORD</TabPanel>
      </TabContext>
    </Box>
  );
};

export default ProfilePage;
