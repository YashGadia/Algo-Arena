import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
import pytz
import json

def separate_date_and_time(input_date_time):
    # Parse the timestamp and set the timezone to JST (UTC+9)
    timestamp = datetime.strptime(input_date_time, "%Y-%m-%d %H:%M:%S%z")
    timestamp_jst = timestamp.astimezone(pytz.timezone("Asia/Tokyo"))

    # Convert to IST (UTC+5:30)
    timestamp_ist = timestamp_jst.astimezone(pytz.timezone("Asia/Kolkata"))

    # Extract and format date as dd-mm-yyyy
    date_str = timestamp_ist.strftime("%d-%m-%Y")

    # Extract and format time as 12-hour am/pm format
    time_str = timestamp_ist.strftime("%I:%M %p")

    return date_str, time_str

def scrape_atcoder_upcoming_contests():
    url = 'https://atcoder.jp/contests/'
    response = requests.get(url)
    response.raise_for_status()
    
    soup = BeautifulSoup(response.text, 'html.parser')
    upcoming_atcoder_contests = []

    table = soup.select_one("#contest-table-upcoming tbody")
    for row in table.find_all('tr'):
        columns = row.find_all('td')
        
        start_time = columns[0].find('time').get_text()
        # print(start_time)
        contest_name = columns[1].find('a').get_text()
        # date_time = convert_date_time(start_time)

        contest_start_date, contest_start_time = separate_date_and_time(start_time)
        contest_platform = 'Atcoder'

        upcoming_atcoder_contests.append({
            'contestName': contest_name,
            'contestPlatform': contest_platform,
            'contestStartDate': contest_start_date,
            'contestStartTime': contest_start_time
        })
    
    return upcoming_atcoder_contests

if __name__ == "__main__":
    contests = scrape_atcoder_upcoming_contests()
    print(json.dumps(contests))