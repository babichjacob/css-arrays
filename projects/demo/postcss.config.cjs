const { Declaration, Rule } = require("postcss");

const { lusolve, transpose } = require("mathjs");

// https://stackoverflow.com/a/10050831
const range = (end) => [...Array(end).keys()];

/**
 * @param {string} index
 * @param {number[]} coefficients
 */
const calcExpression = (index, coefficients) => {
  const parts = [];

  for (const [power, coefficient] of coefficients.entries()) {
    let part = coefficient.toString();

    if (power !== 0) {
      let mult = "";
      
      for (const _ of range(power)) {
        mult += `*${index}`
      }

      part += mult;
    }
      
    parts.push(part)
  }

  
  const [start, ...rest] = parts;

  let expression = start;

  for (const part of rest) {
    if (part.startsWith("-")) {
      expression += ` - ${part.slice(1)}`;
    } else {
      expression += ` + ${part}`;
    }
  }

  return `calc(${expression})`;
};

/**
 * @param {object} param0
 * @param {{ colors: Record<string, string> }[]} param0.themes
 */
const arrays = ({ themes } = {}) => {
  const points = [...values.entries()];
  const n = points.length;
  const superpower = range(n);

  const X = points.map(([x]) => superpower.map((i) => Math.pow(x, i)));
  const y = values;
  // http://practicalcryptography.com/miscellaneous/machine-learning/fitting-polynomial-set-points/#the-vandermonde-matrix-method
  /** @type {[number[]]} */
  const [coefficients] = transpose(lusolve(X, y));

  return {
    postcssPlugin: "css-arrays",
    AtRule: {
      /** @param {import("postcss").AtRule} atRule */
      arrays: (atRule) => {
        if (atRule.params === "here") {
          const thing = calcExpression("var(--index)", coefficients);

          for (const { colors } of themes) {
            
          }

          const bodyBlue = new Rule({
            selector: "button",
            nodes: [
              new Declaration({
                prop: "padding",
                value: `calc(${thing} * 1px)`,
              }),
            ],
          });

          atRule.replaceWith(bodyBlue);
        }
      },
    },
  };
};
arrays.postcss = true;

const PRIMARY = "primary";
const ON_PRIMARY = "on-primary";

const config = {
  plugins: [
    // arrays({
    //   values: [75, 12, 34, 0],
    // }),

    arrays({
      themes: [
        {
          colors: {
            [PRIMARY]: "#182C61",
            [ON_PRIMARY]: "#F8EFBA",
          },
        },
        {
          colors: {
            [PRIMARY]: "#d1d8e0",
            [ON_PRIMARY]: "#eb3b5a",
          },
        },
      ],
    }),
  ],
};

module.exports = config;
