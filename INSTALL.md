# Instructions on deploying **"Vancouver DEV Times"** on AWS

Pre-reqs: 
1. Have an AWS account and IAM user. You can follow this tutotial provided by AWS https://aws.amazon.com/getting-started/hands-on/set-up-command-line-elastic-beanstalk/ The idea is that we need to set up an admin user and obtain the credentials for executing the following steps.
2. Have EB CLI (Elastic Beanstalk Command Line Interface) installed. EB CLI is what we are using to deploy and monitor our application.
3. Have MySQL server/tools ready for connecting to a remote database instance.

# Steps to set up the application
To begin we navigate to the project folder.
```bash
# Navigate to the root folder
cd cs319
```
1. Using command line, we set up a new EB application for the project by entering the following
```bash
eb init
```
2. You'll be prompted to select a Region for deploying the application in. Select a nearby region.
```bash
Select a default region
1) us-east-1 : US East (N. Virginia)
2) us-west-1 : US West (N. California)
3) us-west-2 : US West (Oregon)
4) eu-west-1 : EU (Ireland)
5) eu-central-1 : EU (Frankfurt)
6) ap-south-1 : Asia Pacific (Mumbai)
7) ap-southeast-1 : Asia Pacific (Singapore)
8) ap-southeast-2 : Asia Pacific (Sydney)
9) ap-northeast-1 : Asia Pacific (Tokyo)
10) ap-northeast-2 : Asia Pacific (Seoul)
11) sa-east-1 : South America (Sao Paulo)
12) cn-north-1 : China (Beijing)
13) us-east-2 : US East (Columbus)
14) ca-central-1 : Canada (Central)
15) eu-west-2 : EU (London)
(default is 3): 3
```
3. Next you will be prompted for user credentials. Use the Access key ID and Secret access key values from the credentials.csv file you obtained when setting up the IAM user. If you are unsure, check the link in the `Pre-reqs` section for how to get a copy.

4. Now select a platform to use. Pick the option for Node.js and press Enter.
```bash
Select a platform.
1) Node.js
2) PHP
3) Python
4) Ruby
5) Tomcat
6) IIS
7) Docker
8) Multi-container Docker
9) GlassFish
10) Go
11) Java
(default is 1): 1
```
5. Depending on your needs, you might want to set up ssh for your application. If so, answer 'y' for the prompt "Do you want to set up SSH for your instances?"
```bash
Do you want to set up SSH for your instances?
(y/n): n
```

# Steps to deploy the application
**Before you start, build the application**
```bash
yarn build
```
This will build all the static resources into `dist` folder for production.
## First-Time Deployement
1. Use the EB CLI to create a setup of AWS Resources necessary to run the application by running the following command
```bash
eb create
```
2. For rest of the prompts, you can select the default option or configure according to your needs.
3. When you see "INFO: Successfully Launched Environment:" the deployment process has completed.
## Subsequent Deployment
1. After committing your changes, run the following command to get the updated application up an running. Use the `--staged` flag if you want to deploy the staged files.
```bash
eb deploy
```
or 
```bash
eb deploy --staged
```
- For futher reference, you can check out the tutorial here https://aws.amazon.com/getting-started/hands-on/deploy-app-command-line-elastic-beanstalk/


# Steps to configure RDS MySQL database
For the following steps, we will be referencing the AWS guide to add database to Elastic Beanstalk https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.managing.db.html.
1. We are using the AWS Management Console to configure the database. To log into the AWS management console,please use your root account or the eb-admin user you created in the Pre-reqs step. The link to the console  has the following format `https://<your-data-region>.console.aws.amazon.com/elasticbeanstalk/`. 
2. Click `Service` in the top navigation menu and select `Elastic Beanstalk` from the dropdown. You will see the application, go into it.
3. Click the `Configuration` tab and scroll all the way down for the `Database` section. Click the `Modify` to configure the RDS instance. You can use the default options specified in the guide. Adding a DB instance takes about 10 minutes. 
4. Following rest of the tutorial to optionally configure inbound/outbound database connection rules according to your needs.

# Steps to populate the database
1. You can pick your favorite MySQL platform to connect to the created RDS instance. One option is to just use the command line. The format of the command to connect would be similar to the following:
```bash
mysql -u admin -p -h <your-database-connection-endpoint>.rds.amazonaws.com
```
2. Create the database `vanDevTimesDB` with the following command:
```bash
CREATE DATABASE vanDevTimesDB CHARACTER SET utf8 COLLATE utf8_general_ci
```
```
Note: `character_set_client` and `default_character_set_name` are `utf8` so that punctuations and symbols (i.e. '-', '...') can be properly displayed. Skipping this step might result in seeing non-sense symbols like 'â€' on the website. You can use `SHOW VARIABLES LIKE 'char%';` to check if you have them set correctly. If not, you can manually set it with a command like `set character_set_client = utf8`
```
3. After database is created, switch to using it with:
```bash
use vanDevTimesDB
```
4. Source the database scripts in your local directories to populate the database. For example if you are inside the directory `~/CS319/database/sql-scripts`, do the following:
```bash
source createTable.sql
```
followed by
```bash
source insertData.sql
```

# Deleting the application and terminate assoicated resources
You can use the following command using command line
```bash
eb terminate --all
```
Or you can also delete the application via AWS Management Console (`https://<your-data-region>.console.aws.amazon.com/elasticbeanstalk/`)
