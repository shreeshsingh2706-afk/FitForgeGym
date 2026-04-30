# FitForge Gym — Full-Stack Setup Guide
### React + Spring Boot + MySQL + Nginx on AWS

---

## 📁 Folder Structure

```
fitforge-fullstack/
│
├── backend/                         ← Spring Boot (Java)
│   ├── pom.xml                      ← Maven dependencies
│   └── src/main/
│       ├── java/com/fitforge/
│       │   ├── FitForgeApplication.java    ← Main entry point
│       │   ├── controller/
│       │   │   └── UserController.java     ← REST API endpoints
│       │   ├── model/
│       │   │   └── User.java               ← Database entity
│       │   ├── repository/
│       │   │   └── UserRepository.java     ← DB queries
│       │   └── service/
│       │       └── UserService.java        ← Business logic
│       └── resources/
│           └── application.properties      ← DB config
│
├── frontend/                        ← React App
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── index.js                 ← React entry point
│       ├── App.jsx                  ← Main component
│       └── services/
│           └── api.js               ← All API calls
│
├── nginx/
│   └── fitforge.conf                ← Nginx config for AWS
│
└── docs/
    └── mysql-setup.sql              ← DB setup script
```

---

## 🔌 REST API Endpoints

| Method | Endpoint      | Description                        |
|--------|---------------|------------------------------------|
| GET    | /api/hello    | Health check — test if API is up   |
| GET    | /api/users    | Get all registered gym members     |
| POST   | /api/users    | Register a new member              |
| GET    | /api/users/1  | Get member with ID = 1             |
| GET    | /api/stats    | Get gym stats (count, plans, etc.) |

**POST /api/users body example:**
```json
{
  "name": "John Doe",
  "email": "john@gmail.com",
  "plan": "Pro"
}
```

---

## 🖥️ LOCAL DEVELOPMENT SETUP

### Prerequisites
- Java 17+ (`java -version`)
- Maven 3.8+ (`mvn -version`)
- Node.js 18+ (`node -version`)
- MySQL 8+ (running locally)

---

### Step 1 — Setup MySQL

```bash
# Open MySQL terminal
mysql -u root -p

# Run the setup script
source docs/mysql-setup.sql

# OR paste this manually:
CREATE DATABASE fitforge_db;
CREATE USER 'fitforge_user'@'localhost' IDENTIFIED BY 'fitforge_pass';
GRANT ALL ON fitforge_db.* TO 'fitforge_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

### Step 2 — Start Spring Boot Backend

```bash
cd backend

# Install dependencies and run
mvn spring-boot:run
```

You should see:
```
✅ FitForge Backend is running at http://localhost:8080
```

**Test the API:**
```bash
# Health check
curl http://localhost:8080/api/hello

# Get users
curl http://localhost:8080/api/users

# Register a user
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@gmail.com","plan":"Pro"}'
```

---

### Step 3 — Start React Frontend

```bash
cd frontend

# Install packages
npm install

# Start dev server
npm start
```

React runs at: http://localhost:3000
It auto-proxies /api/* calls to Spring Boot on port 8080.

---

## ☁️ AWS DEPLOYMENT (EC2 + Nginx)

### Step 1 — Launch EC2 Instance
- AMI: Ubuntu 22.04 LTS
- Type: t2.micro (free tier)
- Security Groups: Allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS)

### Step 2 — Install Dependencies on EC2

```bash
# Connect to EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Java 17
sudo apt install -y openjdk-17-jdk

# Install MySQL
sudo apt install -y mysql-server
sudo mysql_secure_installation

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install -y nginx
```

### Step 3 — Setup MySQL on EC2

```bash
sudo mysql -u root -p
# Run the same mysql-setup.sql script
```

### Step 4 — Deploy Backend

```bash
# On your LOCAL machine: build the JAR
cd backend
mvn clean package -DskipTests
# This creates: target/fitforge-backend-1.0.0.jar

# Upload to EC2
scp -i your-key.pem target/fitforge-backend-1.0.0.jar ubuntu@your-ec2-ip:~/

# On EC2: run the JAR as a background service
java -jar fitforge-backend-1.0.0.jar &
# Or use systemd for production (see below)
```

### Step 5 — Deploy Frontend

```bash
# On LOCAL machine: set production API URL and build
cd frontend
REACT_APP_API_URL=http://your-ec2-ip/api npm run build

# Upload build folder to EC2
scp -r build/ ubuntu@your-ec2-ip:/var/www/fitforge
```

### Step 6 — Configure Nginx

```bash
# On EC2:
sudo cp nginx/fitforge.conf /etc/nginx/sites-available/fitforge
sudo ln -s /etc/nginx/sites-available/fitforge /etc/nginx/sites-enabled/
sudo nginx -t         # Test config
sudo systemctl restart nginx
```

### Step 7 — (Optional) Run Backend as a System Service

Create `/etc/systemd/system/fitforge.service`:
```ini
[Unit]
Description=FitForge Spring Boot App
After=network.target

[Service]
User=ubuntu
ExecStart=/usr/bin/java -jar /home/ubuntu/fitforge-backend-1.0.0.jar
SuccessExitStatus=143
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable fitforge
sudo systemctl start fitforge
sudo systemctl status fitforge
```

---

## 🔧 Common Issues & Fixes

| Problem | Fix |
|---------|-----|
| `Access denied for user` | Re-run mysql-setup.sql and check credentials in application.properties |
| `CORS error` in browser | Add your domain to `@CrossOrigin` in UserController.java |
| React shows "API Offline" | Make sure Spring Boot is running on port 8080 |
| Nginx 502 Bad Gateway | Spring Boot is not running — check with `ps aux \| grep java` |
| Port 8080 blocked on AWS | Add inbound rule for port 8080 in EC2 Security Group |

---

## 👥 Team — FitForge
Shreesh Kumar Singh · Kaustubh Desale · Sahil Thorat · Kalpit Kumar
Apoorv Tripathi · Jatin Kumar · Prashant Chaudhary · Ayush Aryan · Atharva Dhone
