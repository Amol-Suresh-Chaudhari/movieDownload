# AllMoviesHub Setup Guide

## MongoDB Authentication Error Fix

The MongoDB authentication error occurs when the database credentials are incorrect or the connection string is malformed. Follow these steps to fix it:

### 1. Check Your MongoDB Atlas Setup

1. **Login to MongoDB Atlas**: Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. **Verify Cluster Status**: Ensure your cluster is running and accessible
3. **Check Database User**: 
   - Go to Database Access
   - Verify your username and password are correct
   - Ensure the user has read/write permissions to your database

### 2. Update Connection String

1. **Get Correct Connection String**:
   - In MongoDB Atlas, click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

2. **Update .env File**:
   ```bash
   # Create .env file in your project root
   cp .env.example .env
   ```

3. **Configure Environment Variables**:
   ```env
   # Replace with your actual MongoDB connection string
   MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/allmovieshub?retryWrites=true&w=majority
   
   # Other required variables
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password_here
   ADMIN_EMAIL=admin@allmovieshub.com
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

### 3. Common MongoDB Issues & Solutions

**Issue: "bad auth : Authentication failed"**
- **Solution**: Double-check username and password in connection string
- **Solution**: Ensure special characters in password are URL-encoded
- **Solution**: Verify database user exists and has proper permissions

**Issue: "Network timeout"**
- **Solution**: Check if your IP address is whitelisted in MongoDB Atlas
- **Solution**: Add `0.0.0.0/0` to allow all IPs (for development only)

**Issue: "Database not found"**
- **Solution**: Ensure database name in connection string matches your actual database

## Email Configuration for Contact Form

### 1. Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Update .env**:
   ```env
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_16_character_app_password
   ADMIN_EMAIL=admin@allmovieshub.com
   ```

### 2. Alternative Email Providers

**Outlook/Hotmail**:
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your_email@outlook.com
EMAIL_PASS=your_password
```

**Custom SMTP**:
```env
EMAIL_HOST=your_smtp_host
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

## Installation & Setup

### 1. Install Dependencies
```bash
npm install nodemailer
```

### 2. Test Database Connection
```bash
npm run dev
```

### 3. Create Admin User
```bash
node scripts/setup-admin.js
```

## Troubleshooting

### MongoDB Connection Issues
1. Check if MongoDB Atlas cluster is paused
2. Verify network access (IP whitelist)
3. Test connection string format
4. Check database user permissions

### Email Issues
1. Verify email credentials
2. Check if less secure apps are enabled (for Gmail)
3. Use app passwords instead of regular passwords
4. Test SMTP settings

### Environment Variables
1. Ensure .env file is in project root
2. Restart development server after changes
3. Check for typos in variable names
4. Verify no spaces around = in .env file

## Security Notes

- Never commit .env file to version control
- Use strong JWT secrets in production
- Enable IP whitelisting for MongoDB in production
- Use app passwords for email authentication
- Regularly rotate API keys and passwords

## Support

If you continue to face issues:
1. Check the application logs
2. Verify all environment variables are set
3. Test individual components (database, email) separately
4. Contact support with specific error messages
