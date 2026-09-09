// Medical knowledge base - Common medications, conditions, and treatments
export const medicationsDatabase = {
  // Medications by category
  painRelief: [
    {
      name: 'Paracetamol (Acetaminophen)',
      dose: '500-1000mg',
      frequency: 'Every 4-6 hours',
      maxDaily: '4000mg',
      uses: 'Fever, mild to moderate pain',
      sideEffects: 'Rare: liver damage if overdosed',
      contraindications: 'Liver disease, alcohol abuse',
      interactions: 'Warfarin, isoniazid'
    },
    {
      name: 'Ibuprofen',
      dose: '200-400mg',
      frequency: 'Every 4-6 hours',
      maxDaily: '1200mg (OTC), 3200mg (prescription)',
      uses: 'Pain, fever, inflammation',
      sideEffects: 'Stomach upset, heartburn, ulcers',
      contraindications: 'Asthma, GI ulcers, heart disease',
      interactions: 'Aspirin, corticosteroids, blood thinners'
    },
    {
      name: 'Aspirin',
      dose: '300-600mg',
      frequency: 'Every 4-6 hours',
      maxDaily: '4000mg',
      uses: 'Pain, fever, blood clotting prevention',
      sideEffects: 'Stomach irritation, bleeding',
      contraindications: 'Bleeding disorders, GI ulcers',
      interactions: 'Blood thinners, NSAIDs, corticosteroids'
    }
  ],
  
  coldAndFlu: [
    {
      name: 'Cetirizine (Zyrtec)',
      dose: '10mg',
      frequency: 'Once daily',
      maxDaily: '10mg',
      uses: 'Allergies, runny nose, sneezing',
      sideEffects: 'Drowsiness, dry mouth',
      contraindications: 'Severe liver disease',
      interactions: 'Alcohol'
    },
    {
      name: 'Loratadine (Claritin)',
      dose: '10mg',
      frequency: 'Once daily',
      maxDaily: '10mg',
      uses: 'Allergies, hay fever',
      sideEffects: 'Headache, dry mouth',
      contraindications: 'Severe liver disease',
      interactions: 'Ketoconazole, erythromycin'
    },
    {
      name: 'Pseudoephedrine',
      dose: '30-60mg',
      frequency: 'Every 4-6 hours',
      maxDaily: '240mg',
      uses: 'Nasal congestion',
      sideEffects: 'Insomnia, nervousness, headache',
      contraindications: 'High blood pressure, heart disease',
      interactions: 'Decongestants, stimulants'
    }
  ],
  
  antibiotics: [
    {
      name: 'Amoxicillin',
      dose: '250-500mg',
      frequency: 'Every 8 hours',
      maxDaily: '3000mg',
      uses: 'Bacterial infections (ear, throat, UTI)',
      sideEffects: 'Rash, nausea, diarrhea',
      contraindications: 'Penicillin allergy, mononucleosis',
      interactions: 'Birth control, methotrexate, warfarin'
    },
    {
      name: 'Azithromycin (Z-Pack)',
      dose: '500mg',
      frequency: 'Once daily for 5 days',
      maxDaily: '500mg',
      uses: 'Bacterial infections, respiratory infections',
      sideEffects: 'Nausea, diarrhea, abdominal pain',
      contraindications: 'QT prolongation, liver disease',
      interactions: 'Warfarin, digoxin, theophylline'
    }
  ],
  
  digestion: [
    {
      name: 'Omeprazole (Prilosec)',
      dose: '20-40mg',
      frequency: 'Once daily',
      maxDaily: '40mg',
      uses: 'GERD, acid reflux, ulcers',
      sideEffects: 'Headache, nausea, diarrhea',
      contraindications: 'Hypersensitivity',
      interactions: 'Clopidogrel, ketoconazole'
    },
    {
      name: 'Metoclopramide (Reglan)',
      dose: '10mg',
      frequency: 'Three times daily',
      maxDaily: '30mg',
      uses: 'Nausea, vomiting, gastric reflux',
      sideEffects: 'Drowsiness, restlessness',
      contraindications: 'GI obstruction, pheochromocytoma',
      interactions: 'Anticholinergics, narcotics'
    }
  ],
  
  bloodPressure: [
    {
      name: 'Lisinopril',
      dose: '10mg',
      frequency: 'Once daily',
      maxDaily: '40mg',
      uses: 'High blood pressure, heart failure',
      sideEffects: 'Dizziness, headache, dry cough',
      contraindications: 'Pregnancy, angioedema history',
      interactions: 'NSAIDs, potassium supplements, lithium'
    },
    {
      name: 'Metoprolol',
      dose: '50-100mg',
      frequency: 'Once or twice daily',
      maxDaily: '400mg',
      uses: 'High blood pressure, angina, heart attack',
      sideEffects: 'Fatigue, dizziness, slow heart rate',
      contraindications: 'Asthma, heart block, low BP',
      interactions: 'Calcium channel blockers, verapamil'
    }
  ]
};

