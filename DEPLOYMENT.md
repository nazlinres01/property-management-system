# KiraTakip Deployment Guide

## Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn package manager

## Environment Configuration

### Required Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/kiratakip
PGPORT=5432
PGUSER=username
PGPASSWORD=password
PGDATABASE=kiratakip
PGHOST=localhost

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-here

# Application Configuration
NODE_ENV=production
PORT=5000

# Domain Configuration (for multi-domain support)
REPLIT_DOMAINS=your-domain.com

# External Service Keys (Optional)
OPENAI_API_KEY=your-openai-api-key-here
```

## Database Setup

### PostgreSQL Installation

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### macOS (using Homebrew)
```bash
brew install postgresql
brew services start postgresql
```

#### Windows
Download and install from [PostgreSQL official website](https://www.postgresql.org/download/windows/)

### Database Creation

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE kiratakip;
CREATE USER kiratakip_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE kiratakip TO kiratakip_user;
\q
```

### Database Migration

```bash
# Generate migration files
npm run db:generate

# Run migrations
npm run db:migrate

# Seed initial data (optional)
npm run db:seed
```

## Production Deployment

### Build Application

```bash
# Install dependencies
npm install

# Build frontend
npm run build

# Verify build
npm run preview
```

### Process Management

#### Using PM2

```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start server/index.ts --name kiratakip

# Save PM2 configuration
pm2 save
pm2 startup
```

#### Using systemd (Linux)

Create `/etc/systemd/system/kiratakip.service`:

```ini
[Unit]
Description=KiraTakip Property Management System
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/kiratakip
ExecStart=/usr/bin/node server/index.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Enable and start service:
```bash
sudo systemctl enable kiratakip
sudo systemctl start kiratakip
sudo systemctl status kiratakip
```

## Reverse Proxy Setup

### Nginx Configuration

Create `/etc/nginx/sites-available/kiratakip`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket support
    location /ws {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/kiratakip /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## SSL/TLS Configuration

### Using Let's Encrypt (Certbot)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Docker Deployment

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 5000

# Start application
CMD ["npm", "start"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://kiratakip:password@db:5432/kiratakip
    depends_on:
      - db
    volumes:
      - ./logs:/app/logs

  db:
    image: postgres:14
    environment:
      POSTGRES_DB: kiratakip
      POSTGRES_USER: kiratakip
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app

volumes:
  postgres_data:
```

### Deploy with Docker

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f app

# Scale application
docker-compose up -d --scale app=3
```

## Monitoring

### Health Checks

```bash
# Application health
curl http://localhost:5000/api/health

# Database connection
curl http://localhost:5000/api/db/status
```

### Logging Configuration

```javascript
// Add to server/index.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});
```

## Performance Optimization

### Database Optimization

```sql
-- Add indexes for better performance
CREATE INDEX idx_properties_landlord ON properties(landlord_id);
CREATE INDEX idx_contracts_property ON contracts(property_id);
CREATE INDEX idx_payments_contract ON payments(contract_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_due_date ON payments(due_date);
```

### Caching Strategy

```javascript
// Redis caching (optional)
import redis from 'redis';

const client = redis.createClient({
  host: 'localhost',
  port: 6379
});

// Cache frequently accessed data
app.get('/api/dashboard/stats', async (req, res) => {
  const cached = await client.get('dashboard:stats');
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  const stats = await getDashboardStats();
  await client.setex('dashboard:stats', 300, JSON.stringify(stats));
  res.json(stats);
});
```

## Security Considerations

### Security Headers

```javascript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }
}));
```

### Rate Limiting

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## Backup Strategy

### Database Backup

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/kiratakip"
mkdir -p $BACKUP_DIR

# Create database backup
pg_dump -h localhost -U kiratakip_user kiratakip > $BACKUP_DIR/kiratakip_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/kiratakip_$DATE.sql

# Remove backups older than 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
```

### Automated Backups

```bash
# Add to crontab
0 2 * * * /path/to/backup.sh
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check PostgreSQL service status
   - Verify connection string
   - Check firewall settings

2. **WebSocket Connection Issues**
   - Verify proxy configuration
   - Check for firewall blocking
   - Ensure proper CORS settings

3. **High Memory Usage**
   - Monitor Node.js heap usage
   - Check for memory leaks
   - Optimize database queries

### Debug Mode

```bash
# Start with debug logging
DEBUG=* npm start

# Or specific debug categories
DEBUG=express:*,socket.io:* npm start
```

## Scaling Considerations

### Horizontal Scaling

- Use load balancer (nginx, HAProxy)
- Session store (Redis, PostgreSQL)
- Database read replicas
- CDN for static assets

### Vertical Scaling

- Increase server resources
- Optimize database queries
- Enable database connection pooling
- Implement caching layers