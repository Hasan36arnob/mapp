// Mobile App Navigation and Functionality

// Safe localStorage wrapper with error handling
function safeLocalStorage() {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return localStorage;
  } catch (e) {
    console.error('localStorage not available:', e);
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {}
    };
  }
}

const storage = safeLocalStorage();

// Page Navigation System
function showPage(pageId) {
  console.log('Navigating to page:', pageId);
  
  // Hide all pages
  const pages = document.querySelectorAll('.page-view');
  console.log('Found pages:', pages.length);
  pages.forEach(page => {
    page.classList.remove('active');
  });
  
  // Show selected page
  const selectedPage = document.getElementById(pageId);
  if (selectedPage) {
    console.log('Page found, activating:', pageId);
    selectedPage.classList.add('active');
  } else {
    console.error('Page not found:', pageId);
  }
  
  // Update navigation
  updateNavigation(pageId);
  
  // Show/hide mobile navigation
  const mobileNav = document.getElementById('mobileNav');
  if (mobileNav) {
    if (pageId === 'loginPage' || pageId === 'registerPage') {
      mobileNav.style.display = 'none';
    } else {
      mobileNav.style.display = 'flex';
    }
  } else {
    console.error('mobileNav element not found');
  }
  
  // Update profile if on profile page
  if (pageId === 'profilePage') {
    updateProfile();
  }
  
  // Scroll to top
  window.scrollTo(0, 0);
}

function updateNavigation(pageId) {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.classList.remove('active');
  });
  
  // Map page IDs to navigation indices
  const navMap = {
    'dashboardPage': 0,
    'riskAssessmentPage': 1,
    'tasksPage': 2,
    'profilePage': 3
  };
  
  if (navMap.hasOwnProperty(pageId)) {
    navItems[navMap[pageId]].classList.add('active');
  }
}

// Authentication System
const users = JSON.parse(storage.getItem('diabetesAppUsers')) || [];
let currentUser = JSON.parse(storage.getItem('diabetesAppCurrentUser')) || null;

// Setup Form Handlers after DOM is ready
function setupFormHandlers() {
  // Login Form Handler
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        currentUser = user;
        storage.setItem('diabetesAppCurrentUser', JSON.stringify(currentUser));
        document.getElementById('userName').textContent = user.name;
        showPage('dashboardPage');
        showNotification('সফলভাবে লগইন হয়েছে!', 'success');
      } else {
        showNotification('ইমেইল বা পাসওয়ার্ড ভুল!', 'error');
      }
    });
  }

  // Registration Form Handler
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      const name = document.getElementById('registerName').value;
      const email = document.getElementById('registerEmail').value;
      const password = document.getElementById('registerPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      
      if (password !== confirmPassword) {
        showNotification('পাসওয়ার্ড মিলছে না!', 'error');
        return;
      }
      
      if (users.find(u => u.email === email)) {
        showNotification('এই ইমেইল দিয়ে আগেই রেজিস্ট্রেশন হয়েছে!', 'error');
        return;
      }
      
      const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        registrationDate: new Date().toLocaleDateString('bn-BD'),
        tasks: []
      };
      
      users.push(newUser);
      storage.setItem('diabetesAppUsers', JSON.stringify(users));
      
      currentUser = newUser;
      storage.setItem('diabetesAppCurrentUser', JSON.stringify(currentUser));
      
      document.getElementById('userName').textContent = name;
      showPage('dashboardPage');
      showNotification('সফলভাবে রেজিস্ট্রেশন হয়েছে!', 'success');
    });
  }
}

function logout() {
  currentUser = null;
  storage.removeItem('diabetesAppCurrentUser');
  showPage('loginPage');
  showNotification('লগআউট হয়েছে!', 'success');
}

// Profile Management
function updateProfile() {
  if (currentUser) {
    document.getElementById('profileName').value = currentUser.name;
    document.getElementById('profileEmail').value = currentUser.email;
    document.getElementById('profileDate').value = currentUser.registrationDate;
  }
}

// Settings Management
function saveSettings() {
  const notification = document.getElementById('notificationSetting').value;
  const language = document.getElementById('languageSetting').value;
  const theme = document.getElementById('themeSetting').value;
  
  const settings = {
    notification: notification,
    language: language,
    theme: theme
  };
  
  storage.setItem('diabetesAppSettings', JSON.stringify(settings));
  showNotification('সেটিংস সংরক্ষিত হয়েছে!', 'success');
}

