import React from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import {
  CloudQueue as CloudIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Storage as StorageIcon,
  Timeline as TimelineIcon,
  Code as CodeIcon,
} from '@mui/icons-material';

const features = [
  {
    icon: <CloudIcon fontSize="large" color="primary" />,
    title: 'Serverless Architecture',
    description: 'Built on AWS Lambda and API Gateway for scalable, cost-effective solutions.',
  },
  {
    icon: <CodeIcon fontSize="large" color="primary" />,
    title: 'Infrastructure as Code',
    description: 'Define your infrastructure using AWS SAM and CloudFormation templates.',
  },
  {
    icon: <TimelineIcon fontSize="large" color="primary" />,
    title: 'CI/CD Pipeline',
    description: 'Automated deployment with GitHub Actions and advanced deployment strategies.',
  },
  {
    icon: <SpeedIcon fontSize="large" color="primary" />,
    title: 'Canary Deployments',
    description: 'Gradual rollout of new features with automatic rollback capabilities.',
  },
  {
    icon: <StorageIcon fontSize="large" color="primary" />,
    title: 'Feature Flags',
    description: 'Dynamic feature management with percentage-based rollouts and A/B testing.',
  },
  {
    icon: <SecurityIcon fontSize="large" color="primary" />,
    title: 'Security First',
    description: 'Built-in security best practices and AWS WAF integration.',
  },
];

const App: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Serverless DevOps
          </Typography>
          <Button color="primary" href="#features">
            Features
          </Button>
          <Button color="primary" href="#getting-started">
            Get Started
          </Button>
          <Button
            variant="contained"
            color="primary"
            href="https://github.com/yourusername/serverless-devops-framework"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            color="text.primary"
            gutterBottom
          >
            Serverless DevOps Framework
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            A modern serverless application framework implementing Infrastructure as Code (IaC)
            with AWS SAM, featuring advanced deployment strategies and feature flag management.
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              href="#getting-started"
              sx={{ mr: 2 }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              href="https://github.com/yourusername/serverless-devops-framework"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }} maxWidth="lg" id="features">
        <Typography
          component="h2"
          variant="h3"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Features
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  bgcolor: 'background.default',
                  borderRadius: 2,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                {feature.icon}
                <Typography
                  component="h3"
                  variant="h5"
                  sx={{ mt: 2, mb: 1 }}
                >
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Getting Started Section */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          py: 8,
        }}
        id="getting-started"
      >
        <Container maxWidth="md">
          <Typography
            component="h2"
            variant="h3"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Getting Started
          </Typography>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mt: 4,
              bgcolor: 'background.default',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Quick Start
            </Typography>
            <Box
              component="pre"
              sx={{
                p: 2,
                bgcolor: 'grey.900',
                color: 'grey.100',
                borderRadius: 1,
                overflowX: 'auto',
              }}
            >
              {`# Clone the repository
git clone https://github.com/yourusername/serverless-devops-framework.git
cd serverless-devops-framework

# Install dependencies
npm install

# Configure AWS credentials
aws configure

# Deploy to AWS
npm run deploy:guided`}
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            {'© '}
            {new Date().getFullYear()}
            {' Serverless DevOps Framework. All rights reserved.'}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default App; 