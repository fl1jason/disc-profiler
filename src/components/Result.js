import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);

function Result({ result }) {
  if (!result) return null;

  // Extract chart data
  const { text, chartData } = result;

  // Remove the JSON block from the text for display
  const displayText = text.replace(/```[\s\S]*?```/, "");

  return (
    <div className="questionnaire-results">
      <h3 className="questionnaire-heading">Your DISC Assessment</h3>
      <div
        className="questionnaire-resultsContent"
        dangerouslySetInnerHTML={{ __html: displayText }}
      />
      {chartData && (
        <div style={{ maxWidth: 400, margin: "2rem auto" }}>
          <Pie data={chartData} />
        </div>
      )}
    </div>
  );
}

export default Result;
