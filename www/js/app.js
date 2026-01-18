document.getElementById('diabetesForm').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const gender = document.getElementById('gender').value;
  const age = parseInt(document.getElementById('age').value);
  const height = parseFloat(document.getElementById('height').value) / 100; // convert to meters
  const weight = parseFloat(document.getElementById('weight').value);
  const waist = parseFloat(document.getElementById('waist').value);
  const activity = parseInt(document.getElementById('activity').value);
  const vegetables = parseInt(document.getElementById('vegetables').value);
  const medication = parseInt(document.getElementById('medication').value);
  const glucose = parseInt(document.getElementById('glucose').value);
  const family = parseInt(document.getElementById('family').value);
  
  // Calculate BMI
  const bmi = weight / (height * height);
  
  // Calculate FINDRISC score
  let score = 0;
  
  // Age points
  if (age >= 45 && age <= 54) score += 2;
  else if (age >= 55 && age <= 64) score += 3;
  else if (age >= 65) score += 4;
  
  // BMI points
  if (bmi >= 25 && bmi < 30) score += 1;
  else if (bmi >= 30) score += 3;
  
  // Waist points
  if (gender === 'male') {
    if (waist >= 94 && waist < 102) score += 3;
    else if (waist >= 102) score += 4;
  } else if (gender === 'female') {
    if (waist >= 80 && waist < 88) score += 3;
    else if (waist >= 88) score += 4;
  }
  
  // Other points
  score += (1 - activity); // if activity=1, add 0; if 0, add 1
  score += (1 - vegetables);
  score += medication;
  score += glucose;
  score += family;
  
  // Determine risk level
  let riskLevel, riskClass, recommendation;
  if (score <= 6) {
    riskLevel = 'Low Risk';
    riskClass = 'low-risk';
    recommendation = 'Keep up the good work! Maintain a healthy lifestyle.';
  } else if (score <= 11) {
    riskLevel = 'Moderate Risk';
    riskClass = 'moderate-risk';
    recommendation = 'Consider lifestyle changes and regular check-ups.';
  } else if (score <= 14) {
    riskLevel = 'High Risk';
    riskClass = 'high-risk';
    recommendation = 'Consult a healthcare professional for further evaluation.';
  } else {
    riskLevel = 'Very High Risk';
    riskClass = 'very-high-risk';
    recommendation = 'Immediate medical attention recommended.';
  }
  
  // Display result
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = `
    <h2>Risk Assessment Result</h2>
    <p><strong>FINDRISC Score:</strong> ${score}/26</p>
    <p><strong>Risk Level:</strong> ${riskLevel}</p>
    <p><strong>Recommendation:</strong> ${recommendation}</p>
    <p><em>Note: This is an estimation based on external symptoms. Consult a doctor for accurate diagnosis.</em></p>
  `;
  resultDiv.className = riskClass;
  resultDiv.style.display = 'block';
});
