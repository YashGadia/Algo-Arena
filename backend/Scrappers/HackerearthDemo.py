from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
import json

def separate_date_and_time(input_date_time, month_to_number):
    parts = input_date_time.split(' ')

    month = month_to_number[parts[0]]
    day = parts[1].replace(',', '').zfill(2)

    if ':' not in parts[2]:
        return "", ""

    current_date = datetime.now()
    year = current_date.year

    # If the event month is before the current month in the calendar, assume it's for the next year
    event_date = datetime.strptime(f"{day}-{month}-{year}", "%d-%m-%Y")
    if event_date < current_date:
        event_date = event_date.replace(year=year + 1)
    
    # Parse time and convert to 24-hour format in UTC
    event_time_utc = datetime.strptime(parts[2] + ' ' + parts[3], "%I:%M %p")
    event_time_utc = event_date.replace(hour=event_time_utc.hour, minute=event_time_utc.minute)

    # Convert UTC to IST
    event_time_ist = event_time_utc + timedelta(hours=5, minutes=30)

    # Format output
    formatted_date = event_time_ist.strftime("%d-%m-%Y")
    formatted_time = event_time_ist.strftime("%I:%M %p")

    return formatted_date, formatted_time

def scrape_hackerearth_upcoming_contests():
    month_to_number = {
        'Jan': '01',
        'Feb': '02',
        'March': '03',
        'April': '04',
        'May': '05',
        'June': '06',
        'July': '07',
        'Aug': '08',
        'Sept': '09',
        'Oct': '10',
        'Nov': '11',
        'Dec': '12',
    }

    upcoming_hackerearth_contests = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto('https://www.hackerearth.com/challenges/', wait_until='networkidle')

        content = page.content()
        soup = BeautifulSoup(content, 'html.parser')

        challenge_list = soup.select('.upcoming.challenge-list .challenge-card-modern .challenge-content')
        
        for element in challenge_list:
            name = element.select_one('.challenge-list-title').get_text(strip=True)
            date_time = element.select_one('.date').get_text(strip=True)

            contest_start_date, contest_start_time = separate_date_and_time(date_time, month_to_number)

            if len(contest_start_date) == 0:
                continue

            upcoming_hackerearth_contests.append({
                'contestName': name,
                'contestPlatform': 'Hackerearth',
                'contestStartDate': contest_start_date,
                'contestStartTime': contest_start_time
            })

        browser.close()

    return upcoming_hackerearth_contests

if __name__ == '__main__':
    contests = scrape_hackerearth_upcoming_contests()
    print(json.dumps(contests))
