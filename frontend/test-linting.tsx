import React from "react";
import { useState } from "react";

const TestComponent = () => {
  const [count, setCount] = useState(0);
  const unusedVariable = "this will be detected by ESLint";

  // Missing return statement type annotation
  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <button onClick={handleClick}>Count: {count}</button>
    </div>
  );
};

export default TestComponent;
