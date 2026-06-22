# Banking Management System

A production-ready Banking Management System built with a modern tech stack.

## Technologies Used
* **Frontend**: React.js, Vite, Bootstrap 5, Vanilla CSS (Glassmorphism theme)
* **Backend**: Java 17, Spring Boot 3.x, Spring Data JPA, Spring Security (JWT)
* **Database**: MySQL 8.0
* **DevOps**: Docker & Docker Compose
* **Build Tool**: Maven / npm

## Features
### Admin Role
* View all system customers and accounts.
* Monitor all transactions across the system.
* Manage system liquidity and metrics.

### Customer Role
* Secure User Registration and Login.
* View assigned accounts and real-time balances.
* Perform transactions (Deposits, Withdrawals, Fund Transfers).
* View account transaction history.

## Getting Started

### Prerequisites
* Docker and Docker Compose installed on your machine.

### Running with Docker (Recommended)
1. Navigate to the root directory of the project.
2. Run the following command:
   ```bash
   docker-compose up --build -d
   ```
3. The application will be available at:
   * **Frontend**: http://localhost
   * **Backend API**: http://localhost:8080/api
   * **Swagger UI**: http://localhost:8080/swagger-ui.html

### Default Ports
* MySQL: `3306`
* Backend API: `8080`
* Frontend App: `80`

## Architecture
* **Layered Backend**: Controller -> Service -> Repository -> Entity.
* **Component-Based Frontend**: React context for state management, Axios interceptors for JWT injection.
* **Database**: Relational database with strictly enforced ACID properties for transactions.

## API Documentation
Once the backend is running, you can access the Swagger UI documentation at `http://localhost:8080/swagger-ui.html`.
