#!/bin/bash
set -e

echo "🚀 Starting Azure Database Migration Script"
echo "============================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required environment variables are set
check_environment() {
    print_status "Checking environment variables..."
    
    if [ -z "$DATABASE_CONNECTION_STRING" ]; then
        print_error "DATABASE_CONNECTION_STRING environment variable is not set"
        echo "Please set it using:"
        echo "export DATABASE_CONNECTION_STRING='Host=your-server.postgres.database.azure.com;Database=your-db;Username=your-user;Password=your-password;Port=5432;SSL Mode=Require;'"
        exit 1
    fi
    
    if [ -z "$ASPNETCORE_ENVIRONMENT" ]; then
        print_warning "ASPNETCORE_ENVIRONMENT not set, defaulting to Production"
        export ASPNETCORE_ENVIRONMENT="Production"
    fi
    
    print_success "Environment variables validated"
}

# Install EF Core tools if not present
install_ef_tools() {
    print_status "Checking Entity Framework Core tools..."
    
    if ! command -v dotnet-ef &> /dev/null; then
        print_status "Installing Entity Framework Core tools..."
        dotnet tool install --global dotnet-ef --version 9.0.0
        
        # Add dotnet tools to PATH if not already there
        export PATH="$PATH:$HOME/.dotnet/tools"
        
        print_success "Entity Framework Core tools installed"
    else
        print_success "Entity Framework Core tools already installed"
    fi
}

# Test database connection
test_connection() {
    print_status "Testing database connection..."
    
    # Extract connection details for testing
    HOST=$(echo $DATABASE_CONNECTION_STRING | grep -oP 'Host=\K[^;]*')
    DATABASE=$(echo $DATABASE_CONNECTION_STRING | grep -oP 'Database=\K[^;]*')
    USERNAME=$(echo $DATABASE_CONNECTION_STRING | grep -oP 'Username=\K[^;]*')
    
    print_status "Connecting to: $HOST/$DATABASE as $USERNAME"
    
    # Test connection using dotnet ef
    if dotnet ef database update --dry-run \
        --project ../SentimentAnalysis.Infrastructure.Data \
        --startup-project . \
        --connection "$DATABASE_CONNECTION_STRING" \
        --verbose > /dev/null 2>&1; then
        print_success "Database connection successful"
    else
        print_error "Database connection failed"
        print_error "Please check your connection string and ensure:"
        print_error "1. Database server is accessible"
        print_error "2. Credentials are correct"
        print_error "3. Database exists"
        print_error "4. Firewall allows connections from Azure"
        exit 1
    fi
}

# Create database backup (if in production)
backup_database() {
    if [ "$ASPNETCORE_ENVIRONMENT" = "Production" ]; then
        print_status "Creating database backup before migration..."
        
        BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S)"
        
        # Note: This would require pg_dump to be available
        # For Azure Database for PostgreSQL, backups are automatic
        print_warning "Automatic backups are enabled in Azure Database for PostgreSQL"
        print_warning "Manual backup creation requires pg_dump client tools"
        print_status "Backup name would be: $BACKUP_NAME"
    fi
}

# Run database migrations
run_migrations() {
    print_status "Running database migrations..."
    
    # Get current migration status
    print_status "Current migration status:"
    dotnet ef migrations list \
        --project ../SentimentAnalysis.Infrastructure.Data \
        --startup-project . \
        --connection "$DATABASE_CONNECTION_STRING"
    
    # Apply migrations
    print_status "Applying pending migrations..."
    dotnet ef database update \
        --project ../SentimentAnalysis.Infrastructure.Data \
        --startup-project . \
        --connection "$DATABASE_CONNECTION_STRING" \
        --verbose
    
    if [ $? -eq 0 ]; then
        print_success "Database migrations completed successfully!"
    else
        print_error "Database migration failed!"
        exit 1
    fi
}

# Verify migration success
verify_migration() {
    print_status "Verifying migration success..."
    
    # Check if we can connect and query basic tables
    dotnet ef migrations list \
        --project ../SentimentAnalysis.Infrastructure.Data \
        --startup-project . \
        --connection "$DATABASE_CONNECTION_STRING" | tail -5
    
    print_success "Migration verification completed"
}

# Seed initial data (if needed)
seed_data() {
    if [ "$SEED_DATA" = "true" ]; then
        print_status "Seeding initial data..."
        
        # This would run a custom seeding command
        # dotnet run --project . -- --seed-data
        
        print_warning "Data seeding not implemented in this script"
        print_warning "Add custom seeding logic if needed"
    fi
}

# Main execution
main() {
    echo "Environment: $ASPNETCORE_ENVIRONMENT"
    echo "Timestamp: $(date)"
    echo ""
    
    check_environment
    install_ef_tools
    test_connection
    backup_database
    run_migrations
    verify_migration
    seed_data
    
    print_success "🎉 Database migration completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Verify your application can connect to the database"
    echo "2. Run application health checks"
    echo "3. Test critical functionality"
    echo ""
}

# Handle script interruption
trap 'print_error "Script interrupted"; exit 1' INT TERM

# Run main function
main "$@"