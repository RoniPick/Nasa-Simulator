import os
import requests
from PIL import Image
from io import BytesIO
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
import base64
import json

"""This class purpose is to scrape data from the website https://theskylive.com/sun-info
and save the data in the following formats:
1. Images - all images with size above 20KB
2. Tables - all tables in the page
3. URLs - URLs in the page which in the following table lists the ephemerides
 of The Sun computed for the past and next 7 days, with a 24 hours interval.
Click on each row of the table to locate The Sun in our Online Planetarium 
at the chosen date. """


# Set up Chrome WebDriver
chrome_driver_path = r'C:\Users\97254\Downloads\chromedriver.exe'
options = webdriver.ChromeOptions()
options.add_argument('--headless')  # Run Chrome in headless mode (without GUI)
driver = webdriver.Chrome(service=Service(chrome_driver_path), options=options)

# Open the website
driver.get('https://theskylive.com/sun-info')

# Create a folder for saving images
os.makedirs('images', exist_ok=True)

# Find and save images with size above 20KB
images = driver.find_elements(By.TAG_NAME, 'img')
for i, image in enumerate(images):
    image_url = image.get_attribute('src')
    if image_url.startswith('data:image'):
        # Handle base64-encoded images
        image_data = base64.b64decode(image_url.split(',')[1])
        image = Image.open(BytesIO(image_data))
    else:
        # Handle regular image URLs
        image_response = requests.get(image_url)
        image = Image.open(BytesIO(image_response.content))

    image_size = len(image.fp.read()) // 1024  # Get image file size in KB
    image.fp.seek(0)  # Reset the file pointer to the beginning

    if image_size >= 20:
        image_name = f'images/image{i + 1}.jpg'
        image = image.convert('RGB')
        image.save(image_name, format='PNG')


########## End of images ##########

import os
import json

# Create a "tables" folder if it doesn't exist
if not os.path.exists("tables"):
    os.makedirs("tables")

# Find all tables on the page
tables = driver.find_elements(By.XPATH, '//table/tbody')


# Iterate over each table
for index, table in enumerate(tables):
    # if the table contain the word "Diameter" so save this table
    if "Diameter" in table.text:
    # Get all rows in the table body

        rows = table.find_elements(By.TAG_NAME, 'tr')

    # Skip the table if it is empty
        if len(rows) == 0:
            continue

    # Save the table data as a list of dictionaries
        table_data = []
        for row in rows:
            cells = row.find_elements(By.TAG_NAME, 'td')
            row_data = [cell.text for cell in cells]
            table_data.append(row_data)

    # Save the table data as a JSON file
        filename = f"tables/table_{index}.json"
        with open(filename, 'w') as file:
            json.dump(table_data, file)


########## End of table ##########

if not os.path.exists("urls"):
    os.makedirs("urls")

elements = driver.find_elements(By.CSS_SELECTOR, '.data.even, .data.odd')

for index, element in enumerate(elements):
    url = str(element.get_attribute('onclick'))
    url = url.replace("document.location.href='", "https://theskylive.com/").replace("'", "")
     # Check if the URL is not None
    if url != "None":
        filename = f"urls/url_{index}.txt"
        with open(filename, 'w') as file:
            file.write(url)


########## End of URLs ##########

driver.quit()
print("Data scraping and saving completed.")





