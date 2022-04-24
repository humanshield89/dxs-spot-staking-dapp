import { useContext } from "react";
import DXSContext from "../contexts/DXSContext";

const useDXS = () => useContext(DXSContext);

export default useDXS;
