const GROQ_API_KEY = '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';

export async function getGroqResponse(prompt) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "mixtral-8x7b-32768",
      messages: [
        { role: "system", content: "You are a helpful AI assistant for people with ADHD." },
        { role: "user", content: prompt }
      ],
      max_tokens: 150,
      temperature: 0.7
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get response from Groq API');
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}