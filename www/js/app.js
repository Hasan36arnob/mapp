function riskStage(p) {
  if (p >= 0 && p < 0.20) {
    return 'Very Low Risk';
  } else if (p >= 0.20 && p < 0.40) {
    return 'Low Risk';
  } else if (p >= 0.40 && p < 0.60) {
    return 'Moderate Risk';
  } else if (p >= 0.60 && p < 0.80) {
    return 'High Risk';
  } else if (p >= 0.80 && p <= 1.00) {
    return 'Critical Risk';
  }
  return 'Very Low Risk';
}

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

  const fatigue = 0;
  const weight_loss = sudden_weight_loss;

  const binarySymptoms = [
    polyuria,
    polydipsia,
    sudden_weight_loss,
    weakness,
    polyphagia,
    visual_blurring,
    itching,
    irritability,
    delayed_healing,
    partial_paresis,
    muscle_stiffness,
    alopecia,
    obesity
  ];

  let presentCount = 0;
  for (let i = 0; i < binarySymptoms.length; i++) {
    if (binarySymptoms[i] === 1) {
      presentCount++;
    }
  }

  const totalSymptoms = binarySymptoms.length;
  const p = totalSymptoms > 0 ? presentCount / totalSymptoms : 0;
  const currentRiskStage = riskStage(p);

  const symptomPresence = {
    polyuria: polyuria,
    polydipsia: polydipsia,
    fatigue: fatigue,
    weight_loss: weight_loss,
    weakness: weakness,
    polyphagia: polyphagia,
    delayed_healing: delayed_healing,
    partial_paresis: partial_paresis,
    muscle_stiffness: muscle_stiffness
  };

  const early = ['polyuria', 'polydipsia', 'fatigue'];
  const mid = ['weight_loss', 'weakness', 'polyphagia'];
  const late = ['delayed_healing', 'partial_paresis', 'muscle_stiffness'];

  let earlyCount = 0;
  let midCount = 0;
  let lateCount = 0;

  for (let i = 0; i < early.length; i++) {
    if (symptomPresence[early[i]] === 1) {
      earlyCount++;
    }
  }

  for (let i = 0; i < mid.length; i++) {
    if (symptomPresence[mid[i]] === 1) {
      midCount++;
    }
  }

  for (let i = 0; i < late.length; i++) {
    if (symptomPresence[late[i]] === 1) {
      lateCount++;
    }
  }

  let progressionDescription;
  if (lateCount > 0) {
    progressionDescription = 'Accelerated progression';
  } else if (midCount >= 2) {
    progressionDescription = 'Moderate progression';
  } else {
    progressionDescription = 'Early-stage progression';
  }

  const symptomNamesForRisk = [
    'polyuria',
    'polydipsia',
    'sudden_weight_loss',
    'weakness',
    'polyphagia',
    'visual_blurring',
    'itching',
    'irritability',
    'delayed_healing',
    'partial_paresis',
    'muscle_stiffness',
    'alopecia',
    'obesity'
  ];

  const symptomValuesForRisk = {
    polyuria: polyuria,
    polydipsia: polydipsia,
    sudden_weight_loss: sudden_weight_loss,
    weakness: weakness,
    polyphagia: polyphagia,
    visual_blurring: visual_blurring,
    itching: itching,
    irritability: irritability,
    delayed_healing: delayed_healing,
    partial_paresis: partial_paresis,
    muscle_stiffness: muscle_stiffness,
    alopecia: alopecia,
    obesity: obesity
  };

  const totalPresentForRisk = presentCount;
  let counterfactualRemovalSymptom = null;
  let counterfactualNewStage = null;

  for (let i = 0; i < symptomNamesForRisk.length; i++) {
    const name = symptomNamesForRisk[i];
    if (symptomValuesForRisk[name] === 1) {
      const newPresent = totalPresentForRisk - 1;
      const newP = totalSymptoms > 0 ? newPresent / totalSymptoms : 0;
      const newStage = riskStage(newP);
      if (newStage !== currentRiskStage) {
        counterfactualRemovalSymptom = name;
        counterfactualNewStage = newStage;
        break;
      }
    }
  }

  let action = '';
  if (currentRiskStage === 'Moderate Risk') {
    action = 'Lifestyle monitoring';
  } else if (currentRiskStage === 'High Risk') {
    action = 'Doctor consultation';
  } else if (currentRiskStage === 'Critical Risk') {
    action = 'Immediate lab tests';
  }

  const symptomAdviceMap = {
    polyuria: 'Hydration + glucose test',
    weight_loss: 'Nutrition assessment',
    fatigue: 'Physical activity review'
  };

  const adviceItems = [];
  if (polyuria === 1 && symptomAdviceMap.polyuria) {
    adviceItems.push('<li>polyuria: ' + symptomAdviceMap.polyuria + '</li>');
  }
  if (weight_loss === 1 && symptomAdviceMap.weight_loss) {
    adviceItems.push('<li>weight_loss: ' + symptomAdviceMap.weight_loss + '</li>');
  }
  if (fatigue === 1 && symptomAdviceMap.fatigue) {
    adviceItems.push('<li>fatigue: ' + symptomAdviceMap.fatigue + '</li>');
  }

  let counterfactualHtml = '';
  if (counterfactualRemovalSymptom !== null && counterfactualNewStage !== null) {
    counterfactualHtml = '<p><strong>Counterfactual:</strong> Removing "' +
      counterfactualRemovalSymptom +
      '" changes risk stage from "' +
      currentRiskStage +
      '" to "' +
      counterfactualNewStage +
      '".</p>';
  }

  let adviceHtml = '';
  if (adviceItems.length > 0) {
    adviceHtml = '<ul>' + adviceItems.join('') + '</ul>';
  }

  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = ''
    + '<h2>Risk Assessment Result</h2>'
    + '<p><strong>Risk Stage:</strong> ' + currentRiskStage + '</p>'
    + '<p><strong>Progression:</strong> ' + progressionDescription + '</p>'
    + (action ? '<p><strong>Recommended Action:</strong> ' + action + '</p>' : '')
    + counterfactualHtml
    + (adviceHtml ? '<p><strong>Symptom-specific Advice:</strong></p>' + adviceHtml : '');
  resultDiv.className = '';
  resultDiv.style.display = 'block';
});
