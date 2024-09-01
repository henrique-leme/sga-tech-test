Aqui está o README detalhado com base no template fornecido:

# SGA Tech Test

<p align="center">
  <img src="https://img.shields.io/static/v1?label=Node.js&message=runtime&color=green&style=for-the-badge&logo=node.js"/>
  <img src="https://img.shields.io/static/v1?label=TypeScript&message=language&color=blue&style=for-the-badge&logo=typescript"/>
  <img src="https://img.shields.io/static/v1?label=NestJS&message=framework&color=red&style=for-the-badge&logo=nestjs"/>
  <img src="https://img.shields.io/static/v1?label=GraphQL&message=query%20language&color=orange&style=for-the-badge&logo=graphql"/>
  <img src="https://img.shields.io/static/v1?label=SQLite&message=database&color=yellow&style=for-the-badge&logo=sqlite"/>
  <img src="https://img.shields.io/static/v1?label=Jest&message=test%20framework&color=brightgreen&style=for-the-badge&logo=jest"/>
  <img src="https://img.shields.io/static/v1?label=Docker&message=containerization&color=blue&style=for-the-badge&logo=docker"/>
</p>

## Project Status: ⚠️ In Development

### Description

SGA Tech Test is a backend service built as a technical test for the SGA company. It is designed using modern web technologies such as Node.js, NestJS, TypeScript, and GraphQL. The project includes features like user authentication, tutorial management, and data persistence using SQLite. Additionally, the project includes Docker support for containerized deployment and caching for optimized performance.

### ⚙️ Features

- **Backend:**
  - User Signup and Authentication
  - Tutorial Management with CRUD operations
  - Pagination and Filtering for tutorials
  - Caching for optimized data retrieval
  - Secure and efficient data handling using SQLite
  - Comprehensive unit testing with Jest
  - Dockerized setup for consistent development and deployment environments

### 📚 Documentation

For detailed documentation, refer to the [Documentation](#) (link will be added).

To access the documentation locally:

1. Clone the project.
2. Follow the setup instructions below.

### 📝 Table of Contents

- [Getting Started](#getting-started)
- [How to Run](#how-to-run)
- [Testing](#testing)
- [Deployment](#deployment)
- [Built With](#built-with)
- [Authors](#authors)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### 📋 Prerequisites

Ensure you have the following installed:

- Git
- Node.js (version 20 or later)
- pnpm (Package Manager)
- Docker (for containerization)

### 🔧 Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/henrique-leme/sga-tech-test.git
   ```

2. Navigate to the project directory:

   ```sh
   cd sga-tech-test/
   ```

3. Copy the environment configuration file:

   ```sh
   cp .env.example .env

   # Note: This command will not work on Windows OS. For Windows, you must manually copy and paste the .env.example and rename it to .env
   ```

4. Install dependencies:

   ```sh
   pnpm install
   ```

## ⚙️ How to Run

1. Start the development server using Docker:

   ```sh
   pnpm compose:up
   ```

   This command will build the Docker containers and start the application.

2. If you want to run the application locally without Docker:

   ```sh
   pnpm start:dev
   ```

   This command will start the NestJS application in development mode.

### 🧪 Testing

To run the tests, use the following command:

```sh
pnpm run test
```

This will execute all unit tests using Jest.

### 📦 Deployment

Deployment steps will be provided in future updates.

### 🛠️ Built With

- **Server:**
  - [Node.js](https://nodejs.org/) - The runtime environment
  - [NestJS](https://nestjs.com/) - The web framework
  - [TypeScript](https://www.typescriptlang.org/) - The programming language
  - [GraphQL](https://graphql.org/) - The query language
  - [SQLite](https://www.sqlite.org/index.html) - The database
  - [Jest](https://jestjs.io/) - The testing framework
  - [Docker](https://www.docker.com/) - Containerization

## ✒️ Authors

- **Henrique Leme** - _Developer_ - [GitHub](https://github.com/henrique-leme)

See also the list of [contributors](https://github.com/henrique-leme/sga-tech-test/contributors) who participated in this project.
