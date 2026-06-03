const celsiusInput = document.getElementById('celsius');
const fahrenheitInput = document.getElementById('fahrenheit');
const result = document.getElementById('result');

celsiusInput.addEventListener('input', () => {
  const c = parseFloat(celsiusInput.value);
  if (isNaN(c)) {
    fahrenheitInput.value = '';
    result.textContent = 'Sláðu inn gildi til að byrja';
    return;
  }
  const f = (c * 9) / 5 + 32;
  fahrenheitInput.value = f.toFixed(2);
  result.textContent = `${c} °C = ${f.toFixed(2)} °F`;
});

fahrenheitInput.addEventListener('input', () => {
  const f = parseFloat(fahrenheitInput.value);
  if (isNaN(f)) {
    celsiusInput.value = '';
    result.textContent = 'Sláðu inn gildi til að byrja';
    return;
  }
  const c = ((f - 32) * 5) / 9;
  celsiusInput.value = c.toFixed(2);
  result.textContent = `${f} °F = ${c.toFixed(2)} °C`;
});
