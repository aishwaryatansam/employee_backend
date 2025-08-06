import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { FaClock, FaChartLine, FaPercent, FaFire } from "react-icons/fa";

const summaryData = [
  {
    title: "Total Hours",
    value: "4980",
    icon: <FaClock size={26} color="white" />,
    iconBg: "linear-gradient(195deg, #42424a, #191919)", // subtle black-gray gradient
  },
  {
    title: "Average Hours",
    value: "6.4 hrs",
    icon: <FaChartLine size={26} color="white" />,
    iconBg: "linear-gradient(195deg, #49a3f1, #1a73e8)", // professional blue gradient
  },
  {
    title: "Billable %",
    value: "87%",
    icon: <FaPercent size={26} color="white" />,
    iconBg: "linear-gradient(195deg, #66bb6a, #43a047)", // soft green gradient
  },
  {
    title: "Overtime Hours",
    value: "620",
    icon: <FaFire size={26} color="white" />,
    iconBg: "linear-gradient(195deg, #f44336, #d32f2f)", // soft red gradient
  },
];

const SummaryCards = () => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 3,
        mb: 4,
      }}
    >
      {summaryData.map((card, index) => (
        <Card
          key={index}
          sx={{
            backgroundColor: "white",
            color: "#344767",
            borderRadius: "0.75rem",
            boxShadow:
              "0 0.25rem 0.375rem -0.0625rem rgba(0, 0, 0, 0.1), 0 0.125rem 0.25rem -0.0625rem rgba(0, 0, 0, 0.06)",
            minHeight: 160,
            display: "flex",
            alignItems: "center",
            justifyContent: "center", // centers vertically in card
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "scale(1.02)",
            },
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center", // centers horizontally inside card
              gap: 2,
              width: "100%",
              height: "100%",
              p: 3,
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: card.iconBg,
                borderRadius: "12px",
              }}
            >
              {card.icon}
            </Box>
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                {card.title}
              </Typography>
              <Typography variant="h5" fontWeight={600}>
                {card.value}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default SummaryCards;
