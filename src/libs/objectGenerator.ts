export const objectGenerator = <y, x, i>(mainOBJ: y, Includes: Array<x>) => {
  const newOBJ: Partial<i> = {};
  Object.keys(mainOBJ as any)
    .filter((key) => {
      return Includes.includes(key as x);
    })
    .forEach((key) => {
      return ((newOBJ as any)[key] = (mainOBJ as any)[key]);
    });
  return newOBJ as i;
};
