# Cinephoria

Cinephoria is a fictional cinema management application, created as part of the ongoing assessments for the Bachelor’s Degree in PHP/Symfony Development.

## Technologies Used
### Backend (Common to all Frontends)

- Symfony LTS 6.4: A PHP framework for building web applications.
- ApiPlatform: A framework for building API-driven applications with Symfony.
- PostgreSQL: A relational database used for data storage.
- MongoDB: A NoSQL database used for flexible data storage.
- Mailpit: Used for local email testing and development, simulating an email server.
- Dockerized: The backend is containerized using Docker for consistent environment setup.

### Web Application

- Next.js: A React framework for building server-rendered web applications.
- Dockerized: The web app is containerized using Docker for consistent environment setup.

### Mobile Application

- Expo / React Native: Used for building mobile applications using React Native.
- pnpm: A fast, disk space-efficient package manager used for managing dependencies in the mobile app.

### Desktop Application

- Tauri: A framework for building lightweight, secure desktop applications using web technologies.
- React.js: A JavaScript library for building user interfaces, used in the desktop app.

## Prerequisites
Before getting started, ensure you have the following software installed:

**Docker:** For containerization and easy deployment.  
Installation Guide: [Docker Engine](https://docs.docker.com/engine/install/)  
**Docker Compose:** For managing multi-container Docker applications.    
Installation Guide: [Docker Compose](https://docs.docker.com/compose/install/)   
**Node.js:** JavaScript runtime environment.  
Installation Guide: [Node.js](https://nodejs.org/en)  
**pnpm:** A fast and efficient package manager.  
Installation Guide: [pnpm Installation](https://pnpm.io/installation)  
**Tauri Prerequisites**: Required for building desktop applications with Tauri.  
Installation Guide: [Tauri Prerequisites](https://tauri.app/start/prerequisites/)

## Installation
1) Clone the repository:
```bash
   git clone https://github.com/Aurelie-feyzin/cinephoria.git
   cd cinephoria
```

2) Docker Setup:  
To set up the backend, databases and web app, use Docker Compose to launch the services:
```bash
docker compose build --no-cache
```
This will start all required services such as the backend (Symfony, ApiPlatform), PostgreSQL, MongoDB, Mailpit, and web app in Docker containers.

3) Configuring Symfony  
Ensure the backend is running:
```bash
docker compose up -d
```
Access the backend container:
```bash
make bash
```
Generate the JWT key pair:
```bash
php bin/console lexik:jwt:generate-keypair
exit
```
This will create the necessary public and private keys used for JWT authentication. Make sure to update your environment variables if needed.

4) Mobile App Setup:  
Navigate to the mobile directory and install dependencies using pnpm:
```bash
cd react_expo
pnpm install
```

5) Desktop App Setup:  
Navigate to the desktop directory and install dependencies using pnpm:
```bash
cd ../desktop_app # Or use 'cd desktop_app' if running from the project root
pnpm install
```
Make a copy of .env.dist and rename it to .env to configure the environment.
```bash
cp .env.dist .env # Copy .env.dist and rename it to .env
```

## Data Initialization

The project contains a Makefile at the root, which centralizes some of the commands necessary to manage the project, especially for the backend and web app.
To initialize the database, run the following command from the root of the project:
```bash
cd ..   # return to root project
docker compose up -d # Ensure the backend is running before loading fixtures
make fixtures
```
This will initialize data for **cinemas**, **movies**, **sessions**, **users**, and **reservations** in the database.

### Users Generated by Fixtures

When initializing data with the make load-fixtures command, several users are automatically generated in the database for testing purposes. Here are the types of users created:

- Admin: A user with administrative privileges, having access to all the backend features.
- Employee: An employee who has access to the intranet section, manages the movie session scheduling, and moderates the reviews submitted by Users.
- User: A standard user who can make reservations and leave reviews for movies.
```
admin: admin@test.fr P@ssword1
employee: employee@test.fr P@ssword1
user: user@test.fr P@ssword1
```

### Running the Applications

Before starting the applications (web, mobile, desktop), it's essential to have the backend running. This allows the other apps to communicate with the server via the API.
 1) Start the backend and the web application:
```bash
docker compose up -d
```
Open https://localhost in your favorite web browser
Mailpit is available at http://localhost:8025/ for testing emails locally during development.
The API Documentation is available at http://localhost/docs for an overview of the available endpoints and their usage.

 2) Start the Mobile Application:

Navigate to the mobile directory and start the Expo application:
```bash
cd react_expo
npx expo start
```
After running the command above, you will see a QR code in your terminal.  
Scan this QR code to open the app on your device.  
If you're using an Android Emulator or iOS Simulator, you can press a or i respectively to open the app.

 3) Start the Desktop Application: 

Navigate to the desktop directory and start the Tauri application:
```bash
cd desktop_app
pnpm tauri dev
```

**Make sure the backend is running before starting the other applications.**


### Other Commands
For additional useful commands and setup tasks, refer to the **Makefile** or check the scripts section in the various **package.json** files.

### Attribution Requirements

- Icons: The icons used in the project are sourced from Tailwind CSS Generator Icons.    
- Movie Images: The movie images are fetched from image.tmdb.org.   

**This product uses the TMDB API but is not endorsed or certified by TMDB.**
https://developer.themoviedb.org/docs/faq

