## Work with you own amazon SES server

1. Create SMTP Credentials.csv by following the instructon: https://docs.bitnami.com/bch/how-to/use-ses/
2. Make a SMTPconfig.json file inside src/server/email directory.
3. Paste the following code in the SMTPconfig.json file:
```
{
  "host": "email-smtp.us-west-2.amazonaws.com",
  "port": 465,
  "secure": true,
  "IAMUserName": 'your-IAM-username-here',
  "SmtpUsername": 'your-SMTP-username-here',
  "SmtpPassword": 'your-SMTP-password-here'
} 
```
