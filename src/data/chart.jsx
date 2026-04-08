import React from "react";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels
);

export const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
    datalabels: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
      },
    },
  },
};

export const barChartData = {
  labels: ["January", "February", "March", "April", "May"], // Example labels
  datasets: [
    {
      label: "Dataset 1",
      data: [400, 300, 600, 200, 500], // Example data for Dataset 1
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Dataset 2",
      data: [700, 100, 800, 400, 300], // Example data for Dataset 2
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

export const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      // position: "top",
      display: false,
    },
    datalabels: {
      display: false,
    },
  },

  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
      },
    },
  },
};

// export const doughnutChartOptions = {
//   responsive: true,
//   maintainAspectRatio: false,
//   plugins: {
//     legend: {
//       display: false, // Hide legend if not needed
//     },
//     tooltip: {
//       callbacks: {
//         label: (tooltipItem) => {
//           return `${tooltipItem.label}: ${tooltipItem.raw}`; // Tooltip shows label and value
//         },
//       },
//     },
//     datalabels: {
//       display: true, // Display data labels inside the doughnut
//       color: "black", // Label color
//       font: {
//         size: 14, // Font size for labels
//         weight: "bold", // Bold font for better visibility
//       },
//       formatter: (value, context) => {
//         // return `${context.chart.data.labels[context.dataIndex]}
//         // `;
//         return `${value}
//         `;
//       },
//       anchor: "center", // Anchors the label to the center of the slice
//       align: "center",
//       // Aligns the label to the center of the slice
//     },
//   },
// };

export const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: {
      display: true,
      position: "bottom",
    },
    tooltip: {
      callbacks: {
        label: (tooltipItem) => {
          const dataset = tooltipItem.dataset;
          const dataIndex = tooltipItem.dataIndex;
          const value = dataset.data[dataIndex];
          const hoverLabel = dataset.hoverLabels[dataIndex];
          return `${hoverLabel}: ${value}`;
        },
      },
    },
    datalabels: {
      display: true,
      color: "white",
      font: {
        size: 14,
        weight: "bold",
      },
      formatter: (value, context) => {
        return `${value}`;
      },
      anchor: "center",
      align: "center",
    },
  },
};
export const orbitOwnDoughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: {
      display: false,
      position: "bottom",
    },
    tooltip: {
      callbacks: {
        label: (tooltipItem) => {
          const dataset = tooltipItem.dataset;
          const dataIndex = tooltipItem.dataIndex;
          const value = dataset.data[dataIndex];
          const hoverLabel = dataset.hoverLabels[dataIndex];
          return `${hoverLabel}: ${value}`;
        },
      },
    },
    datalabels: {
      display: true,
      color: "white",
      font: {
        size: 14,
        weight: "bold",
      },
      formatter: (value, context) => {
        return `${value}`;
      },
      anchor: "center",
      align: "center",
    },
  },
};
export const doughnutSlaSuccessChartOptions = {
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: {
      display: false,
      position: "bottom",
    },
    tooltip: {
      enabled: true,
    },
    tooltip: {
      callbacks: {
        label: (tooltipItem) => {
          const dataset = tooltipItem.dataset;
          const dataIndex = tooltipItem.dataIndex;
          const value = dataset.data[dataIndex];
          const hoverLabel = dataset.hoverLabels[dataIndex];
          return `${hoverLabel}: ${value}`;
        },
      },
    },
    datalabels: {
      display: false,
      color: "white",
      font: {
        size: 14,
        weight: "bold",
      },
      formatter: (value, context) => {
        return `${value}`;
      },
      anchor: "center",
      align: "center",
    },
  },
};
export const doughnutSlaFrViolatedChartOptions = {
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: {
      display: false,
      position: "bottom",
    },
    tooltip: {
      callbacks: {
        label: (tooltipItem) => {
          const dataset = tooltipItem.dataset;
          const dataIndex = tooltipItem.dataIndex;
          const value = dataset.data[dataIndex];
          const hoverLabel = dataset.hoverLabels[dataIndex];
          return `${hoverLabel}: ${value}`;
        },
      },
    },
    datalabels: {
      display: false,
      color: "white",
      font: {
        size: 14,
        weight: "bold",
      },
      formatter: (value, context) => {
        return `${value}`;
      },
      anchor: "center",
      align: "center",
    },
  },
};
export const doughnutSlaSrViolatedChartOptions = {
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: {
      display: false,
      position: "bottom",
    },
    tooltip: {
      callbacks: {
        label: (tooltipItem) => {
          const dataset = tooltipItem.dataset;
          const dataIndex = tooltipItem.dataIndex;
          const value = dataset.data[dataIndex];
          const hoverLabel = dataset.hoverLabels[dataIndex];
          return `${hoverLabel}: ${value}`;
        },
      },
    },
    datalabels: {
      display: false,
      color: "white",
      font: {
        size: 14,
        weight: "bold",
      },
      formatter: (value, context) => {
        return `${value}`;
      },
      anchor: "center",
      align: "center",
    },
  },
};
export const lineChartData = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      label: "Open",
      data: [400, 300, 600, 200, 500, 66, 6, 6, 6, 6, 6, 66],
      // borderColor: "rgb(255, 99, 132)",
      // borderColor: "#44ABFF",
      borderColor: "rgb(68, 171, 255,.3)",
      // backgroundColor: "rgba(255, 99, 132, 0.5)",
      fill: true,
      backgroundColor: "rgb(68, 171, 255,.1)",
    },
    {
      label: "Closed",
      data: [40, 30, 60, 20, 50, 7, 6, 6, 6, 6, 6, 66],
      // borderColor: "rgb(255, 99, 132)",
      // borderColor: "#44ABFF",
      borderColor: "rgb(68, 171, 255,.3)",
      // backgroundColor: "rgba(255, 99, 132, 0.5)",
      fill: true,
      backgroundColor: "rgb(68, 171, 255,.1)",
    },
  ],
};

