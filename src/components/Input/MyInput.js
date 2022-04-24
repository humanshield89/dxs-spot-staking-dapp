import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import React from "react";
import Button from "@mui/material/Button";

const MyInput = ({
  value,
  setValue = () => {},
  onEndButtonClick = () => {},
  buttonText,
  label,
  fullWidth = true,
  unit,
}) => {
  return (
    <FormControl variant="outlined" fullWidth={fullWidth} color={"secondary"}>
      <InputLabel>{label}</InputLabel>
      <OutlinedInput
        type={"number"}
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
        }}
        startAdornment={
          unit ? (
            <InputAdornment position="start">{unit}</InputAdornment>
          ) : undefined
        }
        endAdornment={
          buttonText ? (
            <InputAdornment position="end">
              <Button color={"secondary"} onClick={onEndButtonClick} edge="end">
                {buttonText}
              </Button>
            </InputAdornment>
          ) : undefined
        }
        label={label}
      />
    </FormControl>
  );
};

export default MyInput;
