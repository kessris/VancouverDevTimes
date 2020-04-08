CREATE TABLE Company (
    companyName varchar(30),
    PRIMARY KEY (companyName)
);

CREATE TABLE Category (
    categoryName varchar(30),
    PRIMARY KEY (categoryName)
);

CREATE TABLE ContentType (
    resourceType varchar(10),
    PRIMARY KEY (resourceType)
);

-- submissionTime is used to order the submissions on 'Review Submissions' pop-up page
-- approvalTime is used to order the blog posts on main page
    -- this will be updated upon each approval
-- approvalCount keeps track of how many approvals it has so far
CREATE TABLE ContentResource (
    resourceType varchar(10),
    approvalThreshold int,
    url varchar(500),
    submissionTime DATETIME,
    approvedTime DATETIME,
    approvalCount int,
    title varchar(500) UNIQUE,
    categoryName varchar(30),
    PRIMARY KEY (url),
    FOREIGN KEY (categoryName) references Category(categoryName),
    FOREIGN KEY (resourceType) references ContentType(resourceType)
);

CREATE TABLE APP_USER (
    EMAIL varchar(40),
    USER_NAME varchar(30),
    SUBSCRIBED BOOL,
    PRIMARY KEY (EMAIL)
);

-- approvalThreshold is set based on which user submitted the request
    -- e.g. approvalCount/approvalThreshold    =>    1/4
CREATE TABLE PERMISSION (
    TYPE varchar(20),
    THRESHOLD int,
    PRIMARY KEY (TYPE)
);

-- taskId: approval reminder/subscription email/RSS retrieval
-- note: currently all values are set to 7, makes life easier since
-- we do not plan on changing subscription email frequency
CREATE TABLE SCHEDULER (
    ID varchar(20),
    FREQUENCY int CHECK (frequency <= 7 && frequency > 0),
    START_TIME DATE,
    MAX_NUM int CHECK (maxNum > 0),
    PRIMARY KEY (ID)
);

CREATE TABLE EMAILER (
    TYPE varchar(20),
    TEMPLATE varchar(5000),
    ID varchar(20),
    PRIMARY KEY (TYPE, ID),
    FOREIGN KEY (ID) references SCHEDULER(ID)
);

CREATE TABLE USER_COMPANY (
    EMAIL varchar(40),
    companyName varchar(30),
    PRIMARY KEY (EMAIL, companyName),
    FOREIGN KEY (EMAIL) references APP_USER(EMAIL),
    FOREIGN KEY (companyName) references Company(companyName)
);

CREATE TABLE APP_USER_manages (
    url varchar(500),
    EMAIL varchar(40),
    PRIMARY KEY (EMAIL, url),
    FOREIGN KEY (EMAIL) references APP_USER(EMAIL),
    FOREIGN KEY (url) references ContentResource(url)
);

CREATE TABLE APP_USER_handles (
    EMAIL varchar(40),
    categoryName varchar(30),
    PRIMARY KEY (EMAIL, categoryName),
    FOREIGN KEY (EMAIL) references APP_USER(EMAIL),
    FOREIGN KEY (categoryName) references Category(categoryName)
);

CREATE TABLE USER_PERMISSIONS (
    EMAIL varchar(40),
    TYPE varchar(20),
    PRIMARY KEY (EMAIL, TYPE),
    FOREIGN KEY (EMAIL) references APP_USER(EMAIL),
    FOREIGN KEY (TYPE) references PERMISSION(TYPE)
);

CREATE TABLE APP_USER_maintains (
    EMAIL varchar(40),
    ID varchar(20),
    PRIMARY KEY (EMAIL, ID),
    FOREIGN KEY (EMAIL) references APP_USER(EMAIL),
    FOREIGN KEY (ID) references SCHEDULER(ID)
);

CREATE TABLE USER_APPROVALS (
    EMAIL varchar(40),
    url varchar(500),
    PRIMARY KEY (EMAIL, url),
    FOREIGN KEY (EMAIL) references APP_USER(EMAIL),
    FOREIGN KEY (url) references ContentResource(url) ON DELETE CASCADE
);

CREATE TABLE USER_SUBMISSIONS (
    EMAIL varchar(40),
    url varchar(500),
    PRIMARY KEY (EMAIL, url),
    FOREIGN KEY (EMAIL) references APP_USER(EMAIL),
    FOREIGN KEY (url) references ContentResource(url)
);

CREATE TABLE Scheduler_retrieves (
    ID varchar(20),
    url varchar(500),
    PRIMARY KEY (ID, url),
    FOREIGN KEY (ID) references SCHEDULER(ID),
    FOREIGN KEY (url) references ContentResource(url)
);

CREATE TABLE ContentResource_hasType (
    url varchar(500),
    resourceType varchar(4),
    PRIMARY KEY (url, resourceType),
    FOREIGN KEY (url) references ContentResource(url),
    FOREIGN KEY (resourceType) references ContentType(resourceType)
);

commit;
