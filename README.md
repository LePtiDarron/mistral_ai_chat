# Running the Project with Docker Compose

This project uses Docker Compose to simplify the setup of the development environment. It includes a backend in Express.js, a frontend in Next.js, and a PostgreSQL database.

## Prerequisites

Before you begin, ensure that Docker and Docker Compose are installed on your machine. If they are not installed, follow the instructions below:

- [Install Docker](https://docs.docker.com/get-docker/)
- [Install Docker Compose](https://docs.docker.com/compose/install/)

## Running the Project

1. Clone this repository to your local machine:
    ```bash
    git clone https://github.com/LePtiDarron/mistral_ai_chat.git
    cd mistral_ai_chat
    ```

2. At the root of the project, run the following command to build and start the containers:
    ```bash
    docker-compose up --build
    ```

    Now visit the [http://localhost:3000](web-site) and enjoy !

## Stop running the project

1. To stop the running services, run the following command:
    ```bash
    docker-compose down
    ```

2. To remove the volumes created by the project, run the following command:
    ```bash
    docker-compose down -v
    ```


# Running the Project without Docker Compose

If you prefer to run the project without Docker Compose, you can set up the environment manually. Below are the steps to set up the PostgreSQL database.

## Setting Up PostgreSQL Database

1. Install PostgreSQL:  
    First, you need to install PostgreSQL on your local machine. Follow the installation instructions for your operating system:

    - [PostgreSQL Installation Guide (Windows)](https://www.postgresql.org/download/windows/)
    - [PostgreSQL Installation Guide (macOS)](https://www.postgresql.org/download/macosx/)
    - [PostgreSQL Installation Guide (Linux)](https://www.postgresql.org/download/linux/)

2. Create a Database:  
    Open a terminal and connect to PostgreSQL the folowing command:
    ```bash
    psql -U postgres
    ```

    Once connected to PostgreSQL, create a new database for the project:

    ```SQL
    CREATE DATABASE <your_database_name>;

    CREATE USER <your_username> WITH PASSWORD <your_password>;
    
    GRANT ALL PRIVILEGES ON DATABASE <your_database_name> TO <your_username>;
    ```

3. Configure Database Connection:
    Update the .env file in your project with the correct PostgreSQL connection details.
    ```bash
    DATABASE_URL=postgres://<your_user>:<your_password>@localhost:5432/<your_database>
    ```

## Setting Up the Backend

Once your PostgreSQL database is set up, you can configure and run the backend manually.

1. Install Node.js and Dependencies
    Before setting up the backend, ensure that Node.js is installed on your machine. You can download and install Node.js from the official website:

    - [Install Node.js](https://nodejs.org/)

    Then, run the following command to install the backend dependencies in the /back folder:

    ```bash
    npm install
    ```

2. Running the Backend
    To run the Backend, run the following command in the /back folder:

    ```bash
    npm start
    ```

3. Stop the Backend
    To stop the Backend server, press ```Ctrl+C``` in the terminal where the Backend is running.

## Setting Up the Frontend

Once your PostgreSQL database and backend are set up, you can configure and run the frontend manually.

1. Install Node.js and Dependencies
    Before setting up the frontend, ensure that Node.js is installed on your machine. You can download and install Node.js from the official website:

    - [Install Node.js](https://nodejs.org/)

    Then, run the following command to install the frontend dependencies in the /front folder:

    ```bash
    npm install
    ```

2. Running the Frontend
    To run the Frontend, run the following command in the /front folder:

    ```bash
    npm run dev
    ```

    Now visit the [http://localhost:3000](web-site) and enjoy !

3. Stop the Frontend
    To stop the frontend server, press ```Ctrl+C``` in the terminal where the Frontend is running.
