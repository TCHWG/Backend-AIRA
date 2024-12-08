# AIRA - Cloud Computing

<br><br>
<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg" width="420"/>
</p>
<br>




## Overview

Backend and cloud computing are at the core of the AIRA architecture, ensuring seamless communication between applications, AI models, and cloud storage. We use Express.js for API development and Flask for audio processing tasks.

## REST API Documentation
```
https://documenter.getpostman.com/
```

### Backend Environment Setup Guide:

🚀 **Get started with setting up your backend environment**  
[Click here for Backend Setup Guide](https://github.com/TCHWG/cloud-document/blob/main/Backend%20Environment.md)

## Technology Used

### Cloud SQL

<img src="https://symbols.getvecta.com/stencil_4/45_google-cloud-sql.35ca1b4c38.svg" width="50" height="50"/>

Service details:

```YAML
Database Type   : MySQL
Version         : 5.7
vCPUs           : 1
Memory          : 1.7 GB
Storage         : 10 GB
```
---
### App Engine

<img src="https://symbols.getvecta.com/stencil_4/8_google-app-engine.c22bd3c7a9.svg" width="50" height="50"/>

Service details:

```YAML
runtime: nodejs
env: standar
manual_scaling:
    instances: 1
```
---
### Cloud Run

<img src="https://github.com/user-attachments/assets/db54445c-f6e6-4361-8925-761eac10e729" width="50" height="50" />

Service details:

```YAML
Location        : asia-southeast2
Memory          : 512MB
CPU             : 1 vCPU
Min Instances   : 0
Max Instances   : 1
```
---
### Compute Engine

<img src="https://github.com/ryhnfhrza/assets/blob/main/google-compute-engine.svg" width="50" height="50"/>

Service details:

```YAML
Location        : asia-east1
Memory          : 16GB
GPU             : NVIDIA T4
Machine type    : n1-standard-1
```
---
### Cloud Storage

<img src="https://symbols.getvecta.com/stencil_4/47_google-cloud-storage.fee263d33a.svg" width="50" height="50"/>

Service details:

```YAML
Location Type   : Region
Location        : asia-southeast2
Storage Class   : Standard
```
---
## Serverless Architecture
<p align="center" ><img src="https://github.com/ryhnfhrza/assets/blob/main/Untitled%20(6).png" width="1000" height="250"/> </p>

### For Complete Pricing and Service Details:

🔍 **Explore the full documentation and pricing for all cloud services in our repository**  
[Click here for Pricing & Details](https://github.com/TCHWG/cloud-document/blob/main/Cloud%20Requirements.md)

---






