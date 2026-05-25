const expressionEl = document.querySelector('#expression');
const resultEl = document.querySelector('#result');
const buttons = document.querySelectorAll('.button');
let expressionValue = '';
let resultValue = '0';
let storedResult = '';
let lastActionWasEqual = false;

function formatExpression(value) {
  return value.replace(/\*/g, '×');
}

function updateDisplay() {
  expressionEl.innerText = formatExpression(expressionValue) || '0';
  resultEl.innerText = resultValue;
}

function clearCalculator() {
  expressionValue = '';
  resultValue = '0';
  storedResult = '';
  lastActionWasEqual = false;
  updateDisplay();
}

function calculateExpression(expression) {
  const tokens = expression
    .split(/([+\-*/])/)
    .filter((item) => item.trim() !== '');

  const values = [];
  const operators = [];

  tokens.forEach((token) => {
    if (/[+\-*/]/.test(token)) {
      operators.push(token);
    } else {
      values.push(parseFloat(token));
    }
  });

  for (let i = 0; i < operators.length; i++) {
    const op = operators[i];
    if (op === '*' || op === '/') {
      const left = values[i];
      const right = values[i + 1];
      const result = op === '*' ? left * right : right !== 0 ? left / right : NaN;
      values.splice(i, 2, result);
      operators.splice(i, 1);
      i -= 1;
    }
  }

  let total = values[0] || 0;
  operators.forEach((op, index) => {
    const nextValue = values[index + 1] || 0;
    if (op === '+') total += nextValue;
    if (op === '-') total -= nextValue;
  });

  return Number.isFinite(total) ? total : 'Error';
}

function removeLastCharacter() {
  if (expressionValue) {
    expressionValue = expressionValue.slice(0, -1);
    resultValue = expressionValue || '0';
  } else if (lastActionWasEqual && storedResult) {
    storedResult = storedResult.slice(0, -1) || '0';
    resultValue = storedResult;
  }
  updateDisplay();
}

function addInput(value) {
  const lastChar = expressionValue.slice(-1);

  if (/[+\-*/]/.test(value)) {
    if (lastActionWasEqual && storedResult) {
      expressionValue = storedResult + value;
      lastActionWasEqual = false;
      resultValue = expressionValue;
      updateDisplay();
      return;
    }

    if (!expressionValue || /[+\-*/]/.test(lastChar)) return;
    expressionValue += value;
  } else {
    if (lastActionWasEqual) {
      expressionValue = value;
      lastActionWasEqual = false;
      resultValue = expressionValue;
      updateDisplay();
      return;
    }

    if (value === '.') {
      const lastNumber = expressionValue.split(/[+\-*/]/).pop();
      if (lastNumber.includes('.')) return;
    }
    expressionValue += value;
  }

  resultValue = expressionValue;
  updateDisplay();
}

function handleEquals() {
  if (!expressionValue) return;
  const result = String(calculateExpression(expressionValue));
  resultValue = result;
  storedResult = result;
  expressionValue = '';
  lastActionWasEqual = true;
  updateDisplay();
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    const value = button.dataset.value;

    if (action === 'clear') {
      clearCalculator();
      return;
    }

    if (action === 'backspace') {
      removeLastCharacter();
      return;
    }

    if (action === 'equal') {
      handleEquals();
      return;
    }

    if (value) {
      addInput(value);
    }
  });
});

document.addEventListener('keydown', (event) => {
  const key = event.key;

  if (/^[0-9]$/.test(key) || key === '.') {
    addInput(key);
    return;
  }

  if (key === '+' || key === '-' || key === '*' || key === '/') {
    addInput(key);
    return;
  }

  if (key === 'Enter') {
    event.preventDefault();
    handleEquals();
    return;
  }

  if (key === 'Backspace' || key === 'Delete') {
    event.preventDefault();
    removeLastCharacter();
    return;
  }

  if (key === 'Escape') {
    event.preventDefault();
    clearCalculator();
  }
});

updateDisplay();
