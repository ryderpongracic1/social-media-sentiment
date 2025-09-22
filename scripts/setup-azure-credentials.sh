#!/bin/bash

# Azure Credentials Setup Script for GitHub Actions
# This script helps you create the required Azure service principal and configure GitHub secrets

set -e

echo "🚀 Azure Credentials Setup for GitHub Actions"
echo "================================================"
echo ""

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI is not installed. Please install it first:"
    echo "   https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Check if user is logged in
if ! az account show &> /dev/null; then
    echo "🔐 Please login to Azure CLI first:"
    az login
fi

# Get current subscription info
SUBSCRIPTION_ID=$(az account show --query id --output tsv)
SUBSCRIPTION_NAME=$(az account show --query name --output tsv)

echo "📋 Current Azure Subscription:"
echo "   ID: $SUBSCRIPTION_ID"
echo "   Name: $SUBSCRIPTION_NAME"
echo ""

# Ask for resource group name
read -p "🏗️  Enter your Azure Resource Group name: " RESOURCE_GROUP

if [ -z "$RESOURCE_GROUP" ]; then
    echo "❌ Resource Group name is required"
    exit 1
fi

# Check if resource group exists
if ! az group show --name "$RESOURCE_GROUP" &> /dev/null; then
    echo "❌ Resource Group '$RESOURCE_GROUP' does not exist"
    echo "   Please create it first or use an existing one"
    exit 1
fi

echo "✅ Resource Group '$RESOURCE_GROUP' found"
echo ""

# Create service principal
echo "🔧 Creating Azure Service Principal..."
SP_NAME="github-actions-social-media-sentiment-$(date +%s)"

# Create service principal with contributor role
CREDENTIALS=$(az ad sp create-for-rbac \
    --name "$SP_NAME" \
    --role contributor \
    --scopes "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP" \
    --sdk-auth)

if [ $? -eq 0 ]; then
    echo "✅ Service Principal created successfully"
else
    echo "❌ Failed to create Service Principal"
    exit 1
fi

echo ""
echo "🎯 GitHub Repository Secrets Configuration"
echo "==========================================="
echo ""
echo "1. Go to your GitHub repository: https://github.com/ryderpongracic1/social-media-sentiment"
echo "2. Navigate to Settings → Secrets and variables → Actions"
echo "3. Click 'New repository secret'"
echo "4. Create the following secret:"
echo ""
echo "   Secret Name: AZURE_CREDENTIALS"
echo "   Secret Value (copy the JSON below):"
echo ""
echo "$CREDENTIALS"
echo ""
echo "🔒 IMPORTANT: Keep these credentials secure and never commit them to your repository!"
echo ""
echo "📝 Additional Setup Required:"
echo "   1. Ensure your Azure App Service 'sentiment-analysis-api-1' exists"
echo "   2. Verify your Azure Static Web Apps token is configured"
echo "   3. Test the deployment by pushing to the main branch"
echo ""
echo "✅ Setup complete! Your deployment should now work."
echo ""
echo "🆘 Need help? Check the troubleshooting guide:"
echo "   docs/DEPLOYMENT_TROUBLESHOOTING.md"
