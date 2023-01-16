/**
 * Faz a soma de uma array.
 */
const sumArray = (array: number[]) => {
  return array.reduce((accumulator, value) => accumulator + value, 0);
};

export default sumArray;
