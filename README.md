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

## Stop running the project

1. To stop the running services, run the following command:
    ```bash
    docker-compose down
    ```

2. To remove the volumes created by the project, run the following command:
    ```bash
    docker-compose down -v
    ```
