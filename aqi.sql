USE freedb_aqi_data;

CREATE TABLE history_aqi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    city VARCHAR(100) NOT NULL,
    AQI INT,
    `PM2.5` DECIMAL(5,1),
    PM10 DECIMAL(5,1),
    NO2 DECIMAL(5,1)
);

select *from history_aqi;

CREATE TABLE subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    subscription_type ENUM('email', 'sms'),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE subscriptions
  ADD UNIQUE(email),
  ADD UNIQUE(phone);

ALTER TABLE subscriptions
  ADD COLUMN city VARCHAR(100) NOT NULL AFTER subscription_type;
  
select * from subscriptions;

CREATE TABLE notifications (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  subscription_id  INT NOT NULL,                 -- FK to subscriptions.id
  channel       ENUM('sms','email') NOT NULL,
  recipient     VARCHAR(255) NOT NULL,
  payload       TEXT NOT NULL,                   -- the message body
  provider_id   VARCHAR(255),                    -- e.g. Twilio Message SID or SendGrid ID
  status        ENUM('queued','sent','delivered','failed') DEFAULT 'queued',
  error_message TEXT,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id)
);

-- All attempted sends, newest first
SELECT
  n.id,
  s.email     AS email_recipient,
  s.phone     AS sms_recipient,
  n.channel,
  n.recipient,
  n.payload,
  n.provider_id,
  n.status,
  n.error_message,
  n.created_at,
  n.updated_at
FROM notifications n
LEFT JOIN subscriptions s
  ON s.id = n.subscription_id
ORDER BY n.created_at DESC;

SELECT id, name, email, phone, subscription_type
FROM subscriptions;

SELECT * 
FROM notifications
ORDER BY created_at DESC
LIMIT 10;
