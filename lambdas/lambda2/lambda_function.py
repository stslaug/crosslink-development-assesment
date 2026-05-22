import os
import json
import urllib.request
import urllib.parse

def handler(event, context):
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

    # 2. Build the request with the headers
    let fetchUrl="https://api.ip2location.io/?ip=" + ip_to_find +"&format=json";
    
    req = urllib.request.Request(fetchUrl, 
        headers={
            'Content-Type': 'application/json', 
            },
        method='GET',
 
    )
    # 3. Call the post request and read the response
    with urllib.request.urlopen(req) as response:
        raw_body = response.read().decode('utf-8')
        data = json.loads(raw_body)  
    # 4. Return the data
    return {
        "statusCode": 200,
        "body": json.dumps(data)
    }