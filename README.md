# Cloudinary Stress Test

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![Python Version](https://img.shields.io/badge/python-%3E%3D3.8-blue)](https://www.python.org/)
[![License](https://img.shields.io/badge/license-ISC-blue)](LICENSE)

A tool to stress test Cloudinary by creating images of various sizes, uploading them, and simulating bandwidth usage through repeated fetches.

## Features

- Generate JPEG images of specified sizes (500KB, 1MB, 2MB, 5MB, 10MB)
- Upload images to Cloudinary
- Fetch uploaded images multiple times to monitor bandwidth usage

## Prerequisites

- Node.js (version 14 or higher)
- Python (version 3.8 or higher)
- Cloudinary account with API credentials

## Installation

1. Clone the repository:

   ```sh
   git clone <repository-url>
   cd cloudinary-stress-test
   ```

2. Install Node.js dependencies:

   ```sh
   npm install
   ```

3. Set up Python virtual environment and install Pillow:

   ```sh
   python -m venv .venv
   .venv\Scripts\activate  # On Windows
   pip install pillow
   ```

4. Configure environment variables:
   Create a `.env` file in the root directory with your Cloudinary credentials:

   ```sh
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

## Usage

### 1. Create Images

Run the Python script to generate images of specific sizes:

```sh
python scripts/image-create.py
```

Enter the desired size when prompted (e.g., "500kb", "1mb").

### 2. Upload Images

Run the Node.js script to upload images to Cloudinary:

```sh
node scripts/upload.js
```

Select which images to upload from the list or choose "all".

### 3. Stress Test Bandwidth

Run the fetch script to simulate usage:

```sh
node scripts/fetch.js
```

Enter how many times to fetch each URL.

## Scripts

- `scripts/image-create.py`: Generates JPEG images of specified file sizes
- `scripts/upload.js`: Uploads selected images to Cloudinary
- `scripts/fetch.js`: Fetches uploaded URLs multiple times to consume bandwidth

## Notes

- Cloudinary free plan has a 10MB file size limit for uploads
- Monitor your Cloudinary dashboard for credit usage during stress testing
- Images are saved in the `images/` directory
- Uploaded URLs are stored in `urls.txt`
