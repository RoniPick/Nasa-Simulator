
// npm install @azure/event-hubs


function Simulator() {
    const { EventHubProducerClient } = require("@azure/event-hubs");
    const connectionString = "Endpoint=sb://kafka-nasa.servicebus.windows.net/;SharedAccessKeyName=nasa-policy;SharedAccessKey=d4RzTWnoaJHRXgy1fKYXBj6akR2AFz+0u+AEhE9/55I=;EntityPath=kafka-nasa";
    const eventHubName = "kafka-nasa";
    const eventHubProducerClient = new EventHubProducerClient(connectionString, eventHubName);
    async function sendEvent(eventBody) {
        const eventData = { body: eventBody};
        console.log("Sending event: ", eventData);
        const batch = await eventHubProducerClient.createBatch();
        batch.tryAdd(eventData);
        await eventHubProducerClient.sendBatch(batch);
    }


    // Function to generate random integer within a range
    function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Function to select a random element from an array
    function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
    }

    // Array of informing factors
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

    // Array of event types
    const eventTypes = ['GRB', 'Apparent Brightness Rise', 'UV Rise', 'X-Ray Rise', 'Comet'];

    // Generate random values
    const utc = new Date().toISOString();
    const informingFactor = getRandomElement(informingFactors);
    const locationRE = getRandomInt(0, 360);
    const locationDEC = getRandomInt(-90, 90);
    const eventType = getRandomElement(eventTypes);
    const severityLevel = getRandomInt(1, 5);


    // Print the random values to the terminal
    console.log('UTC:', utc);
    console.log('Informing Factor:', informingFactor);
    console.log('Location (RE):', locationRE);
    console.log('Location (DEC):', locationDEC);
    console.log('Event Type:', eventType);
    console.log('Severity Level:', severityLevel);

    // Create a JSON object
    const event = {
    utc: utc,
    informingFactor: informingFactor,
    location: {
        RE: locationRE,
        DEC: locationDEC
    },
    eventType: eventType,
    severityLevel: severityLevel
    };


}

Simulator();