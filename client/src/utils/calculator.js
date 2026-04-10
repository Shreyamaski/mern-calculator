const operatorPrecedence = {
  "+": 1,
  "-": 1,
  "*": 2,
  "/": 2
};

export const isOperator = (value) => ["+", "-", "*", "/"].includes(value);

export const sanitizeExpression = (expression) => expression.replace(/\s+/g, "");

const tokenize = (expression) => {
  const tokens = [];
  let currentNumber = "";

  for (let index = 0; index < expression.length; index += 1) {
    const character = expression[index];

    if (/\d|\./.test(character)) {
      currentNumber += character;
      continue;
    }

    if (isOperator(character)) {
      if (character === "-" && (index === 0 || isOperator(expression[index - 1]))) {
        currentNumber += character;
        continue;
      }

      if (!currentNumber) {
        throw new Error("INCOMPLETE_EXPRESSION");
      }

      tokens.push(currentNumber);
      tokens.push(character);
      currentNumber = "";
      continue;
    }

    throw new Error("Unsupported character used.");
  }

  if (currentNumber) {
    tokens.push(currentNumber);
  }

  if (isOperator(tokens[tokens.length - 1])) {
    throw new Error("INCOMPLETE_EXPRESSION");
  }

  return tokens;
};

const toRpn = (tokens) => {
  const output = [];
  const operators = [];

  tokens.forEach((token) => {
    if (!isOperator(token)) {
      output.push(token);
      return;
    }

    while (
      operators.length &&
      operatorPrecedence[operators[operators.length - 1]] >= operatorPrecedence[token]
    ) {
      output.push(operators.pop());
    }

    operators.push(token);
  });

  while (operators.length) {
    output.push(operators.pop());
  }

  return output;
};

const solveRpn = (tokens) => {
  const stack = [];

  tokens.forEach((token) => {
    if (!isOperator(token)) {
      stack.push(Number(token));
      return;
    }

    const right = stack.pop();
    const left = stack.pop();

    if (left === undefined || right === undefined) {
      throw new Error("INCOMPLETE_EXPRESSION");
    }

    if (token === "+") {
      stack.push(left + right);
    }

    if (token === "-") {
      stack.push(left - right);
    }

    if (token === "*") {
      stack.push(left * right);
    }

    if (token === "/") {
      if (right === 0) {
        throw new Error("Cannot divide by zero.");
      }
      stack.push(left / right);
    }
  });

  if (stack.length !== 1 || Number.isNaN(stack[0])) {
    throw new Error("Could not evaluate this expression.");
  }

  const roundedValue = Math.round(stack[0] * 1000000) / 1000000;
  return String(roundedValue);
};

export const evaluateMathExpression = (expression) => {
  const tokens = tokenize(expression);
  const rpnTokens = toRpn(tokens);
  return solveRpn(rpnTokens);
};
