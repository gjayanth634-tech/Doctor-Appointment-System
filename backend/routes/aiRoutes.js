import express from 'express';
import { GoogleGenAI } from '@google/genai';
import authMiddleware from '../middleware/authMiddleware.js';
import { medicationsDatabase, medicalConditions, medicalProcedures } from '../data/medicalKnowledgeBase.js';

const router = express.Router();

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  return apiKey ? new GoogleGenAI({ apiKey }) : null;
}

// Keyword -> specialty/advice mapping for symptom checker
const RULES = [
  {
    keywords: ['chest', 'heart', 'cardiac', 'palpitation'],
    specialty: 'Cardiologist',
    advice: 'Chest discomfort can be serious. Avoid exertion and consult a cardiologist promptly.'
  },
  {
    keywords: ['skin', 'rash', 'acne', 'pimple', 'eczema'],
    specialty: 'Dermatologist',
    advice: 'A dermatologist can evaluate skin conditions and recommend topical or oral treatment.'
  },
  {
    keywords: ['tooth', 'teeth', 'dental', 'gum'],
    specialty: 'Dentist',
    advice: 'Tooth pain may indicate decay or infection. Book a dental check-up.'
  },
  {
    keywords: ['bone', 'fracture', 'joint', 'knee', 'back', 'spine'],
    specialty: 'Orthopedist',
    advice: 'Musculoskeletal pain should be assessed by an orthopedist; rest the affected area.'
  },
  {
    keywords: ['eye', 'vision', 'blur', 'sight'],
    specialty: 'Ophthalmologist',
    advice: 'Changes in vision warrant a full eye examination by an ophthalmologist.'
  },
  {
    keywords: ['child', 'baby', 'infant', 'pediatric', 'toddler'],
    specialty: 'Pediatrician',
    advice: 'Children should be seen by a pediatrician for age-appropriate care.'
  },
  {
    keywords: ['head', 'headache', 'migraine', 'brain', 'seizure', 'dizziness'],
    specialty: 'Neurologist',
    advice: 'Persistent headaches or neurological symptoms need a neurologist evaluation.'
  },
  {
    keywords: ['stomach', 'digest', 'abdomen', 'acidity', 'vomit', 'nausea', 'diarrhea'],
    specialty: 'Gastroenterologist',
    advice: 'Digestive issues are best reviewed by a gastroenterologist; stay hydrated.'
  },
  {
    keywords: ['lung', 'breath', 'asthma', 'cough', 'respiratory'],
    specialty: 'Pulmonologist',
    advice: 'Respiratory issues need assessment by a pulmonologist; avoid irritants.'
  },
  {
    keywords: ['blood', 'pressure', 'hypertension', 'diabetes'],
    specialty: 'Cardiologist/Endocrinologist',
    advice: 'Chronic conditions require specialist evaluation and regular monitoring.'
  }
];

const DEFAULT = {
  specialty: 'General Physician',
  advice: 'Your symptoms are not specific. A general physician can perform a basic evaluation.'
};

// ✅ POST /api/ai/symptom-checker - Intelligent symptom analysis
router.post('/symptom-checker', authMiddleware, (req, res) => {
  try {
    const { symptom } = req.body;

    if (!symptom || typeof symptom !== 'string' || symptom.trim() === '') {
      return res.status(400).json({ message: 'Please provide a symptom description' });
    }

    const text = symptom.toLowerCase();
    let match = DEFAULT;

    for (const rule of RULES) {
      if (rule.keywords.some((k) => text.includes(k))) {
        match = rule;
        break;
      }
    }

    res.json({
      input: symptom,
      specialty: match.specialty,
      advice: match.advice,
      evaluatedAt: new Date().toISOString(),
      disclaimer: 'This is an AI-generated recommendation. Always consult a licensed healthcare provider for accurate diagnosis.'
    });
  } catch (error) {
    res.status(500).json({ message: 'Symptom checker error', error: error.message });
  }
});

