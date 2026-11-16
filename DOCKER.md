# 🐳 HandleMyFile — Enterprise On-Premises & Docker Deployment

Deploy **HandleMyFile** inside your company's internal intranet, private cloud, or air-gapped data center with zero internet dependencies.

---

## 🔒 Why Deploy On-Premises?

1. **Air-Gapped Compliance**: Completely functional without WAN/internet connection. All WebAssembly engines and client-side libraries are bundled statically.
2. **Regulatory Standards**: Fully compliant with **GDPR**, **HIPAA**, **ISO 27001**, and **SOC 2** data residency mandates. Zero document bytes leave your employees' browsers.
3. **Unlimited Internal Seats**: Serve thousands of corporate employees on your local network (`http://documents.corp.internal:8080`) without paying per-seat subscriptions.

---

## 🚀 Quick Start (Docker Compose)

The easiest way to run HandleMyFile locally:

```bash
# 1. Clone repository
git clone https://github.com/codesbykhairannoor/checkmyfile.git
cd checkmyfile

# 2. Build and launch container
docker compose up -d

# 3. Access in browser
http://localhost:8080
```

---

## 🛠️ Build and Run Manually (Docker CLI)

```bash
# Build the Docker image
docker build -t handlemyfile:latest .

# Run container on port 8080
docker run -d --name handlemyfile-app -p 8080:80 --restart unless-stopped handlemyfile:latest
```

Verify the container health:
```bash
curl http://localhost:8080/healthz
# Response: healthy
```

---

## 🛡️ Security Architecture in Docker

- **Read-Only / Unprivileged User**: Nginx runs in a hardened Alpine container.
- **Strict Content-Security-Policy (CSP)**: `default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:;` preventing any external telemetry or data egress.
- **WASM MIME Support**: Nginx is configured to serve `.wasm` with `application/wasm` headers for maximum browser JIT execution speed.