// Task Management
function loadTasks() {
  if (currentUser) {
    const tasks = currentUser.tasks || [];
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;
      li.innerHTML = `
        <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})">
        <span>${task.text}</span>
        <button class="delete-btn" onclick="deleteTask(${index})">×</button>
      `;
      taskList.appendChild(li);
    });
  }
}

function addTask() {
  const taskInput = document.getElementById('newTask');
  const taskText = taskInput.value.trim();
  
  if (taskText && currentUser) {
    if (!currentUser.tasks) {
      currentUser.tasks = [];
    }
    
    currentUser.tasks.push({
      text: taskText,
      completed: false,
      createdAt: new Date().toISOString()
    });
    
    // Update user in localStorage
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex] = currentUser;
      storage.setItem('diabetesAppUsers', JSON.stringify(users));
      storage.setItem('diabetesAppCurrentUser', JSON.stringify(currentUser));
    }
    
    taskInput.value = '';
    loadTasks();
    showNotification('টাস্ক যোগ করা হয়েছে!', 'success');
  }
}

function toggleTask(index) {
  if (currentUser && currentUser.tasks) {
    currentUser.tasks[index].completed = !currentUser.tasks[index].completed;
    
    // Update user in localStorage
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex] = currentUser;
      storage.setItem('diabetesAppUsers', JSON.stringify(users));
      storage.setItem('diabetesAppCurrentUser', JSON.stringify(currentUser));
    }
    
    loadTasks();
  }
}

function deleteTask(index) {
  if (currentUser && currentUser.tasks) {
    currentUser.tasks.splice(index, 1);
    
    // Update user in localStorage
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex] = currentUser;
      storage.setItem('diabetesAppUsers', JSON.stringify(users));
      storage.setItem('diabetesAppCurrentUser', JSON.stringify(currentUser));
    }
    
    loadTasks();
    showNotification('টাস্ক মুছে ফেলা হয়েছে!', 'success');
  }
}

// Diabetes Risk Assessment
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

