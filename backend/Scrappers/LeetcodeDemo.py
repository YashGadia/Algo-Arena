from bs4 import BeautifulSoup
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager
from datetime import datetime, timedelta
import json

siteUrl = 'https://leetcode.com/contest/'

def openBrowser(url):
    options = webdriver.ChromeOptions()
    options.add_argument('--ignore-certificate-errors')
    options.add_experimental_option('excludeSwitches', ['enable-logging'])
    options.add_argument('--incognito')
    options.add_argument('--headless')
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--window-size=1920,1080')  # Set a specific window size
    options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36')
    
    try:
        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
        driver.get(url)
        return driver
    except Exception as e:
        print("Failed to open browser")
        raise

def closeBrowser(driver):
    driver.close()

def waitForElement(driver, selector, timeout=20):
    try:
        element = WebDriverWait(driver, timeout).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, selector))
        )
        return element
    except TimeoutException:
        print("Timeout waiting for element")
        return None

def getData():
    browser = None
    try:
        browser = openBrowser(siteUrl)
        
        # Wait for initial page load
        waitForElement(browser, 'title')
        
        # Scroll to ensure dynamic content loads
        browser.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(1)
        browser.execute_script("window.scrollTo(0, 0);")
        
        # Wait for the specific container that holds contest information
        contest_container = waitForElement(browser, '.swiper-wrapper')
        if not contest_container:
            print("Could not find contest container")
            return []
            
        # Additional wait to ensure dynamic content loads
        time.sleep(1)
        
        # Get updated page source after content loads
        pageSource = browser.page_source
        soup = BeautifulSoup(pageSource, 'html.parser')
        
        month_to_number = {
            'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05',
            'Jun': '06', 'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10',
            'Nov': '11', 'Dec': '12'
        }

        upcoming_contests = []
        
        # Try multiple possible selectors for contest elements
        contest_elements = (
            soup.select('.swiper-slide .bg-layer-1') or 
            soup.select('.relative.flex.h-full.w-full.flex-col') or
            soup.select('[class*="contest-container"]')
        )
        
        for element in contest_elements:
            try:
                # Try multiple possible selectors for each piece of information
                name_element = (
                    element.select_one('.truncate span') or
                    element.select_one('[class*="contest-title"]') or
                    element.select_one('[class*="title"]')
                )
                
                time_element = (
                    element.select_one('.flex.items-center.text-label-2') or
                    element.select_one('[class*="contest-time"]') or
                    element.select_one('[class*="time"]')
                )
                
                starts_in_element = (
                    element.select_one('.absolute.bottom-0.flex.w-full.items-end.text-white') or
                    element.select_one('[class*="starts-in"]') or
                    element.select_one('[class*="timer"]')
                )
                
                if not all([name_element, time_element, starts_in_element]):
                    continue
                
                name = name_element.get_text(strip=True)
                time_date = time_element.get_text(strip=True)
                starts_in = starts_in_element.get_text(strip=True)
                
                contest_start_date, contest_start_time = get_date_and_time(
                    time_date, starts_in, month_to_number
                )
                
                upcoming_contests.append({
                    "contestName": name,
                    "contestPlatform": "LeetCode",
                    "contestStartDate": contest_start_date,
                    "contestStartTime": contest_start_time
                })
                
            except Exception as e:
                print("Error processing contest element")
                continue
        
        return upcoming_contests

    except TimeoutException:
        print("Timeout waiting for page elements to load")
        return []
    except Exception as e:
        print("Error scraping contests")
        return []
    finally:
        if browser:
            closeBrowser(browser)

# [Previous helper functions remain the same]
def add_duration_to_current_date(input_string):
    parts = input_string.split(' ')

    months = days = hours = minutes = seconds = 0

    for i in range(0, len(parts), 2):
        value = int(parts[i])
        unit = parts[i + 1].lower()

        if 'm' in unit and 'onth' in unit:
            months += value
        elif 'd' in unit:
            days += value
        elif 'h' in unit:
            hours += value
        elif 'm' in unit and 'inute' in unit:
            minutes += value
        elif 's' in unit:
            seconds += value

    current_date = datetime.now()
    month = (current_date.month - 1 + months) % 12 + 1
    year = current_date.year + ((current_date.month - 1 + months) // 12)
    current_date = current_date.replace(year=year, month=month)

    current_date += timedelta(days=days, hours=hours, minutes=minutes, seconds=seconds)

    return current_date.strftime("%a %b %d %Y")

def separate_numbers_and_letters(input_string):
    letters, numbers = '', ''
    
    for char in input_string:
        if char.isdigit():
            numbers += char
        else:
            letters += char
            
    return letters, numbers

def convert_date_in_final_format(formatted_date, month_to_number):
    parts = formatted_date.split(' ')
    day = parts[2]
    month = month_to_number[parts[1]]
    year = parts[3]
    
    return f"{day}-{month}-{year}"

def get_date_and_time(input_time_date, input_starts_in, month_to_number):
    time_date_parts = input_time_date.split(' ')
    contests_start_time = time_date_parts[1] + ' ' + time_date_parts[2]
    
    starts_in_parts = input_starts_in.split(' ')
    unit1, value1 = separate_numbers_and_letters(starts_in_parts[2])
    unit2, value2 = separate_numbers_and_letters(starts_in_parts[3])

    remaining_date = f"{value1} {unit1} {value2} {unit2}"
    formatted_date = add_duration_to_current_date(remaining_date)
    final_date = convert_date_in_final_format(formatted_date, month_to_number)
    
    return final_date, contests_start_time

if __name__ == "__main__":
    contests = getData()
    if contests:
        print(json.dumps(contests))
    else:
        print("No contests found or error occurred")