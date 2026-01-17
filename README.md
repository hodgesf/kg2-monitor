# KG2 External Monitor

This repository provides **external, read-only observability** for the KG2
Plover service at `kg2cplover3.rtx.ai`.

## What it does

- Monitors availability every 10 minutes
- Records HTTP status and latency
- Fetches `/logs` **only when the service is down**
- Publishes a quiet status page via GitHub Pages

## What it does NOT do

- Does not modify the KG2 service
- Does not push data from the instance
- Does not expose secrets
- Does not provide internal stack traces

## Security model

- GitHub Actions only performs GET requests
- The instance has no credentials
- All data is observational
- No bidirectional trust

## Status page

Available at:

