const fs = require('fs');
const path = require('path');

// Function to read JSON files from a directory
const readJsonFiles = (directoryPath) => {
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
        jsonObjectArray.forEach(pool => {
            if (pool.holders && pool.holders.length > 0) {
                pool.holders.forEach(holder => {
                    if (typeof holder === 'string') {
                        uniqueAddresses.add(holder);
                    }
                });
            }
        });
    });

    return Array.from(uniqueAddresses);
};

// Main function
const main = () => {
    const jsonObjects = readJsonFiles('./');
    const uniqueHolderAddresses = consolidateHolderAddresses(jsonObjects);

    // Write unique holder addresses to a JSON file
    const outputFilePath = './uniqueHolderAddresses.json';
    fs.writeFileSync(outputFilePath, JSON.stringify(uniqueHolderAddresses, null, 2));


    console.log(`Unique holder addresses written to ${outputFilePath}`);
};

main();
