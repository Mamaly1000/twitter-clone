import { Children, ReactNode } from "react";

const Each = ({
  render,
  of,
}: {
  render: (item: unknown, i: number) => ReactNode;
  of: unknown[];
}) => {
  return <>{Children.toArray(of.map((item, i) => render(item, i)))}</>;
};

export default Each;
