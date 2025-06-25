import { useSelector } from "react-redux";

export const SelectorFunc = (reducerName, stateName) => {
  let res = useSelector((state) => state[reducerName]);

  if (stateName) {
    res = res[stateName];
  }
  return { ...res };
};
