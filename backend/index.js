const { createConsumerGroup } = require("./EventHubConsumerService");
const { generateRandomEvent } = require("./EventHubProducerService");

async function runMicroservices() {
  try {
    // Start the consumer service
    const consumerPromise = createConsumerGroup();

    // Generate a random event every 5 seconds
    setInterval(() => {
      generateRandomEvent();
    }, 5000);

    // Wait for the consumer service to start before generating events
    await consumerPromise;
  } catch (error) {
    console.log("Error running microservices:", error);
  }
}

runMicroservices();
