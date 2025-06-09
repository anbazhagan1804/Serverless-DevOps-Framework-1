# Troubleshooting Guide

## Development Environment Setup

### Node.js and npm Issues

1. **Node.js not found**
   - Error: `'node' is not recognized as an internal or external command`
   - Solution:
     1. Download and install Node.js from https://nodejs.org/
     2. Choose the LTS (Long Term Support) version
     3. Restart your terminal after installation
     4. Verify installation with `node --version`

2. **npm not found**
   - Error: `'npm' is not recognized as an internal or external command`
   - Solution:
     1. Reinstall Node.js (npm comes bundled with Node.js)
     2. Restart your terminal
     3. Verify installation with `npm --version`

### TypeScript/React Type Errors

1. **Module not found errors**
   - Error: `Cannot find module 'react' or its corresponding type declarations`
   - Solution:
     ```bash
     npm install --save-dev @types/react @types/react-dom @types/node
     ```

2. **JSX compilation errors**
   - Error: `Cannot use JSX unless the '--jsx' flag is provided`
   - Solution:
     1. Ensure `tsconfig.json` has the correct JSX configuration:
     ```json
     {
       "compilerOptions": {
         "jsx": "react-jsx"
       }
     }
     ```
     2. Run `npm install` to ensure all dependencies are installed

### AWS CLI Issues

1. **AWS CLI not found**
   - Error: `'aws' is not recognized as an internal or external command`
   - Solution:
     1. Install AWS CLI from https://aws.amazon.com/cli/
     2. Restart your terminal
     3. Run `aws configure` to set up credentials

2. **AWS SAM CLI not found**
   - Error: `'sam' is not recognized as an internal or external command`
   - Solution:
     1. Install AWS SAM CLI from https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html
     2. Restart your terminal
     3. Verify installation with `sam --version`

## Build and Deployment Issues

### npm Build Errors

1. **Module not found during build**
   - Error: `Module not found: Can't resolve 'module-name'`
   - Solution:
     1. Run `npm install` to install missing dependencies
     2. Check `package.json` for correct dependency versions
     3. Delete `node_modules` folder and `package-lock.json`, then run `npm install`

2. **TypeScript compilation errors**
   - Error: `Type 'X' is not assignable to type 'Y'`
   - Solution:
     1. Check type definitions in your code
     2. Ensure all required props are provided to components
     3. Run `npm run build` to see detailed error messages

### AWS Deployment Issues

1. **AWS credentials not configured**
   - Error: `Unable to locate credentials`
   - Solution:
     1. Run `aws configure`
     2. Enter your AWS Access Key ID
     3. Enter your AWS Secret Access Key
     4. Enter your default region
     5. Enter your output format (json)

2. **SAM deployment errors**
   - Error: `Error: Failed to create/update the stack`
   - Solution:
     1. Check CloudFormation console for detailed error messages
     2. Verify IAM permissions
     3. Check template.yaml for syntax errors
     4. Ensure all required resources are available in your AWS account

## Runtime Issues

### React Application

1. **Blank page or white screen**
   - Check browser console for errors
   - Verify that the development server is running (`npm start`)
   - Check if all required environment variables are set

2. **API connection issues**
   - Verify API endpoint URLs
   - Check CORS configuration
   - Ensure API Gateway is properly configured
   - Check Lambda function permissions

### Lambda Functions

1. **Function timeout**
   - Check function logs in CloudWatch
   - Increase function timeout in template.yaml
   - Optimize function code

2. **Permission errors**
   - Check IAM roles and policies
   - Verify resource ARNs
   - Check CloudWatch logs for detailed error messages

## Getting Help

If you encounter issues not covered in this guide:

1. Check the project's GitHub issues
2. Search for similar issues in the AWS Forums
3. Review AWS documentation for the specific service
4. Contact AWS Support if you have a support plan

## Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build the project
npm run build

# Run tests
npm test

# Deploy to AWS
npm run deploy:guided

# Clean and rebuild
rm -rf node_modules
rm package-lock.json
npm install
``` 