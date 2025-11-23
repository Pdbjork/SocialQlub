# Deployment Guide

## Option 1: Render.com (Recommended)
Render is a modern cloud provider that makes deploying Python apps extremely easy. It connects directly to your GitHub repository.

### 1. Push to GitHub
Make sure your code is pushed to a GitHub repository.

### 2. Create Web Service
1. Sign up/Log in to [Render.com](https://render.com).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.

### 3. Configure
Render will auto-detect Python, but ensure these settings:
- **Runtime**: Python 3
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn app:app`

### 4. Environment Variables
Scroll down to "Advanced" or "Environment" and add:
- Key: `STRIPE_SECRET_KEY`
- Value: `your_stripe_secret_key_here` (Copy from app.py)

### 5. Deploy
Click **Create Web Service**. Render will build and deploy your app. You will get a URL like `socialqlub.onrender.com`.

### 6. Custom Domain
1. In Render dashboard, go to **Settings** > **Custom Domains**.
2. Add `qlubchi.com` (or `app.qlubchi.com`).
3. Follow the instructions to update your DNS records in IONOS (usually adding an A record or CNAME).

---

## Option 2: IONOS VPS (Advanced)


This guide assumes you have a **Linux VPS** (Virtual Private Server) with IONOS and **SSH access**.

> [!IMPORTANT]
> If you are on **Shared Hosting** (Standard Web Hosting), you cannot run this Python application directly. You will need to upgrade to a VPS or use a different host (like Render, Heroku, or DigitalOcean) and point your domain there.

## 1. Access your Server
Connect to your server via SSH:
```bash
ssh root@your-server-ip
```

## 2. Install Dependencies
Update your system and install Python, Pip, and Git:
```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv git nginx
```

## 3. Setup the Application
Clone your code or copy the files to `/var/www/qlub`.
```bash
mkdir -p /var/www/qlub
# Copy files here...
cd /var/www/qlub
```

Create a virtual environment and install requirements:
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 4. Run with Gunicorn
Test the application with Gunicorn:
```bash
gunicorn --bind 0.0.0.0:8000 app:app
```
Visit `http://your-server-ip:8000` to verify it works.

## 5. Configure Nginx (Reverse Proxy)
Create a new Nginx config:
```bash
sudo nano /etc/nginx/sites-available/qlub
```

Add the following content:
```nginx
server {
    listen 80;
    server_name www.qlubchi.com qlubchi.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable the site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/qlub /etc/nginx/sites-enabled
sudo systemctl restart nginx
```

## 6. Setup Systemd Service (Keep it running)
Create a service file:
```bash
sudo nano /etc/systemd/system/qlub.service
```

Content:
```ini
[Unit]
Description=Gunicorn instance to serve Qlub
After=network.target

[Service]
User=root
Group=www-data
WorkingDirectory=/var/www/qlub
Environment="PATH=/var/www/qlub/venv/bin"
ExecStart=/var/www/qlub/venv/bin/gunicorn --workers 3 --bind unix:qlub.sock -m 007 app:app

[Install]
WantedBy=multi-user.target
```

Start the service:
```bash
sudo systemctl start qlub
sudo systemctl enable qlub
```

## 7. SSL (HTTPS)
Install Certbot and get a certificate:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d qlubchi.com -d www.qlubchi.com
```
