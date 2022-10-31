import { useState } from "react";

const useRerender = () => {
  const [, setRerender] = useState({});

  const rerender = () => setRerender({});

  return [rerender];
};

export default useRerender;
