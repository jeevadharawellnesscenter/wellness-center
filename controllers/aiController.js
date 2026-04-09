// @desc    Get AI advice
// @route   POST /api/ai/advise
// @access  Public
export const getAIAdvice = async (req, res) => {
  try {
    const { message, healthGoal } = req.body;

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ success: false, message: 'AI Advisor not configured (API Key missing)' });
    }

    const systemPrompt = `
      You are the "Jeevadhara Wellness Advisor", a peaceful and expert naturopathy assistant.
      Your goal is to guide users toward holistic health using natural therapies.
      
      Clinic Specializations:
      - Hydrotherapy: Healing with water temperature/pressure.
      - Mud Therapy: Detoxification using therapeutic mud.
      - Massage Therapy: Deep tissue and relaxation.
      - Yoga & Meditation: Mindfulness and physical peace.
      - Diet Consultation: Personalized nutrition.
      
      Always be calm, empathetic, and encouraging. 
      Recommend specific Jeevadhara services when appropriate.
      Refuse to give medical diagnoses, but encourage natural lifestyle changes.
      Keep responses concise and beautiful.
    `;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: healthGoal ? `My health goal is: ${healthGoal}. ${message}` : message }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();
    
    if (data.error) {
       throw new Error(data.error.message || 'Groq API Error');
    }

    res.json({ 
      success: true, 
      advice: data.choices[0].message.content 
    });
  } catch (error) {
    console.error('AI Advisor Error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to get AI advice: ' + error.message });
  }
};
