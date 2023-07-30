const { EventHubProducerClient } = require("@azure/event-hubs");
const { sendDataToEventHub } = require("./EventHubConsumerService");
const { getDataFromRedis } = require("./RedisService");

/*
Responsibilities: Generating random events and sending them to the Event Hub
*/
async function sendEvent(eventBody) {
  try {
    const connectionString =
      "Endpoint=sb://kafka-nasa-1.servicebus.windows.net/;SharedAccessKeyName=kafka-nasa-policy;SharedAccessKey=FtS1DfsSt89DaQB1NWxWEjwnyxeX8wnka+AEhBRZQi0=;EntityPath=nasa-data-1";
    const eventHubName = "nasa-data-1";
    const eventHubProducerClient = new EventHubProducerClient(
      connectionString,
      eventHubName
    );
    console.log("Created event hub producer client");

    const eventData = { body: eventBody };
    console.log("Sending event:", eventData);
    const batch = await eventHubProducerClient.createBatch(); //allows to group multiple events together before sending them to the Event Hub. Can improve performance and reduce overhead when dealing with a large number of events.
    batch.tryAdd(eventData);
    await eventHubProducerClient.sendBatch(batch);
  } catch (error) {
    console.log("Error sending event to Event Hub", error);
  }
}

function generateRandomEvent() {
  const informingFactors = [
    "MMT",
    "Gemini Observatory Telescopes",
    "Very Large Telescope",
    "Subaru Telescope",
    "Large Binocular Telescope",
    "Southern African Large Telescope",
    "Keck 1 and 2",
    "Hobby-Eberly Telescope",
    "Gran Telescopio Canarias",
    "The Giant Magellan Telescope",
    "Thirty Meter Telescope",
    "European Extremely Large Telescope",
  ];

  const eventTypes = [
    "GRB",
    "Apparent Brightness Rise",
    "UV Rise",
    "X-Ray Rise",
    "Comet",
  ];

  const utc = new Date().toISOString();
  const informingFactor = informingFactors[Math.floor(Math.random() * informingFactors.length)];
  const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
  const severityLevel = Math.floor(Math.random() * 5) + 1;

  getDataFromRedis((locationRA, locationDEC, Title) => {
    console.log("UTC:", utc);
    console.log("Informing Factor:", informingFactor);
    console.log("Location (RA):", locationRA);
    console.log("Location (DEC):", locationDEC);
    console.log("Event Type:", eventType);
    console.log("Severity Level:", severityLevel);
    console.log("Title HD:", Title);

    const event = {
      utc: utc,
      informingFactor: informingFactor,
      location: {
        RA: locationRA,
        DEC: locationDEC,
      },
      eventType: eventType,
      severityLevel: severityLevel,
      Title: Title,
    };

    sendEvent(event);
  });
}

module.exports = { generateRandomEvent };