function resetForm() {
  document.getElementById('diabetesForm').reset();
  document.getElementById('result').classList.add('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Notification System
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${type === 'success' ? '#28a745' : '#dc3545'};
    color: white;
    border-radius: 8px;
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Initialize App
function initApp() {
  console.log('App initialization started');
  console.log('Cordova available:', typeof cordova !== 'undefined');
  console.log('Platform:', typeof cordova !== 'undefined' ? cordova.platformId : 'browser');
  
  // Setup form handlers
  setupFormHandlers();
  
  // Setup diabetes form handler
  const diabetesForm = document.getElementById('diabetesForm');
  if (diabetesForm) {
    diabetesForm.addEventListener('submit', function(event) {
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
        adviceItems.push('<li>' + symptomAdviceMap.polyuria + '</li>');
      }
      if (weight_loss === 1 && symptomAdviceMap.weight_loss) {
        adviceItems.push('<li>' + symptomAdviceMap.weight_loss + '</li>');
      }
      if (fatigue === 1 && symptomAdviceMap.fatigue) {
        adviceItems.push('<li>' + symptomAdviceMap.fatigue + '</li>');
      }

      let counterfactualHtml = '';
      if (counterfactualRemovalSymptom !== null && counterfactualNewStage !== null) {
        counterfactualHtml =
          '<h3>ঝুঁকি হ্রাসের সম্ভাবনা</h3>' +
          '<table border="1" cellpadding="4" cellspacing="0">' +
          '<thead><tr>' +
          '<th>উপসর্গ</th>' +
          '<th>বর্তমান ঝুঁকি</th>' +
          '<th>নতুন ঝুঁকি</th>' +
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
        'Immediate lab tests': 'অতি দ্রুত ল্যাব টেস্ট (ফাস্টিং গ্লুকোজ, HbA1c) করান এবং এন্ডোক্রিনোলজিস্টের পরামর্শ নিন'
      };

      const riskClass = {
        'Very Low Risk': 'risk-very-low',
        'Low Risk': 'risk-low',
        'Moderate Risk': 'risk-moderate',
        'High Risk': 'risk-high',
        'Critical Risk': 'risk-critical'
      };

      const resultHtml = `
        <h2>আপনার ডায়াবেটিস ঝুঁকি ফলাফল</h2>
        <p><strong>ঝুঁকি স্তর:</strong> <span class="risk-indicator ${riskClass[currentRiskStage]}">${riskStageBangla[currentRiskStage]}</span></p>
        <p><strong>অগ্রগতির ধরন:</strong> ${progressionBangla[progressionDescription]}</p>
        <p><strong>লক্ষণ সংখ্যা:</strong> ${presentCount} / ${totalSymptoms}</p>
        <p><strong>ঝুঁকি শতাংশ:</strong> ${(p * 100).toFixed(1)}%</p>
        
        ${action ? `<h3>সুপারিশ</h3><p>${actionBangla[action]}</p>` : ''}
        
        ${adviceHtml ? `<h3>উপসর্গ-ভিত্তিক পরামর্শ</h3>${adviceHtml}` : ''}
        
        ${counterfactualHtml}
        
        <h3>সাধারণ স্বাস্থ্য পরামর্শ</h3>
        <ul>
          <li>নিয়মিত শারীরিক ব্যায়াম করুন</li>
          <li>স্বাস্থ্যকর খাদ্যাভ্যাস বজায় রাখুন</li>
          <li>পর্যাপ্ত পানি পান করুন</li>
          <li>পর্যাপ্ত ঘুমান</li>
          <li>মানসিক চাপ কমান</li>
        </ul>
        
        <button onclick="resetForm()" class="submit-btn" style="margin-top: 20px;">
          <span class="btn-text">নতুন পরীক্ষা করুন</span>
        </button>
      `;

      const resultCard = document.getElementById('result');
      resultCard.innerHTML = resultHtml;
      resultCard.classList.remove('hidden');
      
      // Scroll to result
      resultCard.scrollIntoView({ behavior: 'smooth' });
      
      showNotification('ঝুঁকি নির্ণয় সম্পন্ন হয়েছে!', 'success');
    });
  }
  
  // Check if user is logged in
  console.log('Checking user authentication. Current user:', currentUser);
  if (currentUser) {
    console.log('User is logged in, showing dashboard for:', currentUser.name);
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
      userNameElement.textContent = currentUser.name;
    } else {
      console.error('userName element not found');
    }
    showPage('dashboardPage');
  } else {
    console.log('No user logged in, showing login page');
    showPage('loginPage');
  }
  
  // Load settings
  const settings = JSON.parse(storage.getItem('diabetesAppSettings'));
  if (settings) {
    document.getElementById('notificationSetting').value = settings.notification || 'enabled';
    document.getElementById('languageSetting').value = settings.language || 'bn';
    document.getElementById('themeSetting').value = settings.theme || 'light';
  }
  
  // Load tasks
  loadTasks();
  
  // Add offline support indicators
  window.addEventListener('online', () => {
    showNotification('ইন্টারনেট সংযোগ পুনরুদ্ধার হয়েছে', 'success');
  });
  
  window.addEventListener('offline', () => {
    showNotification('ইন্টারনেট সংযোগ নেই - অফলাইন মোড', 'error');
  });
  
  // Add enter key support for task input
  const taskInput = document.getElementById('newTask');
  if (taskInput) {
    taskInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        addTask();
      }
    });
  }
}

// Service Worker Registration for Offline Support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then(registration => {
      console.log('ServiceWorker registration successful');
    }).catch(error => {
      console.log('ServiceWorker registration failed:', error);
    });
  });
}

// Start the app - wait for Cordova deviceready on mobile, or DOMContentLoaded in browser
function startApp() {
  // Check if running in Cordova environment
  if (typeof cordova !== 'undefined') {
    // Cordova environment - wait for deviceready
    document.addEventListener('deviceready', () => {
      console.log('Cordova deviceready fired, initializing app');
      console.log('Platform:', cordova.platformId);
      console.log('Version:', cordova.version);
      initApp();
    }, false);
  } else {
    // Browser environment - initialize on DOMContentLoaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        console.log('DOMContentLoaded fired, initializing app');
        initApp();
      });
    } else {
      // DOM already loaded
      console.log('DOM already loaded, initializing app immediately');
      initApp();
    }
  }
}

// Start the app initialization
startApp();