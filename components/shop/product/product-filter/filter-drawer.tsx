import { Fragment, useState, SetStateAction, Dispatch, memo } from "react";
import { useRouter } from "next/router";

import { RequestParams } from "../sub-cat-list";
import { FilterStats } from "../../../../utils/enums-types/categories-interfaces";
import FilterCheckBox from "./checkbox";
import FilterRadioBox from "./radio-box";

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

interface Props {
  filterStats: FilterStats;
  filterType: string;
  clearFilter: boolean;
  setParams: Dispatch<SetStateAction<RequestParams>>;
  setFilterTags: Dispatch<SetStateAction<Set<string>>>;
}

function FilterDrawer({
  filterStats,
  filterType,
  clearFilter,
  setParams,
  setFilterTags,
}: Props): JSX.Element {
  const [expand, setExpand] = useState<boolean>(false);

  const toggleExpand = () => {
    setExpand(!expand);
  };

  return (
    <Fragment>
      <ListItemButton onClick={toggleExpand} sx={{ pl: 2 }}>
        <ListItemText primary={filterType.toUpperCase()} />
        {expand ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Divider />

      <Collapse in={expand} timeout="auto" unmountOnExit>
        {filterType === "size" && (
          <div>
            {Object.entries(filterStats.sizes).map(([size, value]) => {
              return (
                <FilterCheckBox
                  key={size}
                  filterKey={size}
                  value={value}
                  filterType="size"
                  clearFilter={clearFilter}
                  setParams={setParams}
                  setFilterTags={setFilterTags}
                />
              );
            })}
          </div>
        )}
        {filterType === "color" && (
          <div>
            {Object.entries(filterStats.colors).map(([color, value]) => {
              return (
                <FilterCheckBox
                  key={color}
                  filterKey={color}
                  value={value}
                  filterType="color"
                  clearFilter={clearFilter}
                  setParams={setParams}
                  setFilterTags={setFilterTags}
                />
              );
            })}
          </div>
        )}
        {filterType === "price" && (
          <FilterRadioBox
            clearFilter={clearFilter}
            setParams={setParams}
            setFilterTags={setFilterTags}
          />
        )}
      </Collapse>
    </Fragment>
  );
}

export default memo(FilterDrawer);
