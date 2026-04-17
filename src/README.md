# NestJS Project Installation Guide

This document provides setup instructions for installing all required dependencies for this NestJS application.

## Prerequisites

- Node.js (v16.x or higher recommended)
- npm (v8.x or higher recommended)

## Installation

To install all required dependencies, run the following commands:

```bash
# Install NestJS core dependencies
npm i @nestjs/common @nestjs/core @nestjs/platform-express reflect-metadata rxjs

# Install configuration and environment dependencies
npm i @nestjs/config dotenv

# Install database-related dependencies
npm i @nestjs/typeorm typeorm mysql2 pg

# Install validation and transformation dependencies
npm i class-validator class-transformer @nestjs/mapped-types

# Install authentication and security dependencies
npm i @nestjs/jwt @nestjs/passport passport passport-jwt bcryptjs

# Install API documentation dependencies
npm i @nestjs/swagger@7.4.0

# Install file handling dependencies
npm i multer sharp fluent-ffmpeg

# Install email handling dependencies
npm i @nestjs-modules/mailer nodemailer handlebars

# Install cloud storage dependencies
npm i cloudinary
```

Or you can install all dependencies at once:

```bash
npm i @nestjs-modules/mailer@2.0.2 @nestjs/common@10.0.0 @nestjs/config@3.2.3 @nestjs/core@10.0.0 @nestjs/jwt@10.2.0 @nestjs/mapped-types @nestjs/passport@10.0.3 @nestjs/platform-express@10.4.4 @nestjs/swagger@7.4.0 @nestjs/typeorm@10.0.2 bcryptjs@2.4.3 class-transformer@0.5.1 class-validator@0.14.1 cloudinary@2.6.0 dotenv@16.4.5 fluent-ffmpeg@2.1.3 handlebars@4.7.8 multer@1.4.5-lts.1 mysql2@3.11.2 nodemailer@6.10.0 passport@0.7.0 passport-jwt@4.0.1 pg@8.13.1 reflect-metadata@0.1.14 rxjs@7.8.1 sharp@0.33.5 typeorm@0.3.20
```

## Database Configuration

This project supports both MySQL and PostgreSQL databases through TypeORM. Make sure to configure your database connection in your `.env` file:

```
DB_TYPE=mysql  # or postgres
DB_HOST=localhost
DB_PORT=3306   # or 5432 for postgres
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=your_database
```

## Additional Setup Requirements

### File Upload Setup

For file uploads to work correctly, ensure your environment is properly configured:

- For image processing: `sharp` requires no additional system dependencies.
- For video processing: `fluent-ffmpeg` requires FFmpeg to be installed on your system.

### Email Configuration

To enable email functionality, add the following to your `.env` file:

```
MAIL_HOST=smtp.example.com
MAIL_USER=your_email@example.com
MAIL_PASSWORD=your_email_password
MAIL_FROM=noreply@example.com
```

### Cloudinary Setup

To use Cloudinary for file storage, add the following to your `.env` file:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Running the Application

```bash
# Development mode
npm run start

# Watch mode
npm run start:dev

# Production mode
npm run start:prod
```

## API Documentation

Once the application is running, you can access the Swagger API documentation at:

```
http://localhost:3000/api/docs
```

Make sure to update the port number if your application is running on a different port.
