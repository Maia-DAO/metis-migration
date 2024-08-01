const fs = require('fs');
const path = require('path');

// Function to read JSON files from a directory
const readJsonFiles = (directoryPath) => {
    // there are three files here
    const files = fs.readdirSync(directoryPath);
    const jsonFiles = files.filter(file => /^holders.*\.json$/.test(file));
    return jsonFiles.map(file => {
        const data = fs.readFileSync(path.join(directoryPath, file), 'utf8');
        return JSON.parse(data);
    });
};

// Function to consolidate unique holder addresses
const consolidateHolderAddresses = (jsonObjects) => {
    const uniqueAddresses = new Set();

    jsonObjects.forEach(jsonObjectArray => {
        if (Array.isArray(jsonObjectArray)) {
            jsonObjectArray.forEach(pool => {
                if (pool.holders && pool.holders.length > 0) {
                    pool.holders.forEach(holder => {
                        if (typeof holder === 'string') {
                            uniqueAddresses.add(holder);
                        }
                    });
                }
            });
        }
    });

    return Array.from(uniqueAddresses);
};

const outputs = [
    "./uniqueHolderAddresses_0x72c232D56542Ba082592DEE7C77b1C6CFA758BCD.json",
    "./uniqueHolderAddresses_0xb27BbeaACA2C00d6258C3118BAB6b5B6975161c8.json",
    "./uniqueHolderAddresses_0xaFF73f55968Ab4b276a26E574c96e09A615b13d6.json"
]

// Main function
const main = () => {
    const jsonObjects = readJsonFiles('./');

    for (let i = 0; i < 3; i++) {
        const uniqueHolderAddresses = consolidateHolderAddresses([jsonObjects[i]]);

        // Write unique holder addresses to a JSON file
        const outputFilePath = outputs[i];
        if (outputFilePath) {
            fs.writeFileSync(outputFilePath, JSON.stringify(uniqueHolderAddresses, null, 2));
            console.log(`Unique holder addresses written to ${outputFilePath}`);
        }
    }
};

main();
