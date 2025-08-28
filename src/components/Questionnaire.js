import { useState } from "react";
import axios from "axios";

const questions = [
  // Dominance (D)
  "I enjoy taking charge of situations.",
  "I prefer action over planning.",
  "I am comfortable making tough decisions.",
  "I am driven to achieve goals quickly.",
  "I like solving challenging problems.",
  "I don't mind confrontation when needed.",
  // Influence (I)
  "I enjoy being the center of attention.",
  "I am enthusiastic and optimistic.",
  "I like persuading others to my point of view.",
  "I enjoy working in teams.",
  "I like motivating and inspiring people.",
  "I feel energized when socializing with others.",
  // Steadiness (S)
  "I value harmony and avoid conflict.",
  "I prefer stable and consistent routines.",
  "I am patient and a good listener.",
  "I am loyal and dependable to my team.",
  "I like supporting others in the background.",
  "I prefer gradual change over fast-paced shifts.",
  // Conscientiousness (C)
  "I pay close attention to detail.",
  "I prefer structure and clearly defined rules.",
  "I take time to carefully analyze before acting.",
  "I am uncomfortable with making mistakes.",
  "I like things to be done correctly rather than quickly.",
  "I seek perfection in my work when possible.",
];

function Questionnaire({ setResult }) {
  const [responses, setResponses] = useState(Array(questions.length).fill(3));
  const [loading, setLoading] = useState(false);

  const handleChange = (index, value) => {
    const updated = [...responses];
    updated[index] = parseInt(value);
    setResponses(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);

    const prompt = `I've responded to a DISC personality questionnaire. For each of the following 24 statements, I've provided a score from 1 (Strongly Disagree) to 5 (Strongly Agree). Based on these, assess my DISC profile and identify my dominant trait(s). Include a brief summary of my behavior in teams and work environments.

${questions.map((q, i) => `${i + 1}. ${q} — ${responses[i]}`).join("\n")}

Please provide:
1. A clear, concise assessment including a description of the personality profile, dominant DISC type(s), and how this might affect their communication and teamwork style. Neatly format the text responses with paragraph and sentence breaks so it can be easily rendered as HTML using <p> and <br /> tags.
2. ChartJS pie chart data in valid JSON format, enclosed within triple backticks and starting with \`\`\`json (for example: \`\`\`json { ... } \`\`\`). The JSON should include proportions for each DISC type and use these colors: D - Red, I - Yellow, S - Green, C - Blue. Do not include any markdown or explanation outside the code block. Only the JSON block should be inside the triple backticks.`;

    try {
      const res = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );

      const message = res.data.choices[0].message.content;
      console.log("OpenAI Response:", message);

      // Extract JSON between triple backticks or triple backticks with 'json'
      const jsonMatch = message.match(/```(?:json)?([\s\S]*?)```/);
      let chartData = null;
      if (jsonMatch) {
        try {
          chartData = JSON.parse(jsonMatch[1]);
        } catch (e) {
          chartData = null;
        }
      }
      console.log("Chart Data:", chartData);
      setResult({ text: message, chartData }); // Pass both text and chartData
    } catch (error) {
      console.error("OpenAI Error", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="questionnaire-heading">DISC Personality Assessment</h2>
      <div className="questionnaire-scaleKey">
        <strong>Scale:</strong>
        <span>1 - Strongly Disagree</span>
        <span>2 - Disagree</span>
        <span>3 - Neutral</span>
        <span>4 - Agree</span>
        <span>5 - Strongly Agree</span>
      </div>
      {questions.map((q, i) => (
        <div key={i} className="questionnaire-question">
          <p>
            {i + 1}. {q}
          </p>
          <input
            className="questionnaire-rangeInput"
            type="range"
            min="1"
            max="5"
            value={responses[i]}
            onChange={(e) => handleChange(i, e.target.value)}
          />
          <span className="questionnaire-responseValue">{responses[i]}</span>
        </div>
      ))}
      <button
        className="questionnaire-button"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Generating Assessment..." : "Submit"}
      </button>
    </>
  );
}

export default Questionnaire;
