import requests
from datetime import datetime
import pytz
import json

def separate_date_and_time(input_date_time):
    parts = input_date_time.split(' ')
    date_part = parts[0].replace(',', '')
    time_part = parts[1]
    unit_part = parts[2]

    # Format date and time
    contest_start_date = date_part.replace('/', '-')
    contest_start_time = f"{time_part} {unit_part.upper()}"
    return contest_start_date, contest_start_time

def fetch_codeforces_upcoming_contests():
    try:
        response = requests.get('https://codeforces.com/api/contest.list')
        response.raise_for_status()  # Raise an exception for HTTP errors
        data = response.json()

        upcoming_contests = []

        if data['status'] == 'OK':
            contests = [contest for contest in data['result'] if contest['phase'] == 'BEFORE']

            for contest in contests:
                start_time_seconds = contest['startTimeSeconds'] * 1000
                start_time = datetime.fromtimestamp(start_time_seconds / 1000.0, tz=pytz.utc)
                start_time_ist = start_time.astimezone(pytz.timezone('Asia/Kolkata'))

                formatted_time = start_time_ist.strftime('%d/%m/%Y %I:%M %p')
                contest_start_date, contest_start_time = separate_date_and_time(formatted_time)
                contest_platform = 'Codeforces'
                
                upcoming_contests.append({
                    'contestName': contest['name'],
                    'contestPlatform': contest_platform,
                    'contestStartDate': contest_start_date,
                    'contestStartTime': contest_start_time
                })
        else:
            print('Error fetching contests:', data.get('comment'))

        return upcoming_contests
    except requests.RequestException as e:
        print('Error:', e)
        return []
    except Exception as e:
        print('Unexpected error:', e)
        return []

if __name__ == "__main__":
    contests = fetch_codeforces_upcoming_contests()
    if contests:
        print(json.dumps(contests))
    else:
        print("No contests found or error occurred")
