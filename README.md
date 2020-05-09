# Instructions on how to set up the Dev environment for **"Vancouver DEV Times"**

![](src/client/assets/screenshot.jpg)

Note: for deployment setup refer to [INSTALL.md](https://gitlab.com/cpsc319-2019w2/galvanize/byteme/CS319/-/blob/master/INSTALL.md)

### USER GUIDE:

https://www.youtube.com/watch?v=tLHj3VIy0_s&feature=youtu.be

# Checkout Git branch

```bash
# Clone the repository
git clone https://gitlab.com/cpsc319-2019w2/galvanize/byteme/CS319.git
```

# MySQL Database with Docker

Database for this project is powered by Docker. That means you will need to download Docker and have it up and running.
To start up the database to run in the background:

```bash
# Navigate to the root folder
cd cs319
# Run scripts
docker-compose up
```

This pulls a MySQL image from docker hub and runs it in a container. If you run `docker ps`, you will see the docker container that was created.
Let the database run in the background for the app to run properly.

<br/><br/>
### Side note:

**IMPORTANT:** Note that the changes you make to the database inside the container will persist even after you stop and re-start the container because the volume stores all the data.
If you want to restart the database in its initial state (i.e., you want the db to reflect the changes that you made in the *.sql files), you must run all three lines:

```bash
docker-compose down -v
docker-compose build
docker-compose up
```

We have recorded some useful Docker and MySQL Commands in `./database/README.md` file, which includes the sample commands below:

```bash
# Show the containers that are up and running
docker ps
# Get the container ID or name from the list shown by line above. Run the following to go inside the container
docker exec -it <Container_ID or Container_Name> bash
# Execute MySQL
mysql -u user -p
# Show all MySQL databases
show databases;
```

# Connecting to the MySQL Database on Docker

Make sure the `database.js` file in `.\src\server\db` has the correct block of code uncommented.


*  The block from line 7~26 should be uncommented/used on the dev environment.

*  The block with `host: 'aa1t8lwjs2gks72.c9xdh5kk6anq.us-west-2.rds.amazonaws.com'` should be uncommented/used to connect to the RDS running on AWS (line 28~35). Thus line 7~26 should be commented out and line 28~35 should be uncommented before AWS deployment.

# How to get OAuth working

1. Open `config.js` file inside `./src/server` directory. It should look similar to this:
```
module.exports = {
    'facebookAuth' : {
        'clientID'      : 'your-clientID-here',
        'clientSecret'  : 'your-client-secret-here',
        'callbackURL'     : 'http://localhost:4000/api/auth/facebook/callback',
        'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email'

    },

    'googleAuth' : {
        'clientID'         : 'your-clientID-here',
        'clientSecret'     : 'your-client-secret-here',
        'callbackURL'      : 'http://localhost:4000/auth/google/callback'
    }
};
```
2. Obtain the keys for Google OAuth:

    **Step 1:** Go to the developer console: https://console.developers.google.com/
    
    **Step 2:** Go to 'Credentials' menu at the left
    
    **Step 3:** Click on the ‘Create credentials’ button. Choose ‘Oauth Client Id’.
    
    For application type, choose web application. For 'Authorized JavaScript origins' URI, paste 'http://localhost:3000'.
    For 'Authorized redirect URIs', include 'http://localhost/_oauth/google?close', 'http://localhost:3000/auth/google/callback', 'http://localhost/auth/google/callback', 'https://developers.google.com/ouathplayground'
    
    **Step 4:** Click save. Record/copy the **Client Id** and **Client Secret** and paste it to the googleAuth section of `config.js` file mentioned above.

**Important:** MAKE SURE NOT TO PUSH THIS `config.js` FILE ON GITLAB. THERE'S A CHANCE IT WILL DETECT IT AND DISABLE YOUR ID. IT'S ALSO NOT A GOOD PRACTICE TO DO SO; `clientSecret` SHOULD BE KEPT SECRET FOR YOUR DEVICE ONLY.
<br/><br/>
### Side Note:

Please note that we have confirmed the Facebook OAuth working on our Development environment but not on Production on AWS.
This is due to our production environment not having `https` as mentioned here: [https://developers.facebook.com/docs/facebook-login/security/#https]
Since this requires a SSL Certificate, we got rid of the Facebook OAuth option on our Log In page.
However, it still works on our Dev with `http://localhost` which is an exception from the issue above.

If you would like to see the Facebook OAuth working on your Dev environment, please do the following:

In the file `Login.js` in `./src/client/pages/Login/Login.js`, uncomment the lines written below `// FIXME`. (Line 72~83)

Then please do the following:

*  Obtaining the keys for Facebook OAuth:

    **Step 1:** Go to https://developers.facebook.com/apps/ and select ‘Add a new app.’
    
    **Step 2:** Give your app a name and complete the security question.
    
    **Step 3:** If you see an option to select products, choose ‘Facebook Login.’
    
    **Step 4:** Go to Settings->Basic and under App Domains type ‘localhost’
    
    **Step 5:** Record the AppID and App Secret ID, and paste it in the `config.js` file mentioned previously.


# Install dependencies and start the app

```bash
# Once inside the root directory, install dependencies
npm i
# Start development server (both client and server)
yarn dev (or npm run dev)
```

# Running Automated API tests

```bash
# Following command will concurrently start the back end and run tests
yarn test (or npm run test)
```

# Summary

To run the Front-end, type in the terminal:
- npm i (only if you need to install anything new)
- npm start (inside the './src/client' folder)

To run the Back-end, type in the terminal (Note that you would probably want to run the DB first):
- npm i (only if you need to install anything new)
- npm start (inside the './src/server' folder)

To run both the front-end and the back-end at the same time, type in the terminal:
- yarn dev

To run the Database:
- (in the root folder 'CS319', run the command:) docker-compose up

So all-in-all, to run everything together, I would:
1. First, have the docker container with the DB running by typing 'docker-compose up' in the root folder
2. Run the command 'yarn dev'

