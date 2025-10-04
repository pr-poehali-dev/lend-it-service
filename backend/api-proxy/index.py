import json
import urllib.request
import urllib.error
from typing import Dict, Any

SPRING_BOOT_URL = "http://localhost:8080"

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Proxy requests to Spring Boot API
    Args: event with httpMethod, body, queryStringParameters, pathParams
          context with request_id
    Returns: HTTP response from Spring Boot
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Sharer-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    path = event.get('queryStringParameters', {}).get('path', '/users')
    spring_url = f"{SPRING_BOOT_URL}{path}"
    
    query_params = event.get('queryStringParameters', {})
    if 'path' in query_params:
        del query_params['path']
    
    if query_params:
        query_string = '&'.join([f"{k}={v}" for k, v in query_params.items()])
        spring_url += f"?{query_string}"
    
    headers = {
        'Content-Type': 'application/json'
    }
    
    user_id_header = event.get('headers', {}).get('x-sharer-user-id')
    if user_id_header:
        headers['X-Sharer-User-Id'] = user_id_header
    
    request_body = event.get('body', '')
    if request_body and isinstance(request_body, str):
        request_body = request_body.encode('utf-8')
    elif not request_body:
        request_body = None
    
    try:
        req = urllib.request.Request(
            spring_url,
            data=request_body,
            headers=headers,
            method=method
        )
        
        with urllib.request.urlopen(req, timeout=30) as response:
            response_body = response.read().decode('utf-8')
            
            return {
                'statusCode': response.status,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': response_body,
                'isBase64Encoded': False
            }
    
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8') if e.fp else str(e)
        return {
            'statusCode': e.code,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': error_body,
            'isBase64Encoded': False
        }
    
    except urllib.error.URLError as e:
        return {
            'statusCode': 503,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Service Unavailable',
                'message': f'Cannot connect to Spring Boot at {SPRING_BOOT_URL}. Make sure it is running.'
            }),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Internal Server Error',
                'message': str(e)
            }),
            'isBase64Encoded': False
        }
