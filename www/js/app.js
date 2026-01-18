document.getElementById('diabetesForm').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const age = parseInt(document.getElementById('age').value);
  const gender = parseInt(document.getElementById('gender').value);
  const polyuria = parseInt(document.getElementById('polyuria').value);
  const polydipsia = parseInt(document.getElementById('polydipsia').value);
  const sudden_weight_loss = parseInt(document.getElementById('sudden_weight_loss').value);
  const weakness = parseInt(document.getElementById('weakness').value);
  const polyphagia = parseInt(document.getElementById('polyphagia').value);
  const visual_blurring = parseInt(document.getElementById('visual_blurring').value);
  const itching = parseInt(document.getElementById('itching').value);
  const irritability = parseInt(document.getElementById('irritability').value);
  const delayed_healing = parseInt(document.getElementById('delayed_healing').value);
  const partial_paresis = parseInt(document.getElementById('partial_paresis').value);
  const muscle_stiffness = parseInt(document.getElementById('muscle_stiffness').value);
  const alopecia = parseInt(document.getElementById('alopecia').value);
  const obesity = parseInt(document.getElementById('obesity').value);
  
  // Feature importance weights
  const weights = {
    age: 0.15,
    gender: 0.05,
    polyuria: 0.12,
    polydipsia: 0.12,
    sudden_weight_loss: 0.08,
    weakness: 0.06,
    polyphagia: 0.07,
    visual_blurring: 0.07,
    itching: 0.05,
    irritability: 0.05,
    delayed_healing: 0.06,
    partial_paresis: 0.06,
    muscle_stiffness: 0.05,
    alopecia: 0.03,
    obesity: 0.08
  };
  
  // Calculate risk score using mathematical equation: sum(feature_value * weight)
  let score = (age * weights.age) +
              (gender * weights.gender) +
              (polyuria * weights.polyuria) +
              (polydipsia * weights.polydipsia) +
              (sudden_weight_loss * weights.sudden_weight_loss) +
              (weakness * weights.weakness) +
              (polyphagia * weights.polyphagia) +
              (visual_blurring * weights.visual_blurring) +
              (itching * weights.itching) +
              (irritability * weights.irritability) +
              (delayed_healing * weights.delayed_healing) +
              (partial_paresis * weights.partial_paresis) +
              (muscle_stiffness * weights.muscle_stiffness) +
              (alopecia * weights.alopecia) +
              (obesity * weights.obesity);
  
  // Determine risk level based on score
  let riskLevel, riskClass, recommendation;
  if (score < 2) {
    riskLevel = 'Low Risk';
    riskClass = 'low-risk';
    recommendation = 'Keep up the good work! Maintain a healthy lifestyle.';
  } else if (score < 4) {
    riskLevel = 'Moderate Risk';
    riskClass = 'moderate-risk';
    recommendation = 'Consider lifestyle changes and regular check-ups.';
  } else if (score < 6) {
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
    <p><strong>Risk Score:</strong> ${score.toFixed(2)}</p>
    <p><strong>Risk Level:</strong> ${riskLevel}</p>
    <p><strong>Recommendation:</strong> ${recommendation}</p>
    <p><em>Note: This is an estimation based on external symptoms. Consult a doctor for accurate diagnosis.</em></p>
  `;
  resultDiv.className = riskClass;
  resultDiv.style.display = 'block';
});
