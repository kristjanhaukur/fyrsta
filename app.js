// IEC 60751 Callendar-Van Dusen stuðlar fyrir Pt1000
const R0 = 1000;       // Viðnám við 0°C (Ω)
const A  =  3.9083e-3; // °C⁻¹
const B  = -5.775e-7;  // °C⁻²
const C  = -4.183e-12; // °C⁻⁴ (gildir aðeins fyrir T < 0°C)

// Hitastig → Viðnám  (Callendar-Van Dusen)
function tempToResistance(T) {
  if (T >= 0) {
    return R0 * (1 + A * T + B * T * T);
  } else {
    return R0 * (1 + A * T + B * T * T + C * (T - 100) * T * T * T);
  }
}

// Viðnám → Hitastig (Newton-Raphson endurtekning — nákvæm í öllum sviðum)
function resistanceToTemp(R) {
  if (R < 185.2 || R > 3904.8) return null; // utan sviðs

  // Grófur upphafsgildi með línulegri nálgun
  let T = (R / R0 - 1) / A;

  for (let i = 0; i < 50; i++) {
    const f  = tempToResistance(T) - R;
    // Afleiða f'(T)
    let df;
    if (T >= 0) {
      df = R0 * (A + 2 * B * T);
    } else {
      df = R0 * (A + 2 * B * T + C * (4 * T * T * T - 300 * T * T));
    }
    const dT = f / df;
    T -= dT;
    if (Math.abs(dT) < 1e-6) break;
  }
  return T;
}

// --- DOM ---
const rInput = document.getElementById('resistance');
const tInput = document.getElementById('temperature');
const result = document.getElementById('result');

rInput.addEventListener('input', () => {
  const R = parseFloat(rInput.value);
  if (isNaN(R)) {
    tInput.value = '';
    result.textContent = 'Sláðu inn gildi til að byrja';
    result.className = 'result';
    return;
  }
  const T = resistanceToTemp(R);
  if (T === null) {
    tInput.value = '';
    result.textContent = '⚠️ Viðnám er utan gildis sviðs (185 Ω – 3905 Ω)';
    result.className = 'result error';
    return;
  }
  tInput.value = T.toFixed(2);
  result.textContent = `${R} Ω  =  ${T.toFixed(2)} °C`;
  result.className = 'result';
});

tInput.addEventListener('input', () => {
  const T = parseFloat(tInput.value);
  if (isNaN(T)) {
    rInput.value = '';
    result.textContent = 'Sláðu inn gildi til að byrja';
    result.className = 'result';
    return;
  }
  if (T < -200 || T > 850) {
    rInput.value = '';
    result.textContent = '⚠️ Hitastig er utan gildis sviðs (−200 °C til +850 °C)';
    result.className = 'result error';
    return;
  }
  const R = tempToResistance(T);
  rInput.value = R.toFixed(2);
  result.textContent = `${T} °C  =  ${R.toFixed(2)} Ω`;
  result.className = 'result';
});
