# Setup script for Serverless DevOps Framework
Write-Host "Setting up development environment for Serverless DevOps Framework..." -ForegroundColor Green

# Check if Node.js is installed
$nodeVersion = node --version 2>$null
if (-not $?) {
    Write-Host "Node.js is not installed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    Write-Host "After installation, please restart your terminal and run this script again." -ForegroundColor Yellow
    exit 1
}

Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green

# Check if npm is installed
$npmVersion = npm --version 2>$null
if (-not $?) {
    Write-Host "npm is not installed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    Write-Host "After installation, please restart your terminal and run this script again." -ForegroundColor Yellow
    exit 1
}

Write-Host "npm version: $npmVersion" -ForegroundColor Green

# Install dependencies
Write-Host "Installing project dependencies..." -ForegroundColor Green
npm install

# Install development dependencies
Write-Host "Installing development dependencies..." -ForegroundColor Green
npm install --save-dev @types/react @types/react-dom @types/node

# Verify AWS CLI installation
$awsVersion = aws --version 2>$null
if (-not $?) {
    Write-Host "AWS CLI is not installed. Please install AWS CLI from https://aws.amazon.com/cli/" -ForegroundColor Yellow
    Write-Host "After installation, please run 'aws configure' to set up your credentials." -ForegroundColor Yellow
}

# Verify AWS SAM CLI installation
$samVersion = sam --version 2>$null
if (-not $?) {
    Write-Host "AWS SAM CLI is not installed. Please install AWS SAM CLI from https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html" -ForegroundColor Yellow
}

# Create necessary directories if they don't exist
$directories = @(
    "src/functions",
    "src/shared",
    "src/layers",
    "infrastructure/templates",
    "infrastructure/scripts",
    "tests"
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "Created directory: $dir" -ForegroundColor Green
    }
}

# Verify TypeScript compilation
Write-Host "Verifying TypeScript compilation..." -ForegroundColor Green
npx tsc --noEmit

if ($?) {
    Write-Host "TypeScript compilation successful!" -ForegroundColor Green
} else {
    Write-Host "TypeScript compilation failed. Please check the errors above." -ForegroundColor Red
}

Write-Host "`nSetup complete! Here's what you can do next:" -ForegroundColor Green
Write-Host "1. Start the development server: npm start" -ForegroundColor Cyan
Write-Host "2. Build the project: npm run build" -ForegroundColor Cyan
Write-Host "3. Deploy to AWS: npm run deploy:guided" -ForegroundColor Cyan
Write-Host "4. Run tests: npm test" -ForegroundColor Cyan 