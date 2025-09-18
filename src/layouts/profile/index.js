/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import React, { useState } from "react";

// @mui components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";

// Material Dashboard components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Layout and component imports
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import ProfilesList from "examples/Lists/ProfilesList";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";

// Overview page components
import Header from "layouts/profile/components/Header";

// Data
import profilesListData from "layouts/profile/data/profilesListData";

// Images
import homeDecor1 from "assets/images/home-decor-1.jpg";
import homeDecor2 from "assets/images/home-decor-2.jpg";
import homeDecor3 from "assets/images/home-decor-3.jpg";
import homeDecor4 from "assets/images/home-decor-4.jpeg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

// Admin Sidebar
import AdminSidebar from "layouts/dashboard/admin/adminsidebar";

function Overview() {
  const [profileData, setProfileData] = useState({
    fullName: "Alec M. Thompson",
    mobile: "(44) 123 1234 123",
    email: "alecthompson@mail.com",
    location: "USA",
    description:
      "Hi, I’m Alec Thompson, Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality).",
  });

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(profileData);

  const handleClickOpen = () => {
    setOpen(true);
    setFormData(profileData);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setProfileData(formData);
    handleClose();
  };

  const renderEditDialog = () => (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="h6">Edit Profile</MDTypography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </MDBox>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <MDButton onClick={handleClose} color="secondary">
          Cancel
        </MDButton>
        <MDButton onClick={handleSave} color="info">
          Save
        </MDButton>
      </DialogActions>
    </Dialog>
  );

  return (
    <MDBox py={3} px={3} display="flex">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <MDBox ml="240px" width="100%">
        <DashboardNavbar />
        <MDBox mb={2} />
        <Header>
          <MDBox mt={5} mb={3}>
            <Grid container spacing={1}>
              <Grid item xs={12} md={8} xl={8} sx={{ display: "flex" }}>
                <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
                <ProfileInfoCard
                  title="profile information"
                  description={profileData.description}
                  info={{
                    fullName: profileData.fullName,
                    mobile: profileData.mobile,
                    email: profileData.email,
                    location: profileData.location,
                  }}
                  social={[
                    {
                      link: "https://www.facebook.com/CreativeTim/",
                      icon: <FacebookIcon />,
                      color: "facebook",
                    },
                    {
                      link: "https://twitter.com/creativetim",
                      icon: <TwitterIcon />,
                      color: "twitter",
                    },
                    {
                      link: "https://www.instagram.com/creativetimofficial/",
                      icon: <InstagramIcon />,
                      color: "instagram",
                    },
                  ]}
                  action={{
                    route: "#",
                    tooltip: "Edit Profile",
                    icon: (
                      <IconButton onClick={handleClickOpen} sx={{ p: 0 }}>
                        <EditIcon />
                      </IconButton>
                    ),
                  }}
                  shadow={false}
                />
                <Divider orientation="vertical" sx={{ mx: 0 }} />
              </Grid>
              {/* <Grid item xs={12} xl={4}>
                <ProfilesList title="conversations" profiles={profilesListData} shadow={false} />
              </Grid> */}
            </Grid>
          </MDBox>

          <MDBox pt={2} px={2} lineHeight={1.25}>
            <MDTypography variant="h6" fontWeight="medium">
              Projects
            </MDTypography>
            <MDBox mb={1}>
              <MDTypography variant="button" color="text">
                Architects design houses
              </MDTypography>
            </MDBox>
          </MDBox>

          <MDBox p={2}>
            <Grid container spacing={6}>
              {[homeDecor1, homeDecor2, homeDecor3, homeDecor4].map((img, index) => (
                <Grid item xs={12} md={6} xl={3} key={index}>
                  <DefaultProjectCard
                    image={img}
                    label={`project #${index + 1}`}
                    title={["modern", "scandinavian", "minimalist", "gothic"][index]}
                    description={
                      [
                        "As Uber works through a huge amount of internal management turmoil.",
                        "Music is something that everyone has their own specific opinion about.",
                        "Different people have different taste, and various types of music.",
                        "Why would anyone pick blue over pink? Pink is obviously a better color.",
                      ][index]
                    }
                    action={{
                      type: "internal",
                      route: "/pages/profile/profile-overview",
                      color: "info",
                      label: "view project",
                    }}
                    authors={[
                      { image: team1, name: "Elena Morison" },
                      { image: team2, name: "Ryan Milly" },
                      { image: team3, name: "Nick Daniel" },
                      { image: team4, name: "Peterson" },
                    ]}
                  />
                </Grid>
              ))}
            </Grid>
          </MDBox>
        </Header>
        <Footer />
        {renderEditDialog()}
      </MDBox>
    </MDBox>
  );
}

export default Overview;