// ✅ GET /api/ai/medications/:medicationType - Get medications by category
router.get('/medications/:category', authMiddleware, (req, res) => {
  try {
    const { category } = req.params;
    const meds = medicationsDatabase[category];

    if (!meds) {
      return res.status(404).json({
        message: 'Category not found',
        availableCategories: Object.keys(medicationsDatabase)
      });
    }

    res.json({
      category,
      medications: meds,
      count: meds.length,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Medication retrieval error', error: error.message });
  }
});

// ✅ POST /api/ai/medication-info - Search medications by name
router.post('/medication-info', authMiddleware, (req, res) => {
  try {
    const { medicationName } = req.body;

    if (!medicationName) {
      return res.status(400).json({ message: 'Please provide a medication name' });
    }

    const searchTerm = medicationName.toLowerCase();
    let foundMed = null;

    // Search through all categories
    for (const category in medicationsDatabase) {
      const found = medicationsDatabase[category].find(med =>
        med.name.toLowerCase().includes(searchTerm)
      );
      if (found) {
        foundMed = found;
        break;
      }
    }

    if (!foundMed) {
      return res.status(404).json({
        message: `Medication '${medicationName}' not found in database`,
        suggestion: 'Try searching with the generic name (e.g., "Paracetamol" instead of "Calpol")'
      });
    }

    res.json({
      found: true,
      medication: foundMed,
      disclaimer: 'Always follow your doctor\'s prescription. This is informational only.'
    });
  } catch (error) {
    res.status(500).json({ message: 'Medication info error', error: error.message });
  }
});

// ✅ POST /api/ai/drug-interactions - Check interactions between medications
router.post('/drug-interactions', authMiddleware, (req, res) => {
  try {
    const { medications } = req.body;

    if (!Array.isArray(medications) || medications.length === 0) {
      return res.status(400).json({ message: 'Please provide an array of medication names' });
    }

    const interactions = [];
    const foundMeds = [];

    // Find all medications
    for (const medName of medications) {
      const searchTerm = medName.toLowerCase();
      for (const category in medicationsDatabase) {
        const found = medicationsDatabase[category].find(med =>
          med.name.toLowerCase().includes(searchTerm)
        );
        if (found) {
          foundMeds.push(found);
          break;
        }
      }
    }

    // Check interactions
    for (let i = 0; i < foundMeds.length; i++) {
      for (let j = i + 1; j < foundMeds.length; j++) {
        const med1 = foundMeds[i];
        const med2 = foundMeds[j];

        // Check if med2 is in med1's interactions
        if (med1.interactions && med1.interactions.includes(med2.name)) {
          interactions.push({
            medication1: med1.name,
            medication2: med2.name,
            severity: 'High',
            warning: `Potential interaction between ${med1.name} and ${med2.name}`
          });
        }
      }
    }

    res.json({
      medicationsChecked: foundMeds.map(m => m.name),
      interactionsFound: interactions.length,
      interactions: interactions.length > 0 ? interactions : 'No major interactions found',
      disclaimer: 'Consult your pharmacist or doctor before taking multiple medications together.',
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Drug interaction check error', error: error.message });
  }
});

// ✅ GET /api/ai/condition/:conditionName - Get detailed condition information
router.get('/condition/:conditionName', authMiddleware, (req, res) => {
  try {
    const { conditionName } = req.params;
    const searchTerm = conditionName.toLowerCase();

    let foundCondition = null;
    let conditionKey = null;

    // Search for the condition
    for (const key in medicalConditions) {
      if (key.includes(searchTerm) || medicalConditions[key].name.toLowerCase().includes(searchTerm)) {
        foundCondition = medicalConditions[key];
        conditionKey = key;
        break;
      }
    }

    if (!foundCondition) {
      return res.status(404).json({
        message: `Condition '${conditionName}' not found`,
        availableConditions: Object.keys(medicalConditions),
        allConditionNames: Object.values(medicalConditions).map(c => c.name)
      });
    }

    res.json({
      condition: foundCondition,
      conditionKey,
      disclaimer: 'This information is for educational purposes. Always consult a healthcare provider for medical advice.',
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Condition info error', error: error.message });
  }
});

// ✅ POST /api/ai/treatment-plan - Get treatment plan for a condition
router.post('/treatment-plan', authMiddleware, (req, res) => {
  try {
    const { condition, age, allergies } = req.body;

    if (!condition) {
      return res.status(400).json({ message: 'Please provide a medical condition' });
    }

    const searchTerm = condition.toLowerCase();
    let conditionInfo = null;

    for (const key in medicalConditions) {
      if (key.includes(searchTerm) || medicalConditions[key].name.toLowerCase().includes(searchTerm)) {
        conditionInfo = medicalConditions[key];
        break;
      }
    }

    if (!conditionInfo) {
      return res.status(404).json({ message: `Condition '${condition}' not found` });
    }

    // Get recommended medications
    const recommendedMedications = [];
    for (const category in medicationsDatabase) {
      medicationsDatabase[category].forEach(med => {
        if (conditionInfo.medications.includes(med.name)) {
          recommendedMedications.push(med);
        }
      });
    }

    res.json({
      condition: conditionInfo.name,
      patientAge: age || 'Not specified',
      knownAllergies: allergies || 'None specified',
      homeRemedies: conditionInfo.recommendations,
      medications: recommendedMedications,
      whenToSeeDoctor: conditionInfo.whenToSeeDoctor,
      disclaimer: 'This is AI-generated medical information. Please consult a licensed physician before starting any treatment.',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Treatment plan error', error: error.message });
  }
});

// ✅ POST /api/ai/medical-chat - AI Medical Chat
router.post('/medical-chat', authMiddleware, async (req, res) => {
  try {
    const { query } = req.body;
    const gemini = getGeminiClient();

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ message: 'Please provide a medical question' });
    }

    if (!gemini) {
      return res.status(503).json({
        message: 'AI chat is not configured. Add GEMINI_API_KEY to backend/.env and restart the backend.'
      });
    }

    const completion = await gemini.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
      contents: query,
      config: {
        systemInstruction: 'You are a helpful medical-information assistant for a doctor appointment system. Give concise, general educational information only. Do not diagnose, prescribe, or provide medication dosages. Encourage urgent medical care for emergency symptoms such as chest pain, trouble breathing, severe bleeding, stroke symptoms, seizures, or self-harm. Always recommend consulting a licensed clinician for personal medical decisions.',
        maxOutputTokens: 500,
        temperature: 0.4
      }
    });

    const response = completion.text?.trim();
    if (!response) {
      throw new Error('The AI service returned an empty response.');
    }

    return res.json({
      type: 'ai_response',
      question: query,
      response,
      disclaimer: 'This is general AI-generated medical information, not a diagnosis or treatment plan. Consult a licensed healthcare professional for personal medical advice.'
    });
  } catch (error) {
    console.error('Gemini medical chat error:', error);
    const status = error.status || 500;
    const message = status >= 400 && status < 500
      ? 'The AI service could not process this request. Check your Gemini API key, model access, and billing.'
      : 'The AI chat service is temporarily unavailable. Please try again.';
    res.status(status).json({ message });
  }
});

// ✅ GET /api/ai/all-medications - Get all medications available
router.get('/all-medications', authMiddleware, (req, res) => {
  try {
    const allMeds = [];
    for (const category in medicationsDatabase) {
      medicationsDatabase[category].forEach(med => {
        allMeds.push({
          ...med,
          category
        });
      });
    }

    res.json({
      totalMedications: allMeds.length,
      categories: Object.keys(medicationsDatabase),
      medications: allMeds,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching medications', error: error.message });
  }
});

// ✅ GET /api/ai/all-conditions - Get all conditions available
router.get('/all-conditions', authMiddleware, (req, res) => {
  try {
    const allConditions = [];
    for (const key in medicalConditions) {
      allConditions.push({
        key,
        ...medicalConditions[key]
      });
    }

    res.json({
      totalConditions: allConditions.length,
      conditions: allConditions,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conditions', error: error.message });
  }
});

// ✅ GET /api/ai/procedures/:procedureName - Get procedure information
router.get('/procedures/:procedureName', authMiddleware, (req, res) => {
  try {
    const { procedureName } = req.params;
    const searchTerm = procedureName.toLowerCase();

    let foundProcedure = null;

    for (const key in medicalProcedures) {
      if (key.includes(searchTerm) || medicalProcedures[key].name.toLowerCase().includes(searchTerm)) {
        foundProcedure = medicalProcedures[key];
        break;
      }
    }

    if (!foundProcedure) {
      return res.status(404).json({
        message: `Procedure '${procedureName}' not found`,
        availableProcedures: Object.keys(medicalProcedures)
      });
    }

    res.json({
      procedure: foundProcedure,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Procedure info error', error: error.message });
  }
});

export default router;
