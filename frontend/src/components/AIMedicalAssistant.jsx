import { useState } from 'react';
import api from '../api/api';

// AI Medical Assistant Component - Comprehensive medical chatbot and knowledge base
export default function AIMedicalAssistant() {
  const [activeTab, setActiveTab] = useState('chat'); // chat, medications, conditions, interactions
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: '🏥 Welcome to AI Medical Assistant! I can help you with: medication information, symptom analysis, condition details, and drug interactions. What would you like to know?'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  // Medication Search State
  const [medCategory, setMedCategory] = useState('painRelief');
  const [medicationSearch, setMedicationSearch] = useState('');
  const [medicationResult, setMedicationResult] = useState(null);
  const [medLoading, setMedLoading] = useState(false);

  // Condition Search State
  const [conditionSearch, setConditionSearch] = useState('');
  const [conditionResult, setConditionResult] = useState(null);
  const [condLoading, setCondLoading] = useState(false);

  // Drug Interactions State
  const [drugNames, setDrugNames] = useState('');
  const [interactionResult, setInteractionResult] = useState(null);
  const [interLoading, setInterLoading] = useState(false);

  // ========== CHAT FUNCTIONS ==========

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    setMessages([...messages, { type: 'user', text: inputValue }]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await api.post('/ai/medical-chat', { query: inputValue });
      setMessages(prev => [...prev, {
        type: 'bot',
        text: response.data.response,
        data: response.data
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'bot',
        text: '❌ Error: ' + (error.response?.data?.message || 'Failed to process query')
      }]);
    } finally {
      setLoading(false);
    }
  };

  // ========== MEDICATION FUNCTIONS ==========

  const searchMedicationByCategory = async () => {
    setMedLoading(true);
    try {
      const response = await api.get(`/ai/medications/${medCategory}`);
      setMedicationResult(response.data);
    } catch (error) {
      setMedicationResult({ error: error.response?.data?.message || 'Failed to fetch medications' });
    } finally {
      setMedLoading(false);
    }
  };

  const searchMedicationByName = async () => {
    if (!medicationSearch.trim()) return;
    setMedLoading(true);
    try {
      const response = await api.post('/ai/medication-info', { medicationName: medicationSearch });
      setMedicationResult(response.data);
    } catch (error) {
      setMedicationResult({ error: error.response?.data?.message || 'Medication not found' });
    } finally {
      setMedLoading(false);
    }
  };

  // ========== CONDITION FUNCTIONS ==========

  const searchCondition = async () => {
    if (!conditionSearch.trim()) return;
    setCondLoading(true);
    try {
      const response = await api.get(`/ai/condition/${conditionSearch}`);
      setConditionResult(response.data);
    } catch (error) {
      setConditionResult({ error: error.response?.data?.message || 'Condition not found' });
    } finally {
      setCondLoading(false);
    }
  };

  // ========== DRUG INTERACTIONS FUNCTIONS ==========

  const checkDrugInteractions = async () => {
    if (!drugNames.trim()) return;
    setInterLoading(true);
    try {
      const drugs = drugNames.split(',').map(d => d.trim());
      const response = await api.post('/ai/drug-interactions', { medications: drugs });
      setInteractionResult(response.data);
    } catch (error) {
      setInteractionResult({ error: error.response?.data?.message || 'Error checking interactions' });
    } finally {
      setInterLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        ${tabStyles}
        ${chatStyles}
        ${medicationStyles}
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <h2>🤖 AI Medical Assistant</h2>
        <p>Comprehensive medical information at your fingertips</p>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {['chat', 'medications', 'conditions', 'interactions'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...styles.tabButton,
              ...(activeTab === tab ? styles.tabButtonActive : {})
            }}
          >
            {tab === 'chat' && '💬'} {tab === 'medications' && '💊'}
            {tab === 'conditions' && '🏥'} {tab === 'interactions' && '⚠️'}
            {' '} {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <div style={styles.tab}>
          <div style={styles.chatBox}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                ...styles.message,
                ...(msg.type === 'user' ? styles.userMessage : styles.botMessage)
              }}>
                <span>{msg.text}</span>
              </div>
            ))}
          </div>
          <form onSubmit={handleChatSubmit} style={styles.chatForm}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about medications, symptoms, conditions..."
              style={styles.chatInput}
            />
            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? '...' : 'Send'}
            </button>
          </form>
        </div>
      )}

      {/* Medications Tab */}
      {activeTab === 'medications' && (
        <div style={styles.tab}>
          <h3>💊 Medication Lookup</h3>

          {/* Search by Category */}
          <div style={styles.section}>
            <h4>Browse by Category</h4>
            <div style={styles.flexForm}>
              <select
                value={medCategory}
                onChange={(e) => setMedCategory(e.target.value)}
                style={styles.select}
              >
                <option value="painRelief">Pain Relief</option>
                <option value="coldAndFlu">Cold & Flu</option>
                <option value="antibiotics">Antibiotics</option>
                <option value="digestion">Digestion</option>
                <option value="bloodPressure">Blood Pressure</option>
              </select>
              <button onClick={searchMedicationByCategory} disabled={medLoading} style={styles.btn}>
                {medLoading ? 'Loading...' : 'Browse'}
              </button>
            </div>
          </div>

          {/* Search by Name */}
          <div style={styles.section}>
            <h4>Search by Medication Name</h4>
            <div style={styles.flexForm}>
              <input
                type="text"
                value={medicationSearch}
                onChange={(e) => setMedicationSearch(e.target.value)}
                placeholder="e.g., Paracetamol, Ibuprofen..."
                style={styles.input}
              />
              <button onClick={searchMedicationByName} disabled={medLoading} style={styles.btn}>
                {medLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {/* Results */}
          {medicationResult && (
            <div style={styles.results}>
              {medicationResult.error ? (
                <div style={styles.error}>{medicationResult.error}</div>
              ) : medicationResult.medications ? (
                <div>
                  <h4>Found {medicationResult.medications.length} medications</h4>
                  {medicationResult.medications.map((med, idx) => (
                    <div key={idx} style={styles.medicationCard}>
                      <h5>{med.name}</h5>
                      <p><strong>Dose:</strong> {med.dose}</p>
                      <p><strong>Frequency:</strong> {med.frequency}</p>
                      <p><strong>Max Daily:</strong> {med.maxDaily}</p>
                      <p><strong>Uses:</strong> {med.uses}</p>
                      <p><strong>Side Effects:</strong> {med.sideEffects}</p>
                      <p><strong>Contraindications:</strong> {med.contraindications}</p>
                      <p><strong>Interactions:</strong> {med.interactions}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={styles.medicationCard}>
                  <h5>{medicationResult.medication?.name}</h5>
                  <p><strong>Dose:</strong> {medicationResult.medication?.dose}</p>
                  <p><strong>Frequency:</strong> {medicationResult.medication?.frequency}</p>
                  <p><strong>Uses:</strong> {medicationResult.medication?.uses}</p>
                  <p><strong>Side Effects:</strong> {medicationResult.medication?.sideEffects}</p>
                  <p><strong>Contraindications:</strong> {medicationResult.medication?.contraindications}</p>
                  <p style={styles.disclaimer}>{medicationResult.disclaimer}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Conditions Tab */}
      {activeTab === 'conditions' && (
        <div style={styles.tab}>
          <h3>🏥 Medical Conditions</h3>
          <div style={styles.section}>
            <input
              type="text"
              value={conditionSearch}
              onChange={(e) => setConditionSearch(e.target.value)}
              placeholder="e.g., headache, fever, cough, diarrhea..."
              style={styles.input}
            />
            <button onClick={searchCondition} disabled={condLoading} style={styles.btn}>
              {condLoading ? 'Searching...' : 'Search Condition'}
            </button>
          </div>

          {conditionResult && (
            <div style={styles.results}>
              {conditionResult.error ? (
                <div style={styles.error}>{conditionResult.error}</div>
              ) : (
                <div style={styles.conditionCard}>
                  <h4>{conditionResult.condition?.name}</h4>
                  <p><strong>Symptoms:</strong> {conditionResult.condition?.symptoms}</p>
                  <p><strong>Types:</strong> {conditionResult.condition?.types?.join(', ')}</p>
                  <h5>Recommendations:</h5>
                  <ul>
                    {conditionResult.condition?.recommendations?.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                  <p><strong>Medications:</strong> {conditionResult.condition?.medications?.join(', ')}</p>
                  <p><strong>When to see doctor:</strong> {conditionResult.condition?.whenToSeeDoctor}</p>
                  <p style={styles.disclaimer}>{conditionResult.disclaimer}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Drug Interactions Tab */}
      {activeTab === 'interactions' && (
        <div style={styles.tab}>
          <h3>⚠️ Drug Interactions Checker</h3>
          <div style={styles.section}>
            <textarea
              value={drugNames}
              onChange={(e) => setDrugNames(e.target.value)}
              placeholder="Enter medication names separated by commas. E.g.: Paracetamol, Ibuprofen, Aspirin"
              style={{...styles.textarea, width: '100%', height: '80px'}}
            />
            <button onClick={checkDrugInteractions} disabled={interLoading} style={styles.btn}>
              {interLoading ? 'Checking...' : 'Check Interactions'}
            </button>
          </div>

          {interactionResult && (
            <div style={styles.results}>
              {interactionResult.error ? (
                <div style={styles.error}>{interactionResult.error}</div>
              ) : (
                <div>
                  <p><strong>Medications Checked:</strong> {interactionResult.medicationsChecked?.join(', ')}</p>
                  <p><strong>Interactions Found:</strong> {interactionResult.interactionsFound}</p>
                  {Array.isArray(interactionResult.interactions) && interactionResult.interactions.length > 0 ? (
                    <div>
                      {interactionResult.interactions.map((inter, idx) => (
                        <div key={idx} style={{...styles.interactionCard, borderLeft: '4px solid #dc3545'}}>
                          <p><strong>{inter.medication1}</strong> ↔️ <strong>{inter.medication2}</strong></p>
                          <p style={{color: '#dc3545'}}>{inter.warning}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{...styles.interactionCard, borderLeft: '4px solid #28a745'}}>
                      <p style={{color: '#28a745', fontWeight: 'bold'}}>✅ No major interactions found</p>
                    </div>
                  )}
                  <p style={styles.disclaimer}>{interactionResult.disclaimer}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ========== STYLES ==========

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    background: '#f8f9fa',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '2px solid #e0e0e0'
  },
  logo: {
    width: '60px',
    height: '60px',
    marginBottom: '10px'
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  tabButton: {
    padding: '10px 20px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    background: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'all 0.3s'
  },
  tabButtonActive: {
    background: '#0066cc',
    color: 'white',
    borderColor: '#0066cc'
  },
  tab: {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  chatBox: {
    height: '400px',
    overflowY: 'auto',
    marginBottom: '15px',
    padding: '15px',
    background: '#f5f5f5',
    borderRadius: '8px'
  },
  message: {
    padding: '12px 15px',
    marginBottom: '10px',
    borderRadius: '8px',
    maxWidth: '80%'
  },
  userMessage: {
    alignSelf: 'flex-end',
    background: '#0066cc',
    color: 'white',
    marginLeft: 'auto'
  },
  botMessage: {
    background: '#e8f4f8',
    color: '#333'
  },
  chatForm: {
    display: 'flex',
    gap: '10px'
  },
  chatInput: {
    flex: 1,
    padding: '10px 15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px'
  },
  submitBtn: {
    padding: '10px 20px',
    background: '#0066cc',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  section: {
    marginBottom: '20px',
    padding: '15px',
    background: '#f9f9f9',
    borderRadius: '8px'
  },
  flexForm: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px'
  },
  input: {
    flex: 1,
    padding: '10px 15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px'
  },
  textarea: {
    padding: '10px 15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit'
  },
  select: {
    padding: '10px 15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px'
  },
  btn: {
    padding: '10px 20px',
    background: '#0066cc',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  results: {
    marginTop: '20px'
  },
  medicationCard: {
    background: '#f0f7ff',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '10px',
    borderLeft: '4px solid #0066cc'
  },
  conditionCard: {
    background: '#f0fff4',
    padding: '15px',
    borderRadius: '8px',
    borderLeft: '4px solid #28a745'
  },
  interactionCard: {
    background: '#fff3cd',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '10px'
  },
  error: {
    background: '#f8d7da',
    color: '#721c24',
    padding: '15px',
    borderRadius: '8px',
    borderLeft: '4px solid #dc3545'
  },
  disclaimer: {
    marginTop: '10px',
    padding: '10px',
    background: '#fff3cd',
    borderRadius: '5px',
    fontSize: '12px',
    color: '#856404',
    fontStyle: 'italic'
  }
};

const tabStyles = `
  input[type="text"]:focus,
  input[type="email"]:focus,
  select:focus,
  textarea:focus {
    outline: none;
    border-color: #0066cc;
    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  h3, h4, h5 {
    margin-top: 0;
    color: #333;
  }

  ul {
    padding-left: 20px;
  }

  li {
    margin-bottom: 8px;
    line-height: 1.5;
  }
`;

const chatStyles = `
  .message p {
    margin: 0;
    word-wrap: break-word;
  }
`;

const medicationStyles = `
  .medication-card h5 {
    margin-bottom: 10px;
    color: #0066cc;
  }

  .medication-card p {
    margin: 8px 0;
    font-size: 14px;
    line-height: 1.5;
  }
`;
