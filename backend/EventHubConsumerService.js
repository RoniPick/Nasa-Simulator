const { EventHubConsumerClient } = require("@azure/event-hubs");
const { sendEventToElasticSearch } = require("./ElasticsearchService");

/*
Responsibilities: Creating a consumer group for the Event Hub,  subscribing to events and processing them,
Sending processed events to Elasticsearch
*/
async function createConsumerGroup() {
  const connectionString =
    "Endpoint=sb://kafka-nasa-1.servicebus.windows.net/;SharedAccessKeyName=kafka-nasa-policy;SharedAccessKey=FtS1DfsSt89DaQB1NWxWEjwnyxeX8wnka+AEhBRZQi0=;EntityPath=nasa-data-1";
  const eventHubName = "nasa-data-1";
  const consumerGroup = "$Default"; // Replace with your desired consumer group name

  const consumerClient = new EventHubConsumerClient(
    consumerGroup,
    connectionString,
    eventHubName
  );
  console.log("Consumer group created:", consumerGroup);

  // Start receiving events from the event hub and sending them to Elasticsearch
  const subscription = consumerClient.subscribe({
    processEvents: async (events, context) => {
      console.log("Received events:", events.length);
      for (const event of events) {
        console.log("Received event:", event.body);
        await sendEventToElasticSearch(
          event.body,
          context,
          event.offset,
          event.sequenceNumber
        );
      }
      if (events.length > 0) {
        console.log(
          "Updating checkpoint:",
          events[events.length - 1].sequenceNumber
        );
        await context.updateCheckpoint(events[events.length - 1]);
      }
    },
    processError: async (error, context) => {
      console.error("Error receiving events:", error);
      context.updateCheckpoint().catch(console.error);
    },
  });

  // Wait for a while to receive events (you can adjust the duration as needed)
  await new Promise((resolve) => setTimeout(resolve, 30000));

  // Stop receiving events and close the consumer client
  await subscription.close();
  await consumerClient.close();
}

module.exports = { createConsumerGroup };
