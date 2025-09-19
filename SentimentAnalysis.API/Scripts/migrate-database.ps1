# Azure Database Migration PowerShell Script
param(
    [string]$ConnectionString = $env:DATABASE_CONNECTION_STRING,
    [string]$Environment = $env:ASPNETCORE_ENVIRONMENT,
    [switch]$SeedData = $false,
    [switch]$DryRun = $false
)

# Set error action preference
$ErrorActionPreference = "Stop"

# Colors for output
$Colors = @{
    Red = "Red"
    Green = "Green"
    Yellow = "Yellow"
    Blue = "Blue"
    White = "White"
}

function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Colors.Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor $Colors.Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Colors.Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Colors.Red
}

function Test-Prerequisites {
    Write-Status "Checking prerequisites..."
    
    # Check if .NET is installed
    try {
        $dotnetVersion = dotnet --version
        Write-Success ".NET SDK version: $dotnetVersion"
    }
    catch {
        Write-Error ".NET SDK is not installed or not in PATH"
        exit 1
    }
    
    # Check if EF Core tools are installed
    try {
        $efVersion = dotnet ef --version 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Entity Framework Core tools are installed"
        }
        else {
            Write-Status "Installing Entity Framework Core tools..."
            dotnet tool install --global dotnet-ef --version 9.0.0
            Write-Success "Entity Framework Core tools installed"
        }
    }
    catch {
        Write-Status "Installing Entity Framework Core tools..."
        dotnet tool install --global dotnet-ef --version 9.0.0
        Write-Success "Entity Framework Core tools installed"
    }
}

function Test-Environment {
    Write-Status "Validating environment variables..."
    
    if ([string]::IsNullOrEmpty($ConnectionString)) {
        Write-Error "DATABASE_CONNECTION_STRING is not set"
        Write-Host "Please set it using:" -ForegroundColor $Colors.White
        Write-Host '$env:DATABASE_CONNECTION_STRING = "Host=your-server.postgres.database.azure.com;Database=your-db;Username=your-user;Password=your-password;Port=5432;SSL Mode=Require;"' -ForegroundColor $Colors.White
        exit 1
    }
    
    if ([string]::IsNullOrEmpty($Environment)) {
        Write-Warning "ASPNETCORE_ENVIRONMENT not set, defaulting to Production"
        $Environment = "Production"
        $env:ASPNETCORE_ENVIRONMENT = "Production"
    }
    
    Write-Success "Environment: $Environment"
    Write-Success "Environment variables validated"
}

function Test-DatabaseConnection {
    Write-Status "Testing database connection..."
    
    try {
        # Extract connection details for display
        $connectionParts = $ConnectionString -split ";"
        $host = ($connectionParts | Where-Object { $_ -like "Host=*" }) -replace "Host=", ""
        $database = ($connectionParts | Where-Object { $_ -like "Database=*" }) -replace "Database=", ""
        $username = ($connectionParts | Where-Object { $_ -like "Username=*" }) -replace "Username=", ""
        
        Write-Status "Connecting to: $host/$database as $username"
        
        # Test connection using EF Core
        $testResult = dotnet ef database update --dry-run `
            --project ..\SentimentAnalysis.Infrastructure.Data `
            --startup-project . `
            --connection $ConnectionString `
            --verbose 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Database connection successful"
        }
        else {
            throw "Connection test failed"
        }
    }
    catch {
        Write-Error "Database connection failed: $($_.Exception.Message)"
        Write-Error "Please verify:"
        Write-Error "1. Database server is accessible"
        Write-Error "2. Credentials are correct"
        Write-Error "3. Database exists"
        Write-Error "4. Firewall allows connections from your location"
        exit 1
    }
}

function Backup-Database {
    if ($Environment -eq "Production") {
        Write-Status "Production environment detected"
        Write-Warning "Automatic backups are enabled in Azure Database for PostgreSQL"
        Write-Warning "Manual backup would require pg_dump client tools"
        
        $backupName = "backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
        Write-Status "Backup name would be: $backupName"
    }
}

function Invoke-Migrations {
    Write-Status "Running database migrations..."
    
    try {
        # Show current migration status
        Write-Status "Current migration status:"
        dotnet ef migrations list `
            --project ..\SentimentAnalysis.Infrastructure.Data `
            --startup-project . `
            --connection $ConnectionString
        
        if ($DryRun) {
            Write-Status "DRY RUN: Would apply the following migrations:"
            dotnet ef database update --dry-run `
                --project ..\SentimentAnalysis.Infrastructure.Data `
                --startup-project . `
                --connection $ConnectionString `
                --verbose
        }
        else {
            # Apply migrations
            Write-Status "Applying pending migrations..."
            dotnet ef database update `
                --project ..\SentimentAnalysis.Infrastructure.Data `
                --startup-project . `
                --connection $ConnectionString `
                --verbose
            
            if ($LASTEXITCODE -eq 0) {
                Write-Success "Database migrations completed successfully!"
            }
            else {
                throw "Migration failed with exit code $LASTEXITCODE"
            }
        }
    }
    catch {
        Write-Error "Database migration failed: $($_.Exception.Message)"
        exit 1
    }
}

function Test-Migration {
    if (-not $DryRun) {
        Write-Status "Verifying migration success..."
        
        try {
            # List applied migrations
            $migrations = dotnet ef migrations list `
                --project ..\SentimentAnalysis.Infrastructure.Data `
                --startup-project . `
                --connection $ConnectionString 2>&1
            
            Write-Status "Recent migrations:"
            $migrations | Select-Object -Last 5 | ForEach-Object { Write-Host "  $_" }
            
            Write-Success "Migration verification completed"
        }
        catch {
            Write-Warning "Could not verify migrations: $($_.Exception.Message)"
        }
    }
}

function Initialize-SeedData {
    if ($SeedData -and -not $DryRun) {
        Write-Status "Seeding initial data..."
        
        # Custom seeding logic would go here
        # Example: dotnet run --project . -- --seed-data
        
        Write-Warning "Data seeding not implemented in this script"
        Write-Warning "Add custom seeding logic if needed"
    }
}

function Main {
    Write-Host "🚀 Azure Database Migration Script" -ForegroundColor $Colors.Blue
    Write-Host "=================================" -ForegroundColor $Colors.Blue
    Write-Host ""
    Write-Host "Environment: $Environment" -ForegroundColor $Colors.White
    Write-Host "Timestamp: $(Get-Date)" -ForegroundColor $Colors.White
    Write-Host "Dry Run: $DryRun" -ForegroundColor $Colors.White
    Write-Host ""
    
    try {
        Test-Prerequisites
        Test-Environment
        Test-DatabaseConnection
        Backup-Database
        Invoke-Migrations
        Test-Migration
        Initialize-SeedData
        
        Write-Success "🎉 Database migration completed successfully!"
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor $Colors.White
        Write-Host "1. Verify your application can connect to the database" -ForegroundColor $Colors.White
        Write-Host "2. Run application health checks" -ForegroundColor $Colors.White
        Write-Host "3. Test critical functionality" -ForegroundColor $Colors.White
        Write-Host ""
    }
    catch {
        Write-Error "Migration script failed: $($_.Exception.Message)"
        exit 1
    }
}

# Handle Ctrl+C gracefully
$null = Register-EngineEvent PowerShell.Exiting -Action {
    Write-Warning "Script interrupted by user"
}

# Run main function
Main