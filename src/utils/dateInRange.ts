/**
 * Verifica se uma data está no intervalo especificado.
 */
const dateInRange = (date: number, start: number, end: number) => {
  return date >= start && date <= end;
};

export default dateInRange;
