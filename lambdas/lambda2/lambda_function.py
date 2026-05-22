import os
import json
import urllib.request
import urllib.parse
from urllib.error import HTTPError

def handler(event, context):
    # Grab API Token
    api_key = os.environ.get("API_KEY")
    if api_key is None:
        return {
            "statusCode": 400,
            "body": json.dumps({
                "error": "Missing API_KEY environment variable"
            })
        }
    # 1. Grab the URL to shorten from the query parameters
    query_params = event.get("queryStringParameters") or {}
    ip_to_find = query_params.get('ip')
    if ip_to_find is None: #Test the URL Parameter to see if provided
        return {
            "statusCode": 400,
            "body": json.dumps({
                "error": "Missing IP parameter"
            })
        }
    safe_ip = urllib.parse.quote(ip_to_find)
    # 2. Build the request with the headers
    fetchUrl=f'https://api.ip2location.io/?key={api_key}&ip={safe_ip}'
    req = urllib.request.Request(fetchUrl, 
        headers={
            'Content-Type': 'application/json', 
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            },
        method='GET',
    )
    try:
        # 3. Call the post request and read the response
        with urllib.request.urlopen(req) as response:
            raw_body = response.read().decode('utf-8')
            data = json.loads(raw_body)  
        # 4. Return the data
        return {
            "statusCode": 200,
            "body": json.dumps(data)
        }
    except HTTPError as e:
        raw_error_body = e.read().decode('utf-8')
        return {
            "statusCode": e.code,
            "body": raw_error_body 
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({
                "error": str(e),
            })
        }
