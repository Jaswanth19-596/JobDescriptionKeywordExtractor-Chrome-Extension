export async function getKeywordsFromLLM(jobDescription, apiKey) {
  const model = 'gemini-2.5-flash-lite';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const prompt = `
    Extract technical keywords from the following job description.
    Return ONLY a valid JSON object, no text before or after.
    The keys should be keywords and values should be their frequencies.
    Example:
    {"react": 3, "nodejs": 2, "sql": 4}

    Job Description:
    ---
    ${jobDescription}
    ---
  `;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`API error (attempt ${attempt}): ${errorBody}`);
        throw new Error(
          `Gemini API failed with status ${response.status}: ${errorBody}`
        );
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!text) throw new Error('Empty response from Gemini API.');

      // Try to extract JSON safely even if extra text is around it
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON object found in response.');

      const jsonString = jsonMatch[0];
      const parsedJson = JSON.parse(jsonString);

      // Normalize keys to lowercase and merge counts
      const normalizedKeywords = {};
      for (const key in parsedJson) {
        if (Object.hasOwnProperty.call(parsedJson, key)) {
          const lowerKey = key.toLowerCase();
          const value = parsedJson[key];
          if (normalizedKeywords[lowerKey]) {
            normalizedKeywords[lowerKey] += value;
          } else {
            normalizedKeywords[lowerKey] = value;
          }
        }
      }
      return normalizedKeywords;
    } catch (err) {
      console.error(`Error calling Gemini API (attempt ${attempt}):`, err);

      if (attempt === 3) throw err; // fail after 3 tries

      // Wait a bit before retrying (in case of rate limiting)
      await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
    }
  }
}
