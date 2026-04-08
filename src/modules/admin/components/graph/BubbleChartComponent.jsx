import React from "react";
import { Bubble } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the necessary components with Chart.js
ChartJS.register(
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

export const BubbleChartComponent = ({ data, options }) => {
  return <Bubble data={data} options={options} height='200px' width='100%' />;
};
