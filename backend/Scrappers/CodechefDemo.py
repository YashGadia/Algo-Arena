import asyncio
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
from playwright.async_api import async_playwright
import json

def format_date_time(starts_in, month_to_number):
    parts = starts_in.split()
    day = parts[0]
    month = month_to_number[parts[1]]
    year = parts[2][:4]
    time_24hr = parts[-1]

    formatted_date = f"{day}-{month}-{year}"
    formatted_time = datetime.strptime(time_24hr, "%H:%M").strftime("%I:%M %p")

    return formatted_date, formatted_time

async def scrape_upcoming_contests():
    month_to_number = {
        'Jan': '01', 'Feb': '02', 'March': '03', 'April': '04',
        'May': '05', 'June': '06', 'July': '07', 'Aug': '08',
        'Sept': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12',
    }

    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto('https://www.codechef.com/contests', wait_until='networkidle')

        content = await page.content()
        soup = BeautifulSoup(content, 'html.parser')

        upcoming_contests = []
        
        # Search dynamically for the upcoming contests section
        table_container = soup.find('div', class_='_table__container_7s2sw_344 _dark_7s2sw_247')
        
        if table_container:
            contests = table_container.find_all('tr', class_='MuiTableRow-root jss50 undefined jss52 jss48 MuiTableRow-hover')

            for contest in contests:
                contest_name = contest.find('td', '_name__cell_7s2sw_508').get_text(strip=True)[4:]
                start_date_time = contest.find('div', class_='_start-date__container_7s2sw_457').get_text(strip=True)
                
                contest_start_date, contest_start_time = format_date_time(start_date_time, month_to_number)
                contest_platform = 'Codechef'
                upcoming_contests.append({
                    'contestName': contest_name,
                    'contestPlatform': contest_platform,
                    'contestStartDate': contest_start_date,
                    'contestStartTime': contest_start_time
                    # **contest_start
                })

        await browser.close()
        return upcoming_contests


async def main():
    contests = await scrape_upcoming_contests()
    print(json.dumps(contests))

if __name__ == '__main__':
    asyncio.run(main())
