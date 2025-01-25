/* eslint-disable no-unused-vars */

import {
    Box,
    Button,
    Container,
    Grid,
    Typography,
    useTheme,
    alpha,
    Paper,
    Stack,
    IconButton,
    Card,
    Avatar,
    Divider,
    Tooltip,
    Zoom,
  } from "@mui/material"
  import {
    Inventory,
    Timeline,
    Notifications,
    Security,
    ArrowForward,
    CloudDownload,
    Speed,
    Psychology,
    Devices,
    CheckCircle,
    Star,
    TrendingUp,
    Lightbulb,
    Rocket,
    AutoGraph,
    Shield,
  } from "@mui/icons-material"
  import { motion } from "framer-motion"
  
  const LandingPage = () => {
    const theme = useTheme()
  
    const features = [
      {
        icon: <Rocket sx={{ fontSize: 48 }} />,
        title: "Next-Gen Inventory Control",
        description:
          "Revolutionary AI-powered system with real-time tracking, predictive analytics, and autonomous stock optimization.",
        color: "#7C3AED",
        details: [
          "Real-time inventory tracking across multiple locations",
          "AI-driven demand forecasting and stock level optimization",
          "Automated reordering and supplier management",
          "Integration with IoT devices for physical inventory tracking",
        ],
      },
      {
        icon: <AutoGraph sx={{ fontSize: 48 }} />,
        title: "Quantum Analytics Engine",
        description:
          "Harness the power of quantum computing and ML to transform raw data into strategic business intelligence.",
        color: "#EC4899",
        details: [
          "Quantum-inspired algorithms for complex optimization problems",
          "Machine learning models for pattern recognition and anomaly detection",
          "Real-time data processing and visualization",
          "Predictive analytics for market trends and business forecasting",
        ],
      },
      {
        icon: <Psychology sx={{ fontSize: 48 }} />,
        title: "Cognitive Alert System",
        description: "Self-learning notification engine that adapts to your workflow using advanced behavioral analysis.",
        color: "#F59E0B",
        details: [
          "Personalized alert thresholds based on user behavior",
          "Natural language processing for context-aware notifications",
          "Integration with communication platforms (Slack, Email, SMS)",
          "Automated escalation and task assignment",
        ],
      },
      {
        icon: <Shield sx={{ fontSize: 48 }} />,
        title: "Fortress-Grade Security",
        description: "Quantum-resistant encryption with multi-factor biometrics and distributed ledger verification.",
        color: "#10B981",
        details: [
          "Post-quantum cryptography for data protection",
          "Blockchain-based audit trails for all transactions",
          "Multi-factor authentication with biometric options",
          "Real-time threat detection and automated countermeasures",
        ],
      },
    ]
  
    const testimonials = [
      {
        name: "Sarah Johnson",
        role: "Chief Innovation Officer",
        company: "TechVision Global",
        avatar: "/avatars/sarah.jpg",
        quote:
          "This platform revolutionized our entire supply chain, delivering an astounding 85% improvement in operational efficiency.",
        rating: 5,
      },
      {
        name: "Michael Chen",
        role: "VP of Operations",
        company: "Nexus Logistics",
        avatar: "/avatars/michael.jpg",
        quote:
          "A game-changing solution that slashed our costs by 65% and eliminated stockouts completely. Simply extraordinary.",
        rating: 5,
      },
      {
        name: "Emma Davis",
        role: "Director of Digital Transformation",
        company: "Future Systems",
        avatar: "/avatars/emma.jpg",
        quote:
          "The perfect fusion of cutting-edge technology and intuitive design. Our ROI exceeded 300% in the first year.",
        rating: 5,
      },
    ]
  
    const metrics = [
      { label: "Enterprise Clients", value: "100,000+", icon: <Devices />, growth: "+312% YoY" },
      { label: "Processing Speed", value: "0.0001ms", icon: <Speed />, growth: "99.999% uptime" },
      { label: "AI Accuracy", value: "99.99%", icon: <Psychology />, growth: "+28% QoQ" },
      { label: "Customer Success", value: "100%", icon: <CheckCircle />, growth: "World's Best" },
    ]
  
    return (
      <Box
        sx={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
          color: "#F8FAFC",
          overflow: "hidden",
          position: "relative",
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            background: "radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.2) 0%, rgba(124, 58, 237, 0) 70%)",
            pointerEvents: "none",
            backdropFilter: "blur(120px)",
          }}
        />
  
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center" sx={{ minHeight: "100vh", py: { xs: 12, md: 16 } }}>
            <Grid item xs={12} md={6}>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <Box
                  sx={{
                    display: "inline-block",
                    background: "linear-gradient(135deg, rgba(124, 58, 237, 0.3), rgba(236, 72, 153, 0.3))",
                    borderRadius: 3,
                    px: 3,
                    py: 1.5,
                    mb: 4,
                    backdropFilter: "blur(15px)",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: "#F8FAFC",
                      fontWeight: 700,
                      letterSpacing: 3,
                    }}
                  >
                    REVOLUTIONIZING ENTERPRISE LOGISTICS
                  </Typography>
                </Box>
  
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: "3.5rem", md: "4.5rem" },
                    background: "linear-gradient(135deg, #7C3AED, #EC4899)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    lineHeight: 1.1,
                    mb: 4,
                    letterSpacing: -1.5,
                  }}
                >
                  The Evolution of
                  <br />
                  Smart Inventory
                </Typography>
  
                <Typography
                  variant="h5"
                  sx={{
                    color: "#94A3B8",
                    mb: 6,
                    lineHeight: 1.8,
                    fontWeight: 400,
                    maxWidth: "90%",
                    fontSize: "1.35rem",
                  }}
                >
                  Harness the power of quantum computing and artificial intelligence to transform your inventory
                  management into a strategic advantage.
                </Typography>
  
                <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems={{ xs: "stretch", sm: "center" }}>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{
                      background: "linear-gradient(135deg, #7C3AED, #EC4899)",
                      color: "white",
                      px: 6,
                      py: 2.5,
                      borderRadius: 3,
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      textTransform: "none",
                      boxShadow: "0 20px 40px rgba(124, 58, 237, 0.4)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 30px 60px rgba(124, 58, 237, 0.5)",
                      },
                    }}
                  >
                    Launch Your Future
                  </Button>
  
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<CloudDownload />}
                    sx={{
                      color: "#F8FAFC",
                      borderColor: "rgba(248, 250, 252, 0.3)",
                      borderWidth: 2,
                      px: 6,
                      py: 2.375,
                      borderRadius: 3,
                      fontSize: "1.2rem",
                      fontWeight: 600,
                      textTransform: "none",
                      backdropFilter: "blur(15px)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderColor: "#F8FAFC",
                        background: "rgba(248, 250, 252, 0.15)",
                        transform: "translateY(-3px)",
                      },
                    }}
                  >
                    Experience Demo
                  </Button>
                </Stack>
              </motion.div>
            </Grid>
  
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <Box
                  sx={{
                    position: "relative",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: -20,
                      left: -20,
                      right: -20,
                      bottom: -20,
                      background: "radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.4), transparent 70%)",
                      filter: "blur(40px)",
                      borderRadius: 8,
                      zIndex: 0,
                    },
                  }}
                >
                  <Box
                    component="img"
                    src="/dashboard-preview.svg"
                    alt="Advanced Dashboard"
                    sx={{
                      width: "100%",
                      borderRadius: 8,
                      position: "relative",
                      zIndex: 1,
                      boxShadow: "0 25px 80px rgba(124, 58, 237, 0.4)",
                      transition: "all 0.4s ease",
                      "&:hover": {
                        transform: "translateY(-8px) scale(1.02)",
                        boxShadow: "0 35px 100px rgba(124, 58, 237, 0.5)",
                      },
                    }}
                  />
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
  
        {/* Metrics Section */}
        <Container maxWidth="lg" sx={{ py: { xs: 10, md: 16 } }}>
          <Grid container spacing={4} justifyContent="center">
            {metrics.map((metric, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      height: "100%",
                      background: "rgba(30, 41, 59, 0.5)",
                      borderRadius: 4,
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(248, 250, 252, 0.1)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 20px 40px rgba(124, 58, 237, 0.2)",
                      },
                    }}
                  >
                    <Stack spacing={3} alignItems="center" textAlign="center">
                      <Box
                        sx={{
                          color: "#7C3AED",
                          background: "rgba(124, 58, 237, 0.2)",
                          p: 2,
                          borderRadius: 3,
                        }}
                      >
                        {metric.icon}
                      </Box>
                      <Typography variant="h3" sx={{ fontWeight: 700, letterSpacing: -0.5, color: "#F8FAFC" }}>
                        {metric.value}
                      </Typography>
                      <Box>
                        <Typography variant="subtitle1" sx={{ color: "#94A3B8", mb: 1 }}>
                          {metric.label}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#7C3AED",
                            background: "rgba(124, 58, 237, 0.2)",
                            px: 2,
                            py: 0.75,
                            borderRadius: 20,
                            fontWeight: 600,
                          }}
                        >
                          {metric.growth}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
  
        {/* Features Section */}
        <Container maxWidth="lg" sx={{ py: { xs: 10, md: 16 } }}>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      height: "100%",
                      background: "rgba(30, 41, 59, 0.5)",
                      borderRadius: 4,
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(248, 250, 252, 0.1)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 20px 40px rgba(124, 58, 237, 0.2)",
                      },
                    }}
                  >
                    <Stack spacing={3}>
                      <IconButton
                        sx={{
                          color: feature.color,
                          background: alpha(feature.color, 0.2),
                          width: "fit-content",
                          p: 2,
                          "&:hover": {
                            background: alpha(feature.color, 0.3),
                          },
                        }}
                      >
                        {feature.icon}
                      </IconButton>
                      <Typography
                        variant="h5"
                        sx={{
                          color: "#F8FAFC",
                          fontWeight: 700,
                          letterSpacing: -0.5,
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#94A3B8",
                          lineHeight: 1.7,
                        }}
                      >
                        {feature.description}
                      </Typography>
                      <Tooltip
                        title={
                          <Box>
                            {feature.details.map((detail, i) => (
                              <Typography key={i} variant="body2" sx={{ mb: 1 }}>
                                • {detail}
                              </Typography>
                            ))}
                          </Box>
                        }
                        placement="top"
                        TransitionComponent={Zoom}
                      >
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{
                            color: feature.color,
                            borderColor: alpha(feature.color, 0.5),
                            "&:hover": {
                              borderColor: feature.color,
                              background: alpha(feature.color, 0.1),
                            },
                          }}
                        >
                          Learn More
                        </Button>
                      </Tooltip>
                    </Stack>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
  
        {/* Testimonials Section */}
        <Container maxWidth="lg" sx={{ py: { xs: 10, md: 16 } }}>
          <Typography
            variant="h2"
            align="center"
            sx={{
              fontWeight: 800,
              mb: 2,
              background: "linear-gradient(135deg, #7C3AED, #EC4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: -1,
            }}
          >
            Trusted by Industry Leaders
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{
              color: "#94A3B8",
              mb: 10,
              maxWidth: 600,
              mx: "auto",
              lineHeight: 1.8,
            }}
          >
            Join the ranks of visionary organizations revolutionizing their operations with our next-generation platform
          </Typography>
  
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Card
                    sx={{
                      p: 4,
                      height: "100%",
                      background: "rgba(30, 41, 59, 0.5)",
                      borderRadius: 4,
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(248, 250, 252, 0.1)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 20px 40px rgba(124, 58, 237, 0.2)",
                      },
                    }}
                  >
                    <Stack spacing={3}>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} sx={{ color: "#F59E0B" }} />
                        ))}
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#F8FAFC",
                          fontStyle: "italic",
                          lineHeight: 1.8,
                          fontSize: "1.1rem",
                        }}
                      >
                        &ldquo;{testimonial.quote}&rdquo;
                      </Typography>
                      <Divider sx={{ borderColor: "rgba(248, 250, 252, 0.1)" }} />
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          src={testimonial.avatar}
                          sx={{
                            width: 56,
                            height: 56,
                            border: "2px solid rgba(124, 58, 237, 0.3)",
                          }}
                        />
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#F8FAFC", mb: 0.5 }}>
                            {testimonial.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#94A3B8" }}>
                            {testimonial.role} • {testimonial.company}
                          </Typography>
                        </Box>
                      </Stack>
                    </Stack>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    )
  }
  
  export default LandingPage
  
  