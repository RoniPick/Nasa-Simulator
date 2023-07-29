import os
import requests
from PIL import Image
from io import BytesIO
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
import base64
import json
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager  # Import the new module

# Set up Chrome WebDriver
options = webdriver.ChromeOptions()
options.add_argument('--headless')  # Run Chrome in headless mode (without GUI)
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)  # Use webdriver_manager


# Open the website
driver.get('https://theskylive.com/sun-info')

# Create a folder for saving images
os.makedirs('frontend/images', exist_ok=True)

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
        image_name = f'frontend/images/image{i + 1}.jpg'
        image = image.convert('RGB')
        image.save(image_name, format='PNG')


########## End of images ##########

import os
import json

# Create a "tables" folder if it doesn't exist
if not os.path.exists("frontend/tables"):
    os.makedirs("frontend/tables")

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
        filename = f"frontend/tables/table_{index}.json"
        with open(filename, 'w') as file:
            json.dump(table_data, file)


########## End of table ##########



# Scrape rise, transit, and set times
rise_time_element = driver.find_element(By.CLASS_NAME, 'rise')
transit_time_element = driver.find_element(By.CLASS_NAME, 'transit')
set_time_element = driver.find_element(By.CLASS_NAME, 'set')

# Get the values of rise, transit, and set times
rise_time = rise_time_element.text
transit_time = transit_time_element.text
set_time = set_time_element.text

# Create a file to save the times
with open('frontend/times.txt', 'w') as file:
    file.write(f"Rise: {rise_time}\n")
    file.write(f"Transit: {transit_time}\n")
    file.write(f"Set: {set_time}\n")
driver.quit()
print("Data scraping and saving completed.")