
Copy template directory into new project directory
remove .git if necessary

- in vscode: CMD + SHIFT + F
- search payment_template 
- replace with new project name

- replace payment_template in the server/.env files and client/.env files
- replace backend PORT number to new value in all .env files
- update PG_DATABASE in all .env files




# Development 
---

## Database setup
psql -U postgres 

CREATE DATABASE payment_db;
ALTER DATABASE payment_db OWNER TO oh;
GRANT ALL PRIVILEGES ON DATABASE payment_db TO oh;

\c payment_db

CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create new users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    stripe_customer_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create new subscriptions table
CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    stripe_subscription_id VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO oh;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO oh;








# Prod
---
- Change VPS_PATH and PM2_SERVICE_NAME in ./deplay/deploy-config.sh
- In server/.env.prod change: FRONTEND_URL, BACKEND_URL, APP_ROUTE, PG_DATABASE, PG_PASSWORD, PORT (pick new port number)
- client/.env.prod change VITE_BACKEND_URL, VITE_APP_ROUTE

## VPS setup
execut in local teminal:
```
cd /Users/oh/Library/CloudStorage/OneDrive-Personal/code/webdev/nginx-config
code .
```

add the following to `./nginx-config/.env`:
```
PAYMENT_ROOT=/var/www/payment_template/client/build
PAYMENT_PORT=5010
```

add the following to `./nginx-config/sites-available/includes/apps/payment_template.conf.template`:
```
location /payment_template {
    alias ${PAYMENT_ROOT};
    try_files $uri $uri/ /payment_template/index.html;

    location ~ ^/payment_template/(api|other_routes) {
        proxy_pass http://localhost:${PAYMENT_PORT}; # Pick new port number
        include /etc/nginx/sites-available/includes/common/proxy_settings.conf;
    }

    location /payment_template/api/health {
        proxy_pass http://localhost:${PAYMENT_PORT}/health;
        include /etc/nginx/sites-available/includes/common/health_check.conf;
    }
}
```

add the following to ./nginx-config/generated-config.sh:
```
# payment_template
envsubst '${PAYMENT_ROOT} ${PAYMENT_PORT}' \
    < sites-available/includes/apps/payment_template.conf.template \
    > sites-available/includes/apps/payment_template.conf
```

run the sync script:
```
./sync.sh
```


## On the VPS
enter psql:
```
sudo su - postgres
psql
```

Create a db:
```
CREATE DATABASE payment_db;
GRANT ALL PRIVILEGES ON DATABASE payment_db TO oh;
```

connect to db:
```
\c payment_db
```
Create a table:
```
CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create new users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    stripe_customer_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create new subscriptions table
CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    stripe_subscription_id VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

Grant all privileges to user oh:
```
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO oh;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO oh;
ALTER USER oh WITH CREATEDB;
```


- on local machine run `./deploy.sh`