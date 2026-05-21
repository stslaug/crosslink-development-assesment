# Crosslink Junior API Developer Assesment - Sean Slaughter
### 1. Overview
#### **Assessment Task: Build an AWS API Gateway with Cognito Authentication**
#### **Objective:**
To assess the candidate's ability to design and implement an AWS API Gateway that uses Cognito for authentication and connects to two Lambda functions. Each Lambda function will call an external service of the candidate's choice. The candidate must use CloudFormation scripts to provide the necessary infrastructure and clear documentation.


#### **General Requirements Identified:**
Quick information that stood out to me (The original repo's README was referenced during the process as well)

1. **Stay within AWS Free Tier Services**
	- Cognito
		- User Pools
		- SPA App Client
	- CloudFormation
	- 2 Lamda Instances
		- TypeScript
		- Python
	- API Gateway

2. **Production level code**
	- Descriptive Comments
	- Secure
	- Best Practices for CloudFormation and lambda scripts.

3. **Time Scale** 5/19/2026 - 5/22/2026

4. **I need two APIs, at least one with Authentication**
	- "At least one of the external services must require **authentication** (e.g., an API key). 


5. **Documentation** - (Located in README)
	- Explains the solution 
	- Explains step by step deployment steps 
	- Test Cases and Usecase Descriptions
	- Includes API endpoint testing instructions (e.g., sample requests and expected responses)
	- Details external Services
		- Currents
			- Free, with simple / easy to read documentation
			- Is complicated enough I could use Types
		- UrlShortner 
			- Chose this because it takes in user argument, a simple non authenticated post request

#### **Files Structure:**
	```
	/aws-api-gateway-assessment
	├── README.md
	├── cloudformation
	│   ├── main.yaml - Main CloudFormation script
	├── lambdas
	│   ├── lambda1
	│   │   └── index.ts - First Lambda function
	│   ├── lambda2
	│   │   └── lambda_function.py - Second Lambda function
	└── assets
	```

#### **README Structure:**

1. **Overview**
	- Task
	- Objective
	- General Requirements Identified
	- File Structure
	- README Structure
	
2. **Learning Resources**

3. **Deployment Guide**
	- Requirements
	
4. **Test Cases**
	- TypeScript function
	- Python function

---

### 2. Learning Resources

- Resources used during my learning process.
- Prior to this I haven't heard of / used CloudFormation
	- Found CloudFormation Composer. Using this to build main.yml
- My experience with Python is limited. Touched it but limited
  
1. https://youtu.be/Omppm_YUG2g
2. https://youtu.be/_jqwVpO1w6A
3. https://github.com/aws-cloudformation/aws-cloudformation-templates/
4. https://www.youtube.com/watch?v=LI31QxfAgho
	
- I started by creating an API Gateway instance and Lambda instance (without CloudFormation)
	- Got it to call Currents API. Just to remind me about linking, environment variables, manipulating data

---	
	
### 3. Deployment Guide

#### Requirements

1. AWS Free Tier

2.  Currents API Key [https://currentsapi.services]

3. CloudFormation main.yml
		

#### Steps:
	
1. Go to AWS CloudFormation  
	1.1 Grab cloudformation/main.yml and upload as template  
	1.2 Continue through setup, no changes should need to be made, aside from name changed (IAM Roles, Cognito User Pools, and Services all predefined in main.yml)  
	1.3 Create Stack  
2. Navigate to TypeScript Lambda (mine was named techStack1-crosslinkTypeScript-LDxo5sxn9HWB)  
	1.1 Go to **Configuration -> Environment Variables -> Edit**  
	1.2 Add Enviroment Variable `API_KEY` set to currentsapi key. By Default it is set to `CHANGE_ME`  
	
3. Create a user in Cognito for the newly created Cognito Group  
	1.1 Generate an email and password within required specifications (length, special characters, capitals, etc...)  
	1.2 Create an Single Page Application App Client  
	1.3 Once Created click Edit on the App Client  
	1.4 Grant the app client these permissions  
   		1.4.1 `ALLOW_USER_AUTH`  
		1.4.2 `ALLOW_USER_PASSWORD_AUTH`  
		1.4.3 `ALLOW_USER_SRP_AUTH`  
		1.4.4 `ALLOW_ADMIN_USER_PASWORD_AUTH`  

---

### 4. Testing APIs

#### Authorization

- Ensure you have correctly configured your Cognito App Client
- Run this command, replacing all values within '{}' to appropriate values  
	`aws cognito-idp admin-initiate-auth  --user-pool-id {COGNITO_USER_POOL_ID} --client-id {APP_CLIENT_ID} --auth-flow ADMIN_NO_SRP_AUTH --auth-parameters USERNAME={USERNAME},PASSWORD={PASSWORD}`  
	
	- `COGNITO_USER_POOL_ID` is found in **Cognito -> <UserPool> -> Overview**
	- `APP_CLIENT_ID` is found in **Cognito -> App Clients -> <ClientName>**
	- `USERNAME` and `PASSWORD` were set during Cognito Setup.
		- I expect users and passwords to be set already but for this deployment, make sure you have created at least 1 user.

- From now on, include this token as an `Authorization` header in future requests


**NEW_PASSWORD_REQUIRED response**
 If this is a new user, you may need to reset the password indicated below
 ```
	{
		"ChallengeName": "NEW_PASSWORD_REQUIRED",
		"Session": {SESSION},
		"ChallengeParameters": {
			"USER_ID_FOR_SRP": "user",
			"requiredAttributes": "[]",
			"userAttributes": "{}"
		}
	}
 ```
 You can fix this by running  
 `aws cognito-idp respond-to-auth-challenge --challenge-name NEW_PASSWORD_REQUIRED --client-id {CLIENT_ID} --challenge-response USERNAME={USERNAME},NEW_PASSWORD={NEW_PASSWORD} --session {SESSION}`  
 
 This will change the user's password AND return an access token for use.
	

#### TypeScript Function - Currents News API


#### Python Function - User URL Shortner API
