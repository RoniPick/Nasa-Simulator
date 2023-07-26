# Nasa-Simulator


### Backend

The backend code consists of several services responsible for different tasks:
1. ***ElasticsearchService:*** This service is responsible for sending events to Elasticsearch. It uses the exec function to execute a curl command with the event data and sends it to the Elasticsearch endpoint.

2. ***EventHubConsumerService:*** This service creates a consumer group for the Event Hub, subscribes to events, and processes them. It uses the @azure/event-hubs package to interact with Azure Event Hub. The processed events are then sent to the ElasticsearchService for indexing.

3. ***EventHubProducerService:*** This service generates random events and sends them to the Event Hub. It uses the @azure/event-hubs package to interact with Azure Event Hub.

4. ***RedisService:*** This service retrieves data from Redis, which is used in generating random events with location information. It uses the ioredis package to interact with the Redis server.

5. ***NasaService:*** This file contains the main Express server that serves the frontend and provides a route for retrieving NASA data. It uses the axios package to fetch data from the NASA API.

### Frontend
The frontend application provides the following features:

1. ***Dashboard:*** View the latest astronomical events and future astronomical events from NASA.
2. ***Astronomical Events:*** Search for astronomical events based on various criteria such as bright star, informing factor, and date range.
3. ***NASA Data:*** Explore data about near-earth objects and their close approach details.
4. ***Sun:*** Obtain information about the sun, including its current position and solar activity.
