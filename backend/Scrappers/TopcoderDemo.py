from bs4 import BeautifulSoup
from datetime import datetime, timedelta
import requests
import json

def add_time_to_date(time_string):
    time_part, period, date_part = time_string.split(' ')
    hours, minutes = map(int, time_part.split(':'))
    day, month, year = map(int, date_part.split('-'))

    if period == 'PM' and hours < 12:
        hours += 12
    elif period == 'AM' and hours == 12:
        hours = 0

    date = datetime(year, month, day, hours, minutes)
    date += timedelta(hours=10, minutes=30)

    formatted_date = date.strftime("%d-%m-%Y")
    formatted_time = date.strftime("%I:%M %p")

    return formatted_date, formatted_time

def extract_date_time(date_time_string, month_to_number):
    parts = date_time_string.split(' ')
    month = month_to_number[parts[0]]
    day = parts[1].replace(',', '')
    year = parts[2]
    start_time = parts[4] + ' ' + parts[5]

    start_date = f"{day}-{month}-{year}"
    time_date = f"{start_time} {start_date}"

    contest_start_date, contest_start_time = add_time_to_date(time_date)
    return contest_start_date, contest_start_time

def scrape_topcoder_events():
    try:
        url = 'https://www.topcoder.com/community/events/?tracks[6VRnpD1QYfm1cXMVh6AFOx]=0'
        response = requests.get(url)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')

        month_to_number = {
            'January': '01', 'February': '02', 'March': '03', 'April': '04',
            'May': '05', 'June': '06', 'July': '07', 'August': '08',
            'September': '09', 'October': '10', 'November': '11', 'December': '12'
        }

        results = []

        container = soup.find('div', class_='_3B-Wgq _29hFfg')
        if not container:
            raise ValueError("No container found with class '_3B-Wgq _29hFfg'.")

        contests = container.find_all('div', class_='_25GCQ2 _2GR8ZB')
        # print(contests)
        for idx, contest in enumerate(contests[:-1], start=1):
            # Select all <p> elements inside the contest div
            p_elements = contest.find_all('p')
            
            if len(p_elements) < 2:
                print(f"Some elements were missing for contest {idx}:")
                print(f"p_elements: {p_elements}")
                continue
            
            # Mimicking nth-of-type using indexing
            date_time_element = p_elements[0]  # First <p> element
            name_element = p_elements[1]       # Second <p> element

            if not date_time_element or not name_element:
                print(f"Some elements were missing for contest {idx}:")
                print(f"date_time_element: {date_time_element}")
                print(f"name_element: {name_element}")
                continue

            start_date_time = date_time_element.get_text(strip=True)
            contest_name = name_element.get_text(strip=True)
            if('-' not in contest_name):
                contest_start_date, contest_start_time = extract_date_time(start_date_time, month_to_number)
                results.append({
                    'contestName': contest_name,
                    'contestPlatform': 'Topcoder',
                    'contestStartDate': contest_start_date,
                    'contestStartTime': contest_start_time
                })

        return results

    except Exception as e:
        print('There was an error')
        print(f"Error: {e}")
        return []


if __name__ == '__main__':
    contests = scrape_topcoder_events()
    print(json.dumps(contests))
