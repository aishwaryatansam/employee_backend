import React from "react";
import { Card, CardContent, Typography, Box, Grid } from "@mui/material";
import HrSidebar from "layouts/dashboard/hr/sidebar/HrSidebar";
import HrNavbar from "layouts/dashboard/hr/navbar/HrNavbar";
import "./companyoverview.css";

const CompanyOverview = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <HrSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: "240px", mt: "80px" }}>
        <HrNavbar />
        <Box className="company-overview-container">
          <Grid container justifyContent="center">
            <Grid item xs={12} sm={10} md={8} lg={6}>
              <Card className="company-overview-card">
                <CardContent>
                  <Typography variant="h4" className="overview-title" gutterBottom>
                    Company Overview
                  </Typography>
                  <Box className="overview-content">
                    <Typography>
                      <strong>Founded:</strong> 2021
                    </Typography>
                    <Typography>
                      <strong>Total Employees:</strong> 58
                    </Typography>
                    <Typography>
                      <strong>Projects:</strong> 12 active, 4 completed
                    </Typography>
                    <Typography>
                      <strong>Departments:</strong> HR, Development, QA, Support
                    </Typography>
                    <Typography>
                      <strong>Office Locations:</strong> Chennai, Bangalore
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default CompanyOverview;
