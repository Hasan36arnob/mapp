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
    itching,
    sudden_weight_loss,
    irritability,
    partial_paresis,
    visual_blurring,
    delayed_healing,
    obesity,
    polyphagia,
    muscle_stiffness,
    alopecia,
    weakness
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
    'itching',
    'sudden_weight_loss',
    'irritability',
    'partial_paresis',
    'visual_blurring',
    'delayed_healing',
    'obesity',
    'polyphagia',
    'muscle_stiffness',
    'alopecia',
    'weakness'
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
    polyuria: 'পর্যাপ্ত পানি পান করুন এবং প্রয়োজনে রক্তে গ্লুকোজ পরীক্ষা করুন',
    weight_loss: 'ডায়েটিশিয়ানের সাথে পরামর্শ করে পুষ্টি মূল্যায়ন করুন',
    fatigue: 'ধীরে ধীরে নিয়মিত শারীরিক ব্যায়াম শুরু করুন এবং পর্যাপ্ত বিশ্রাম নিন'
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
    counterfactualHtml =
      '<h3>Counterfactual Risk Reduction</h3>' +
      '<table border="1" cellpadding="4" cellspacing="0">' +
      '<thead><tr>' +
      '<th>Removed Symptom</th>' +
      '<th>Old Risk Stage</th>' +
      '<th>New Risk Stage</th>' +
      '</tr></thead>' +
      '<tbody><tr>' +
      '<td>' + counterfactualRemovalSymptom + '</td>' +
      '<td>' + currentRiskStage + '</td>' +
      '<td>' + counterfactualNewStage + '</td>' +
      '</tr></tbody>' +
      '</table>';
  }

  let adviceHtml = '';
  if (adviceItems.length > 0) {
    adviceHtml = '<ul>' + adviceItems.join('') + '</ul>';
  }

  const riskStageBangla = {
    'Very Low Risk': 'খুব কম ঝুঁকি',
    'Low Risk': 'কম ঝুঁকি',
    'Moderate Risk': 'মাঝারি ঝুঁকি (প্রি‑ডায়াবেটিস জোন)',
    'High Risk': 'উচ্চ ঝুঁকি',
    'Critical Risk': 'জরুরি/অত্যন্ত উচ্চ ঝুঁকি'
  };

  const progressionBangla = {
    'Accelerated progression': 'দ্রুতগতি সম্পন্ন অগ্রগতি (লেট‑স্টেজ উপসর্গ উপস্থিত)',
    'Moderate progression': 'মাঝারি অগ্রগতি (মিড‑স্টেজ উপসর্গ বেশি)',
    'Early-stage progression': 'প্রারম্ভিক অবস্থা (প্রধানত আর্লি‑স্টেজ উপসর্গ)'
  };

  const actionBangla = {
    'Lifestyle monitoring': 'জীবনযাত্রা নিয়মিত পর্যবেক্ষণ, ওজন ও খাদ্য নিয়ন্ত্রণ, বছরে অন্তত একবার রক্তে গ্লুকোজ পরীক্ষা',
    'Doctor consultation': 'শীঘ্রই চিকিৎসকের সাথে দেখা করুন এবং প্রয়োজনে পরীক্ষা‑নিরীক্ষা করান',
    'Immediate lab tests': 'অতি দ্রুত ল্যাব টেস্ট (ফাস্টিং গ্লুকোজ, HbA1c ইত্যাদি) এবং চিকিৎসকের পরামর্শ নিন'
  };

  let managementHtml = '';
  if (currentRiskStage === 'Very Low Risk' || currentRiskStage === 'Low Risk') {
    managementHtml =
      '<h3>ডায়াবেটিস ব্যবস্থাপনা (প্রতিরোধমূলক)</h3>' +
      '<ul>' +
      '<li>প্রতিদিন অন্তত ৩০ মিনিট হালকা থেকে মাঝারি ব্যায়াম করার চেষ্টা করুন।</li>' +
      '<li>চিনি ও মিষ্টি পানীয় কমিয়ে সবজি ও আঁশযুক্ত খাবার বেশি খান।</li>' +
      '<li>ধূমপান ও অতিরিক্ত তেল‑চর্বি এড়িয়ে চলুন।</li>' +
      '<li>বছরে অন্তত একবার রক্তে গ্লুকোজ পরীক্ষা করুন।</li>' +
      '</ul>';
  } else if (currentRiskStage === 'Moderate Risk') {
    managementHtml =
      '<h3>ডায়াবেটিস ব্যবস্থাপনা (প্রি‑ডায়াবেটিস)</h3>' +
      '<ul>' +
      '<li>সাপ্তাহিক অন্তত ১৫০ মিনিট দ্রুত হাঁটা বা সমপর্যায়ের ব্যায়াম করুন।</li>' +
      '<li>সাদা ভাত ও মিষ্টি কমিয়ে শাক‑সবজি, ডাল ও পূর্ণ শস্য (whole grain) বাড়ান।</li>' +
      '<li>প্রতি ৩–৬ মাস পর পর রক্তে গ্লুকোজ পরীক্ষা করুন।</li>' +
      '<li>ডাক্তারের পরামর্শ অনুযায়ী ওজন কমানো ও নিয়মিত ফলো‑আপ করুন।</li>' +
      '</ul>';
  } else if (currentRiskStage === 'High Risk' || currentRiskStage === 'Critical Risk') {
    managementHtml =
      '<h3>ডায়াবেটিস ব্যবস্থাপনা (উচ্চ ঝুঁকি)</h3>' +
      '<ul>' +
      '<li>যত তাড়াতাড়ি সম্ভব ডাক্তারের সাথে দেখা করুন এবং সব পরীক্ষার রিপোর্ট নিয়ে যান।</li>' +
      '<li>চিনি, মিষ্টি খাবার ও সফট ড্রিঙ্ক একেবারে বন্ধ করার চেষ্টা করুন।</li>' +
      '<li>পায়ের যত্ন নিন, প্রতিদিন পা পরীক্ষা করুন এবং কোনো ক্ষত হলে অবহেলা করবেন না।</li>' +
      '<li>বুক ব্যথা, শ্বাসকষ্ট, তীব্র দুর্বলতা বা বিভ্রান্তি হলে অবিলম্বে নিকটস্থ হাসপাতালে যান।</li>' +
      '</ul>';
  }

  const resultDiv = document.getElementById('result');
  const riskBn = riskStageBangla[currentRiskStage] || currentRiskStage;
  const progressionBn = progressionBangla[progressionDescription] || progressionDescription;
  const actionBn = action ? (actionBangla[action] || action) : '';
  resultDiv.innerHTML = ''
    + '<h2>ডায়াবেটিস ঝুঁকি ফলাফল</h2>'
    + '<p><strong>Risk Stage / ঝুঁকি স্তর:</strong> ' + riskBn + ' (' + currentRiskStage + ')</p>'
    + '<p><strong>Estimated Probability Proxy p:</strong> ' + p.toFixed(2) + '</p>'
    + (currentRiskStage === 'Moderate Risk'
        ? '<p><strong>Interpretation / ব্যাখ্যা:</strong> Pre-diabetic zone (প্রি‑ডায়াবেটিস অবস্থা)।</p>'
        : '')
    + '<p><strong>Progression / রোগের অগ্রগতি:</strong> ' + progressionBn + '</p>'
    + (action ? '<p><strong>Recommended Action / পরবর্তী পদক্ষেপ:</strong> ' + actionBn + '</p>' : '')
    + counterfactualHtml
    + (adviceHtml ? '<p><strong>লক্ষণভিত্তিক পরামর্শ:</strong></p>' + adviceHtml : '')
    + managementHtml;
  resultDiv.className = '';
  resultDiv.style.display = 'block';
});
