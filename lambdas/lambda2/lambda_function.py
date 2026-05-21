import requests
import os
import json

API_KEY = os.environ.get("API_KEY")

def lambda_handler(event, context):
  if API_KEY == None or API_KEY == "CHANGE_ME":
    return {
        'statusCode': 400,
        'body': json.dumps('API Key not set!')
    }
  else:
    return get_Req()

def get_Req():
  headers = {
  'Authorization': os.environ.get("API_KEY")
}
  response = requests.get(
    'https://api.currentsapi.services/v1/latest-news',
    headers=headers
  )
  return {
    'statusCode': 200,
    'body': json.dumps(response.json())
  }

