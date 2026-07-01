# Lizenzverwaltungstool

A license management tool built for Liebherr to track and administer software licenses across departments. The application provides a secure REST API for managing licenses, license documents, users, roles, and departments, with JWT-based authentication.

## Features

- **License management** — create, track, and manage software licenses
- **License documents** — attach and manage documentation for each license
- **Department organization** — group licenses and users by department
- **User & role management** — role-based access control
- **JWT authentication** — secure, token-based login and authorization
- **Password hashing** — user credentials secured with BCrypt

## Architecture

The project is split into a backend API and a frontend client.

### Backend (`Backend/LicenseManagementTool_Backend`)

A layered ASP.NET Core Web API following a clean, separated structure:

- **Controllers** — Auth, Licenses, LicenseDocuments, Departments, Users, Roles
- **Services** — business logic layer
- **Repositories** — data access layer
- **Models & DTOs** — domain entities and data transfer objects
- **Data** — Entity Framework Core `ApplicationDbContext` with migrations

## Tech Stack

- **Backend:** ASP.NET Core (.NET 8), Entity Framework Core
- **Authentication:** JWT, BCrypt.Net
- **Frontend:** JavaScript
- **Database:** managed via EF Core migrations

## Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- A supported database (as configured in `appsettings.json`)

### Backend Setup

```bash
git clone https://github.com/binmarkoo/Lizenzverwaltungstool.git
cd Lizenzverwaltungstool/Backend/LicenseManagementTool_Backend/LicenseManagementTool_API
```

Configure your connection string and JWT settings in `appsettings.json` (do not commit secrets — use `appsettings.Development.json` or user secrets locally).

Apply migrations and run:

```bash
dotnet ef database update
dotnet run
```

The API and Swagger UI will be available on the port defined in `launchSettings.json`.

## API Endpoints

The API exposes controllers for the following resources:

| Resource          | Description                          |
|-------------------|--------------------------------------|
| `/api/auth`       | Login & authentication               |
| `/api/licenses`   | License CRUD operations              |
| `/api/licensedocuments` | License document management    |
| `/api/departments`| Department management                |
| `/api/users`      | User management                      |
| `/api/roles`      | Role management                      |

## License

No license specified. All rights reserved by the author.
