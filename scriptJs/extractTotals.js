const fs = require('fs');

// Define the target token addresses
const targetTokens = [
    "0x72c232D56542Ba082592DEE7C77b1C6CFA758BCD",
    "0xb27BbeaACA2C00d6258C3118BAB6b5B6975161c8",
    "0xaFF73f55968Ab4b276a26E574c96e09A615b13d6"
];

const fileList = [
    "balances_0x72c232D56542Ba082592DEE7C77b1C6CFA758BCD.json",
    "balances_0xb27BbeaACA2C00d6258C3118BAB6b5B6975161c8.json",
    "balances_0xaFF73f55968Ab4b276a26E574c96e09A615b13d6.json"
];
let totalTokenBalances = {};

// Initialize totalTokenBalances object for target tokens
targetTokens.forEach(token => {
    totalTokenBalances[token] = {};
});

// Function to read and process each JSON file
const processFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, jsonData) => {
            if (err) {
                reject(err);
                return;
            }

            const data = JSON.parse(jsonData);

            data.pools.forEach(pool => {
                const targetToken = pool.targetToken;

                // Only process if the pool's target token is in the predefined list
                if (targetTokens.includes(targetToken)) {
                    pool.holders.forEach(holder => {
                        const holderAddress = holder.holderAddress;
                        const tokenBalance = holder.tokenBalance;

                        if (!totalTokenBalances[targetToken][holderAddress]) {
                            totalTokenBalances[targetToken][holderAddress] = 0;
                        }

                        totalTokenBalances[targetToken][holderAddress] += tokenBalance;
                    });
                }
            });

            resolve();
        });
    });
};

// Process all files in the file list
Promise.all(fileList.map(processFile))
    .then(() => {
        // Write the grand total to output.json
        fs.writeFile('totals.json', JSON.stringify(totalTokenBalances, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error writing output.json:', err);
            } else {
                console.log('Grand total token balances written to totals.json');
            }
        });
    })
    .catch((err) => {
        console.error('Error processing files:', err);
    });