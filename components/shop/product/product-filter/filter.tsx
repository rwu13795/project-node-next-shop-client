import {
  Dispatch,
  SetStateAction,
  memo,
  useState,
  useCallback,
  useEffect,
} from "react";

import { FilterStats } from "../../../../utils/enums-types/categories-interfaces";
import { RequestParams } from "../sub-cat-list";
import FilterCheckBox from "./checkbox";

// UI //
import {
  Grid,
  Checkbox,
  FormControlLabel,
  Modal,
  CircularProgress,
} from "@mui/material";

interface Props {
  filterStats: FilterStats;
  setParams: Dispatch<SetStateAction<RequestParams>>;
}

function ProductFilter({ filterStats, setParams }: Props): JSX.Element {
  //   const initialSizesCheck = useCallback(() => {
  //     return Object.keys(filterStats.sizes).map((key) => {
  //       return false;
  //     });
  //   }, [filterStats.sizes]);

  //   const initialColorsCheck = useCallback(() => {
  //     return Object.keys(filterStats.colors).map((key) => {
  //       return false;
  //     });
  //   }, [filterStats.colors]);

  //   const [sizesChecked, setSizesChecked] = useState<boolean[]>(() => {
  //     return Object.keys(filterStats.sizes).map((key) => {
  //       return false;
  //     });
  //   });
  //   const [colorsChecked, setColorsChecked] = useState<boolean[]>(() => {
  //     return Object.keys(filterStats.colors).map((key) => {
  //       if (filterStats.colors[key].check) {
  //         return true;
  //       }
  //       return false;
  //     });
  //   });
  const [openModal, setOpenMidal] = useState<boolean>(false);
  const [clearFilter, setClearFilter] = useState<boolean>(false);

  const handleOpen = () => setOpenMidal(true);
  const handleClose = () => setOpenMidal(false);

  //   useEffect(() => {
  //     setSizesChecked(() => {
  //       return Object.keys(filterStats.sizes).map((key) => {
  //         return false;
  //       });
  //     });
  //     setColorsChecked(() => {
  //       return Object.keys(filterStats.colors).map((key) => {
  //         return false;
  //       });
  //     });
  //   }, [filterStats]);

  console.log(filterStats.colors);

  //   const sizesCheckHandler = (size: string, index: number) => {
  //     // handleOpen();
  //     setParams((prev) => {
  //       let filter = { ...prev.filter };
  //       if (sizesChecked[index]) {
  //         // when previous state was true, clicking action means clearing this filter
  //         filter.sizes.delete(size);
  //       } else {
  //         filter.sizes.add(size);
  //       }
  //       return { ...prev, filter, pageNum: 1, filtering: true };
  //     });

  // setSizesChecked((prev) => {
  //   let newArray = [...prev];
  //   newArray[index] = !prev[index];
  //   return newArray;
  // });
  // setTimeout(() => {
  //   handleClose();
  // }, 1000);
  //   };

  const colorsCheckHandler = (color: string, index: number) => {
    // handleOpen();
    // setColorsChecked((prev) => {
    //   let newArray = [...prev];
    //   newArray[index] = !prev[index];
    //   return newArray;
    // });
    // setParams((prev) => {
    //   let filter = { ...prev.filter };
    //   if (filterStats.colors[color].check) {
    //     // when previous state was true, clicking action means clearing this filter
    //     filter.colors.delete(color);
    //   } else {
    //     filter.colors.add(color);
    //   }
    //   return { ...prev, filter, pageNum: 1, filtering: true };
    // });
    // setTimeout(() => {
    //   handleClose();
    // }, 1000);
  };

  const clearFilterHandler = () => {
    // handleOpen();
    setClearFilter(true);
    setParams({
      pageNum: 1,
      filter: {
        sizes: new Set<string>(),
        colors: new Set<string>(),
      },
      filtering: true,
    });

    setTimeout(() => {
      handleClose();
      setClearFilter(false);
    }, 1000);
  };

  return (
    <Grid>
      <div>Matching: {filterStats.matchingTotal}</div>
      <div>
        {Object.entries(filterStats.sizes).map(([size, value], index) => {
          return (
            <FilterCheckBox
              key={size}
              filterKey={size}
              value={value}
              filterType="size"
              clearFilter={clearFilter}
              setParams={setParams}
            />
          );
        })}
      </div>
      <div>
        {Object.entries(filterStats.colors).map(([color, value], index) => {
          return (
            <FilterCheckBox
              key={color}
              filterKey={color}
              value={value}
              filterType="color"
              clearFilter={clearFilter}
              setParams={setParams}
            />
          );
        })}
      </div>
      <div>Price sort</div>
      <button onClick={clearFilterHandler}>Clear filter</button>

      {/* <Modal
        open={openModal}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        // sx={{ bgcolor: "red" }}
      >
        <CircularProgress sx={style} />
      </Modal> */}
    </Grid>
  );
}

export default memo(ProductFilter);

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  // width: 400,
  // bgcolor: 'background.paper',
  // border: '2px solid #000',
  // boxShadow: 24,
  // p: 4,
};
