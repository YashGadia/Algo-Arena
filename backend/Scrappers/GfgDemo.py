from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
from datetime import datetime
import json

def extract_date_time(date_time_string, month_to_number):
    # "January 28, 202407:00 PM IST"
    parts = date_time_string.split(' ')
    month = month_to_number[parts[0]]
    day = parts[1].replace(',', '')
    year = parts[2][:4]
    contest_start_time = parts[2][4:] + ' ' + parts[3]

    contest_start_date = f"{day}-{month}-{year}"

    return contest_start_date, contest_start_time

def scrape_upcoming_contests():
    month_to_number = {
        'January': '01',
        'February': '02',
        'March': '03',
        'April': '04',
        'May': '05',
        'June': '06',
        'July': '07',
        'August': '08',
        'September': '09',
        'October': '10',
        'November': '11',
        'December': '12',
    }

    upcoming_contests = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto('https://practice.geeksforgeeks.org/events?itm_source=geeksforgeeks&itm_medium=main_header&itm_campaign=contests', wait_until='networkidle')

        content = page.content()
        soup = BeautifulSoup(content, 'html.parser')

        events_container = soup.find('div', class_='eventsLanding_allEventsContainer__e8bYf')
        if events_container:
            event_sections = events_container.find_all('div', id='eventsLanding_eachEventContainer__O5VyK')
            for event in event_sections:
                contest_name_ele = event.find('p', class_='sofia-pro eventsLanding_eventCardTitle__byiHw')
                if contest_name_ele is None:
                    continue
                contest_name = contest_name_ele.get_text(strip=True)
                date_time = event.find('div', class_='eventsLanding_eventDateContainer__Z1zke').get_text(strip=True)

                contest_start_date, contest_start_time = extract_date_time(date_time, month_to_number)
                contest_platform = 'Gfg'

                upcoming_contests.append({
                    'contestName': contest_name,
                    'contestPlatform': contest_platform,
                    'contestStartDate': contest_start_date,
                    'contestStartTime': contest_start_time
                })

        browser.close()

    return upcoming_contests

if __name__ == '__main__':
    contests = scrape_upcoming_contests()
    print(json.dumps(contests))
