const Redis = require('ioredis');
const { EventHubProducerClient, EventHubConsumerClient } = require("@azure/event-hubs");
const { Client } = require('@elastic/elasticsearch');
const axios = require('axios');
const { system } = require('nodemon/lib/config');

async function createConsumerGroup() {
    const connectionString = "Endpoint=sb://kafka-nasa-1.servicebus.windows.net/;SharedAccessKeyName=kafka-nasa-policy;SharedAccessKey=FtS1DfsSt89DaQB1NWxWEjwnyxeX8wnka+AEhBRZQi0=;EntityPath=nasa-data-1";
    const eventHubName = "nasa-data-1";
    const consumerGroup = "$Default"; // Replace with your desired consumer group name

    const consumerClient = new EventHubConsumerClient(consumerGroup, connectionString, eventHubName);
    console.log("Consumer group created:", consumerGroup);

    // Start receiving events from the event hub
    const subscription = consumerClient.subscribe({
        processEvents: async (events, context) => {
            console.log("Receivedd eventss: ", events.length);
            for (const event of events) {
                console.log("Received event:", event.body);
                await sendEventToElasticSearch(event.body, context, event.offset, event.sequenceNumber);
            }
            if (events.length > 0) {
                console.log("Updating checkpoint:", events[events.length - 1].sequenceNumber);
                await context.updateCheckpoint(events[events.length - 1]);
            }

        },
        processError: async (error, context) => {
            console.error("Error receiving events:", error);
            context.updateCheckpoint().catch(console.error);
        }
    });

    // Wait for a while to receive events
    await new Promise(resolve => setTimeout(resolve, 30000));

    // Stop receiving events and close the consumer client
    await subscription.close();
    await consumerClient.close();
}

const { exec } = require('child_process');

async function sendEventToElasticSearch(eventBody, context, offset, sequenceNumber) {
    try {
        const elasticSearchEndpoint = 'https://r1x0rdsre0:anu5034q9c@events-data-1012553474.us-east-1.bonsaisearch.net:443/nasa/_doc';
        const curlCommand = `curl -X POST ${elasticSearchEndpoint} -H "Content-Type: application/json" -d '${JSON.stringify(eventBody)}'`;

        exec(curlCommand, (error, stdout, stderr) => {
            if (error) {
                console.error("Error sending event to ElasticSearch:", error);
                return;
            }
            console.log("Event sent to ElasticSearch");
            console.log("Response:", stdout);
            context.updateCheckpoint({ offset, sequenceNumber }).catch(console.error);
        });
    } catch (error) {
        console.log("Error sending event to ElasticSearch:", error);
    }
    
}



async function Simulator() {
    const connectionString = "Endpoint=sb://kafka-nasa-1.servicebus.windows.net/;SharedAccessKeyName=kafka-nasa-policy;SharedAccessKey=FtS1DfsSt89DaQB1NWxWEjwnyxeX8wnka+AEhBRZQi0=;EntityPath=nasa-data-1";
    const eventHubName = "nasa-data-1";
    const eventHubProducerClient = new EventHubProducerClient(connectionString, eventHubName);
    console.log("Created event hub producer client");

    const redis = new Redis("redis://default:6603de326e414020a35aee64c592604a@engaging-flamingo-37264.upstash.io:37264");

    function dataRedis(callback) {
        redis.get('BSC', function (error, result) {
            if (error) {
                console.log(error);
                throw error;
            } else {
                const jsonData = JSON.parse(result);
                const randomIndex = Math.floor(Math.random() * jsonData.length);
                const randomItem = jsonData[randomIndex];
                const randomRA = randomItem.RA;
                const randomDEC = randomItem.DEC;
                callback(randomRA, randomDEC);
            }
            redis.quit();
        });
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    const informingFactors = [
        'MMT',
        'Gemini Observatory Telescopes',
        'Very Large Telescope',
        'Subaru Telescope',
        'Large Binocular Telescope',
        'Southern African Large Telescope',
        'Keck 1 and 2',
        'Hobby-Eberly Telescope',
        'Gran Telescopio Canarias',
        'The Giant Magellan Telescope',
        'Thirty Meter Telescope',
        'European Extremely Large Telescope'
    ];

    const eventTypes = ['GRB', 'Apparent Brightness Rise', 'UV Rise', 'X-Ray Rise', 'Comet'];

    const utc = new Date().toISOString();
    const informingFactor = getRandomElement(informingFactors);
    const eventType = getRandomElement(eventTypes);
    const severityLevel = getRandomInt(1, 5);

    dataRedis((locationRA, locationDEC) => {
        console.log('UTC:', utc);
        console.log('Informing Factor:', informingFactor);
        console.log('Location (RA):', locationRA);
        console.log('Location (DEC):', locationDEC);
        console.log('Event Type:', eventType);
        console.log('Severity Level:', severityLevel);

        const event = {
            utc: utc,
            informingFactor: informingFactor,
            location: {
                RA: locationRA,
                DEC: locationDEC
            },
            eventType: eventType,
            severityLevel: severityLevel
        };

        sendEvent(event);
    });

    async function sendEvent(eventBody) {
        try {
            const eventData = { body: eventBody };
            console.log("Sending event:", eventData);
            const batch = await eventHubProducerClient.createBatch();
            batch.tryAdd(eventData);
            await eventHubProducerClient.sendBatch(batch);
        } catch (error) {
            console.log("Error sending event to Event Hub", error);
        }
    }

    redis.on('error', (error) => {
        console.error('Redis error:', error);
    });

    // Create the consumer group and start receiving events
    await createConsumerGroup();
}
for (let i = 0; i < 5; i++) {

Simulator().catch((error) => {
    console.log("Error in the simulator:", error);
});
}