// export const ticketStatisticsBarOptions = {
//   responsive: true,
//   plugins: {
//     legend: {
//       position: "top",
//     },
//     title: {
//       display: true,
//       text: "Today's trends",
//     },
//   },
// };

export const ticketStatisticsBarData = [
  {
    label: "Open",
    value: 100,
  },

  {
    label: "Closed",
    value: 180,
  },
  {
    label: "Request Resolved",
    value: 80,
  },
  {
    label: "Avg. First Response Time",
    value: 480,
  },
  {
    label: "Avg. Service Time",
    value: 280,
  },
];

export const slaViolationBarData = [
  {
    label: "First Response Time",
    value: 480,
  },
  {
    label: "Service Time",
    value: 280,
  },
];

export const topComplaintBarData = [
  {
    label: "SubCategory-1",
    value: 10,
  },
  {
    label: "SubCategory-2",
    value: 80,
  },
  {
    label: "SubCategory-3",
    value: 180,
  },
  {
    label: "SubCategory-4",
    value: 280,
  },
  {
    label: "SubCategory-5",
    value: 380,
  },
  {
    label: "SubCategory-6",
    value: 480,
  },
  {
    label: "SubCategory-1",
    value: 10,
  },
  {
    label: "SubCategory-2",
    value: 80,
  },
  {
    label: "SubCategory-3",
    value: 180,
  },
  {
    label: "SubCategory-4",
    value: 280,
  },
  {
    label: "SubCategory-5",
    value: 380,
  },
  {
    label: "SubCategory-6",
    value: 480,
  },
  {
    label: "SubCategory-1",
    value: 10,
  },
  {
    label: "SubCategory-2",
    value: 80,
  },
  {
    label: "SubCategory-3",
    value: 180,
  },
  {
    label: "SubCategory-4",
    value: 280,
  },
  {
    label: "SubCategory-5",
    value: 380,
  },
  {
    label: "SubCategory-6",
    value: 480,
  },
  {
    label: "SubCategory-1",
    value: 10,
  },
  {
    label: "SubCategory-2",
    value: 80,
  },
  {
    label: "SubCategory-3",
    value: 180,
  },
  {
    label: "SubCategory-4",
    value: 280,
  },
  {
    label: "SubCategory-5",
    value: 380,
  },
  {
    label: "SubCategory-6",
    value: 480,
  },
  {
    label: "SubCategory-1",
    value: 10,
  },
  {
    label: "SubCategory-2",
    value: 80,
  },
  {
    label: "SubCategory-3",
    value: 180,
  },
  {
    label: "SubCategory-4",
    value: 280,
  },
  {
    label: "SubCategory-5",
    value: 380,
  },
  {
    label: "SubCategory-6",
    value: 480,
  },
  {
    label: "SubCategory-1",
    value: 10,
  },
  {
    label: "SubCategory-2",
    value: 80,
  },
  {
    label: "SubCategory-3",
    value: 180,
  },
  {
    label: "SubCategory-4",
    value: 280,
  },
  {
    label: "SubCategory-5",
    value: 380,
  },
  {
    label: "SubCategory-6",
    value: 480,
  },
  {
    label: "SubCategory-1",
    value: 10,
  },
  {
    label: "SubCategory-2",
    value: 80,
  },
  {
    label: "SubCategory-3",
    value: 180,
  },
];
