/**
 * Formata uma string de acordo com a máscara especificada.
 * Cada caractere "d" da máscara é substituído pelo próximo caractere do valor.
 * @param {string} mask
 * @param {string} value
 * @example `format("84139341769", /\d/, "ddd.ddd.ddd-dd") // 841.393.417-69`
 */
const format = (mask: string, value: string) => {
  let finalString = "";
  let valueChars = value.split("");
  let i = 0;

  while (i < mask.length) {
    let char = mask.charAt(i);

    if (char === "d") {
      char = valueChars.shift() || " ";
    }

    finalString += char;
    i++;
  }

  return finalString;
};

export default format;
