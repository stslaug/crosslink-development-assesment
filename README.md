# Crosslink Junior API Developer Assesment - Sean Slaughter
### 1. Overview
#### **Assessment Task: Build an AWS API Gateway with Cognito Authentication**
#### **Objective:**
To assess the candidate's ability to design and implement an AWS API Gateway that uses Cognito for authentication and connects to two Lambda functions. Each Lambda function will call an external service of the candidate's choice. The candidate must use CloudFormation scripts to provide the necessary infrastructure and clear documentation.


#### **General Requirements Identified:**
Quick information that stood out to me (The original repo's README was referenced during the process as well)

1. **Stay within AWS Free Tier Services**
	- Cognito
	- CloudFormation
	- 2 Lamda Instances
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

#### *Files Structure:*
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
	
2. ** Learning Resources**

3. **Deployment Guide**
	- Requirements

---

### 2. Learning Resources
	- Resources used during my learning process.
	- Prior to this I haven't heard of / used CloudFormation
		- Found CloudFormation Composer
	- My experience with Python is limited. Touched it but limited
	
	
	1. https://youtu.be/Omppm_YUG2g
	2. https://youtu.be/_jqwVpO1w6A
	3. https://github.com/aws-cloudformation/aws-cloudformation-templates/
	
	

### 3. Deployment Guide**

#### Requirements
	1. AWS Free Tier
	
	2. APIs
		- https://currentsapi.services Currents API Key
		- cleanuri.com (no api key needed with 2 requests a second max)
		



