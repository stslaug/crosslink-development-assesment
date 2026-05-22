# Crosslink Junior API Developer Assesment - Sean Slaughter
### 1. Overview
#### **Assessment Task: Build an AWS API Gateway with Cognito Authentication**
#### **Objective:**
To assess the candidate's ability to design and implement an AWS API Gateway that uses Cognito for authentication and connects to two Lambda functions. Each Lambda function will call an external service of the candidate's choice. The candidate must use CloudFormation scripts to provide the necessary infrastructure and clear documentation.


#### **General Requirements Identified:**
Quick information that stood out to me (The original repo's README was referenced during the process as well).

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
			
6. **Problems I Found along the way**
	- Getting Python to work on AWS Lamdba with importing packages.
		- Had to learn about a requirements.txt file. Then Had to figure out how to work with zip uploads. 

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
	- TypeScript function for Currents
	- Python function for ~~cleanuri.com/docs~~ had to switch since cleanuri seemed to provide links to malware

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
5. https://www.geeksforgeeks.org/devops/create-zip-file-for-aws-lambda-python/
6. https://docs.amazonaws.cn/en_us/AWSCloudFormation/latest/TemplateReference/aws-properties-apigateway-method-integration.html
7. https://stackoverflow.com/questions/28396036/python-3-4-urllib-request-error-http-403
8. https://realpython.com/urllib-request/

- I started by creating an API Gateway instance and Lambda instance (without CloudFormation)
	- Got it to call Currents API. Just to remind me about linking, environment variables, manipulating data
- Had to figure out how to setup Cognito, specifically to interject inbetween my api calls, as an authorizor for tokens.
- Realized I needed to create a user AND an app client for it to function properly. On top of thisI had to find out how to authenticate and retrieve an access token. #4
- I am thinking I will have to deploy from SAM CLI?
-  They key is URLlib. After solving this. things Flowed again.

---	
	
### 3. Deployment Guide

#### Requirements

1. AWS Free Tier

2.  Currents API Key [https://currentsapi.services]

3. CloudFormation main.yml

4. Postman or other tool for Testing / Utilization
		
#### Steps:
	
1. Go to AWS CloudFormation  
	1.1 Grab cloudformation/main.yml and upload as template  
	1.2 When Prompted for Name of Stack, also include your CurrentAPI API key in the also provided Enviornment variable input
	1.4 Create Stack  
	
2. Create a user in Cognito for the newly created Cognito Group  
	1.1 Generate an email and password within required specifications (length, special characters, capitals, etc...)  
	1.2 Create an Single Page Application App Client  
	1.3 Once Created click Edit on the App Client  
	1.4 Grant/Ensure the app client has these permissions  
   		1.4.1 `ALLOW_USER_AUTH`  
		1.4.2 `ALLOW_USER_PASSWORD_AUTH`  
		1.4.3 `ALLOW_USER_SRP_AUTH`  
		1.4.4 `ALLOW_ADMIN_USER_PASWORD_AUTH` 
		1.4.5 `ALLOW_REFRESH_TOKEN_AUTH`  

3. Invoking Lambda functions
	3.1 To Call the Function through an app like postman. To find your invocation link go to  **API Gateway -> <APIName> -> Stages -> <Prod/Stage> -> <Path & Request> (ex. GET /ts) -> Invoke URL  
	3.2 Use a tool like Postman to pass headers and authentication tokens!
	
---

### 4. Testing APIs

#### Authorization

- Ensure you have correctly configured your Cognito App Client
- Run this command with AWS SDK or CloudShell, replacing all values within '{}' to appropriate values  
	`aws cognito-idp admin-initiate-auth  --user-pool-id {COGNITO_USER_POOL_ID} --client-id {APP_CLIENT_ID} --auth-flow ADMIN_NO_SRP_AUTH --auth-parameters USERNAME={USERNAME},PASSWORD={PASSWORD}`  
	
	- `COGNITO_USER_POOL_ID` is found in **Cognito -> <UserPool> -> Overview**
	- `APP_CLIENT_ID` is found in **Cognito -> App Clients -> <ClientName>**
	- `USERNAME` and `PASSWORD` were set during Cognito Setup.
		- I expect users and passwords to be set already but for this deployment, make sure you have created at least 1 user.

- From now on, include `IdToken` as an `Authorization` header in future requests


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
	

### TypeScript Function - Currents News API
To Call the Function find your link in **API Gateway -> <APIName> -> Stages -> <Prod/Stage> -> <Path & Request> (ex. GET /ts) -> Invoke URL Example**  
`https://<node>.execute-api.<location>.amazonaws.com/Prod/ts`

Ensure you have included your Authorization token in the request header!

#### API Endpoints and parameters
GET `/ts` Returns all recent General News from Current API (Current responds with 30 News articles by default, I have moved to 5)

**Headers Available for Manipulation**
`pageSize` : default = 5
	- Changes returned number of news articles
	- Handles numerical characters up to 50
`page` : default = 1
	- Changes which page set to use from response. Auto-paginated from CurrentAPI
	- Handles Numerical Characters up To CurrentAPI's max pages (180)
`keywords` : default = ''
	- Only shows articles with a keyword in it (such as 'technology' or 'sport soccer') This functions like a normal search bar
	- 
`domain` : default = ''
	- Only show articles with a specified url domain such as 
		- 'reuters.com' 
		- 'https://reuters.com'
		- If not in the above form, news responses will be empty. (I Consider this handled, since it would be like searching '1231fsdf' and expecting an article.

	
These can all be used interchangeably, at the same time or any combination with or without.

Example Output
```
{
    "status": "ok",
    "news": [
        {
            "id": "ee88fce2-8f68-574e-b14e-8ece6a6b92c1",
            "title": "Sinner eyes Paris Grand Slam, playoff riches up for grabs at Wembley, and doping takes centre stage in Las Vegas",
            "description": "EMEA Sports Editor Mitch Phillips brings you Inside Track — your essential guide to the weekend in sport.",
            "url": "https://www.reuters.com/sports/inside-track/sinner-eyes-paris-grand-slam-playoff-riches-up-grabs-wembley-doping-takes-centre-2026-05-22/",
            "author": "Mitch Phillips",
            "image": "https://www.reuters.com/resizer/v2/E4SSXPQCXFGDJKQDX5XXAKKYL4.gif?auth=53db5342cbb53fc2b2620c0b596929966c5c5650e8d48d136a6677f015e45a16&height=1005&width=1920&quality=80&smart=true",
            "language": "en",
            "category": [
                "regional",
                "las-vegas"
            ],
            "source_category": [
                "regional",
                "las-vegas"
            ],
            "published": "2026-05-22 13:49:51 +0000"
        }
    ],
    "page": 1
}
```

##### Things Tested

- Characters in number fields 
- Parameter injection (using & or ?)
- Upper and Lower Bound Protections for numeric values
- Set but Empty Headers
- Multi Word Keywords
- Special Domains 
	
#### Python Function - IP Geolocator
Had to pick a new API mid-development.
Switched form a POST cleanuri to a GET ip2location

GET `/py?ip=` returns detailed information on the geolocation of the specific IP

Example Response
```
{"ip":"1.1.1.1","country_code":"US","country_name":"United States of America","region_name":"California","district":"Santa Clara County","city_name":"San Jose","latitude":37.33939,"longitude":-121.89496,"zip_code":"95115","time_zone":"-07:00","asn":"13335","as":"CloudFlare Inc","as_info":{"as_number":"13335","as_name":"CloudFlare Inc","as_domain":"cloudflare.com","as_usage_type":"CDN","as_cidr":"1.1.1.0/24"},"isp":"APNIC and CloudFlare DNS Resolver Project","domain":"cloudflare.com","net_speed":"T1","idd_code":"1","area_code":"408","weather_station_code":"USCA0993","weather_station_name":"San Jose","mcc":"-","mnc":"-","mobile_brand":"-","elevation":24,"usage_type":"CDN","address_type":"Anycast","ads_category":"IAB19-11","ads_category_name":"Data Centers","continent":{"name":"North America","code":"NA","hemisphere":["north","west"],"translation":{"lang":null,"value":null}},"country":{"name":"United States of America","alpha3_code":"USA","numeric_code":840,"demonym":"Americans","flag":"https://cdn.ip2location.io/assets/img/flags/us.png","capital":"Washington, D.C.","total_area":9826675,"population":339665118,"currency":{"code":"USD","name":"United States Dollar","symbol":"$"},"language":{"code":"EN","name":"English"},"tld":"us","translation":{"lang":null,"value":null}},"region":{"name":"California","code":"US-CA","translation":{"lang":null,"value":null}},"city":{"name":"San Jose","translation":{"lang":null,"value":null}},"time_zone_info":{"olson":"America/Los_Angeles","current_time":"2026-05-22T14:16:37-07:00","gmt_offset":-25200,"is_dst":true,"abbreviation":"PDT","dst_start_date":"2026-03-08","dst_end_date":"2026-11-01","sunrise":"05:51","sunset":"20:16"},"geotargeting":{"metro":null},"is_proxy":false,"fraud_score":0,"proxy":{"last_seen":1,"proxy_type":"DCH","threat":"-","provider":"-","is_vpn":false,"is_tor":false,"is_data_center":true,"is_public_proxy":false,"is_web_proxy":false,"is_web_crawler":false,"is_ai_crawler":false,"is_residential_proxy":false,"is_consumer_privacy_network":false,"is_enterprise_private_network":false,"is_spammer":false,"is_scanner":false,"is_botnet":false,"is_bogon":false}}
```


#### Things Tested

- Invalid IPs
- Extra Information (such as `ip=1.1.1.1 test`)
- Alphabetical IPs


