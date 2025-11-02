# Gunicorn configuration for Render deployment
import os

# Bind to the port that Render provides, or default to 5000 for local development
port = os.environ.get('PORT', 5000)
bind = f"0.0.0.0:{port}"

# Worker configuration
workers = 2
worker_class = "sync"
worker_connections = 1000
timeout = 30
keepalive = 2

# Logging
accesslog = '-'
errorlog = '-'
loglevel = 'info'

# Process naming
proc_name = 'bolt-nexus-backend'