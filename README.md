


# Astronomical Events Portal

The Astronomical Events Portal is a web application designed to provide users with real-time access to a curated collection of astronomical events and data. It serves as a central hub for astronomers, researchers, and space enthusiasts to explore, analyze, and visualize various celestial phenomena.
Users can access the web application through a compatible web browser. They can explore the dashboard, search for specific events, visualize data, and receive real-time updates as they discover the wonders of our universe.

### System Architecture
![Nasa simulator](https://github.com/TalMalchi/Nasa-Simulator/assets/93086649/344ea40a-e4d7-4cec-bbc4-8b145ec99130)




### Backend

The backend code consists of several services responsible for different tasks:
1. ***ElasticsearchService:*** This service is responsible for sending events to Elasticsearch. It uses the exec function to execute a curl command with the event data and sends it to the Elasticsearch endpoint.

2. ***EventHubConsumerService:*** This service creates a consumer group for the Event Hub, subscribes to events, and processes them. It uses the @azure/event-hubs package to interact with Azure Event Hub. The processed events are then sent to the ElasticsearchService for indexing.

3. ***EventHubProducerService:*** This service generates random events and sends them to the Event Hub. It uses the @azure/event-hubs package to interact with Azure Event Hub.

4. ***RedisService:*** This service retrieves data from Redis, which is used in generating random events with location information. It uses the ioredis package to interact with the Redis server.

5. ***NasaService:*** This file contains the main Express server that serves the frontend and provides a route for retrieving NASA data. It uses the axios package to fetch data from the NASA API.

### Frontend
The frontend application provides the following features:

1. ***Dashboard:*** View the latest astronomical events, future astronomical events from NASA, analytics about the astronomical events and data about the sun.
2. ***Astronomical Events:*** Search for astronomical events based on various criteria such as bright star, informing factor, and date range. 
3. ***NASA Data:*** Explore data about near-earth objects and their close approach details.
4. ***Sun:***  Leverages API to obtain detailed information about the Sun, including its current location, sunspots, time of rise and set, as well as fundamental properties such as mass and diameter.


## Video of the Project:


https://github.com/TalMalchi/Nasa-Simulator/assets/93086649/87847312-4818-43e9-9a8d-7569f7fa38ac