// Medical conditions and recommended treatments
export const medicalConditions = {
  headache: {
    name: 'Headache',
    types: ['Tension', 'Migraine', 'Cluster', 'Sinus'],
    symptoms: 'Persistent or throbbing head pain, may include nausea or sensitivity to light',
    recommendations: [
      'Rest in a quiet, dark room',
      'Stay hydrated',
      'Apply heat or cold compress',
      'Use over-the-counter pain relievers (Ibuprofen, Paracetamol)',
      'Avoid known triggers'
    ],
    medications: ['Ibuprofen', 'Paracetamol', 'Aspirin'],
    whenToSeeDoctor: 'Sudden severe headache, frequent headaches, vision changes, fever'
  },

  coldAndFlu: {
    name: 'Cold and Flu',
    types: ['Common Cold', 'Influenza'],
    symptoms: 'Runny nose, sore throat, cough, fever, body aches, fatigue',
    recommendations: [
      'Get plenty of rest',
      'Stay hydrated with fluids',
      'Use humidifier',
      'Gargle with warm salt water',
      'Avoid close contact with others'
    ],
    medications: ['Cetirizine', 'Loratadine', 'Pseudoephedrine'],
    whenToSeeDoctor: 'Fever over 39°C, difficulty breathing, chest pain, confusion'
  },

  cough: {
    name: 'Cough',
    types: ['Dry cough', 'Productive cough', 'Chronic cough'],
    symptoms: 'Frequent coughing, may produce mucus or blood',
    recommendations: [
      'Stay hydrated',
      'Use honey (for adults and children over 1 year)',
      'Use humidifier',
      'Avoid smoke and pollution',
      'Use cough drops or lozenges'
    ],
    medications: ['Dextromethorphan', 'Guaifenesin'],
    whenToSeeDoctor: 'Cough lasting more than 3 weeks, blood in sputum, severe dyspnea'
  },

  soreThroat: {
    name: 'Sore Throat',
    types: ['Viral', 'Bacterial (Strep)', 'Allergic'],
    symptoms: 'Pain or scratchiness in throat, difficulty swallowing',
    recommendations: [
      'Gargle with warm salt water',
      'Drink warm liquids',
      'Use throat lozenges',
      'Take anti-inflammatory medication',
      'Use humidifier',
      'Avoid irritants'
    ],
    medications: ['Paracetamol', 'Ibuprofen'],
    whenToSeeDoctor: 'High fever, difficulty swallowing, rash, swollen lymph nodes'
  },

  fever: {
    name: 'Fever',
    types: ['Low-grade', 'High fever'],
    symptoms: 'Body temperature above 38°C (100.4°F)',
    recommendations: [
      'Stay hydrated',
      'Rest',
      'Use light clothing/bedding',
      'Take fever-reducing medication',
      'Lukewarm baths',
      'Monitor temperature regularly'
    ],
    medications: ['Paracetamol', 'Ibuprofen'],
    whenToSeeDoctor: 'Fever over 40°C, lasts more than 3 days, accompanied by severe symptoms'
  },

  diarrhea: {
    name: 'Diarrhea',
    types: ['Viral', 'Bacterial', 'Food poisoning', 'Chronic'],
    symptoms: 'Loose or watery stools, abdominal cramps, urgency',
    recommendations: [
      'Stay hydrated with electrolyte solutions',
      'Eat bland, easy-to-digest foods',
      'Avoid dairy, fatty, and high-fiber foods',
      'Use anti-diarrheal medication if needed',
      'Practice good hygiene',
      'Monitor for dehydration'
    ],
    medications: ['Loperamide', 'Bismuth subsalicylate'],
    whenToSeeDoctor: 'Severe dehydration, blood in stool, lasts more than 2 days, high fever'
  },

  acidity: {
    name: 'Acidity/GERD',
    types: ['Mild reflux', 'Chronic GERD'],
    symptoms: 'Heartburn, regurgitation, chest pain, difficulty swallowing',
    recommendations: [
      'Eat smaller, frequent meals',
      'Avoid spicy, fatty, and acidic foods',
      'Don\'t eat close to bedtime',
      'Elevate head while sleeping',
      'Avoid alcohol and caffeine',
      'Maintain healthy weight'
    ],
    medications: ['Omeprazole', 'Antacids', 'H2 blockers'],
    whenToSeeDoctor: 'Symptoms persist despite treatment, severe pain, difficulty swallowing'
  },

  highBloodPressure: {
    name: 'High Blood Pressure (Hypertension)',
    types: ['Stage 1', 'Stage 2', 'Hypertensive crisis'],
    symptoms: 'Often asymptomatic, may include headache, shortness of breath, chest pain',
    recommendations: [
      'Reduce sodium intake',
      'Maintain healthy weight',
      'Exercise regularly',
      'Reduce stress',
      'Limit alcohol',
      'Quit smoking',
      'Monitor blood pressure regularly'
    ],
    medications: ['Lisinopril', 'Metoprolol', 'Amlodipine'],
    whenToSeeDoctor: 'SBP over 180 or DBP over 120 with symptoms, persistent high readings'
  }
};

// Common medical procedures and information
export const medicalProcedures = {
  bloodTest: {
    name: 'Blood Test',
    types: ['CBC', 'Metabolic Panel', 'Lipid Panel', 'TSH'],
    purpose: 'Diagnose diseases, check organ function, monitor health',
    preparation: 'Usually fasting required for 8-12 hours',
    duration: '5-10 minutes',
    results: 'Usually available in 24-48 hours'
  },

  xray: {
    name: 'X-Ray',
    types: ['Chest', 'Abdominal', 'Extremity', 'Spinal'],
    purpose: 'Visualize bones and internal organs to detect fractures, infections, tumors',
    preparation: 'Remove metal objects, wear hospital gown',
    duration: '5-30 minutes',
    results: 'Usually available in 24-48 hours'
  },

  ultrasound: {
    name: 'Ultrasound',
    types: ['Abdominal', 'Obstetric', 'Cardiac', 'Thyroid'],
    purpose: 'Create images using sound waves to visualize organs and tissues',
    preparation: 'May require full bladder or fasting',
    duration: '20-60 minutes',
    results: 'Usually available immediately or within 24 hours'
  }
};

export default {
  medicationsDatabase,
  medicalConditions,
  medicalProcedures
};
