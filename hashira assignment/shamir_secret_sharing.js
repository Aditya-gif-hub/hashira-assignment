const fs = require('fs');

// Function to convert a number from any base to decimal
function baseToDecimal(value, base) {
    let result = 0n;
    const baseNum = BigInt(base);
    
    for (let i = 0; i < value.length; i++) {
        const char = value[i];
        let digit;
        
        if (char >= '0' && char <= '9') {
            digit = BigInt(char.charCodeAt(0) - '0'.charCodeAt(0));
        } else if (char >= 'a' && char <= 'z') {
            digit = BigInt(char.charCodeAt(0) - 'a'.charCodeAt(0) + 10);
        } else if (char >= 'A' && char <= 'Z') {
            digit = BigInt(char.charCodeAt(0) - 'A'.charCodeAt(0) + 10);
        }
        
        result = result * baseNum + digit;
    }
    
    return result;
}

// Lagrange interpolation to find polynomial value at x=0 (the secret)
function lagrangeInterpolation(points) {
    const k = points.length;
    let result = 0n;
    
    for (let i = 0; i < k; i++) {
        const [xi, yi] = points[i];
        let li = yi;
        let numerator = 1n;
        let denominator = 1n;
        
        for (let j = 0; j < k; j++) {
            if (i !== j) {
                const [xj] = points[j];
                numerator = numerator * (0n - xj);  // We want f(0)
                denominator = denominator * (xi - xj);
            }
        }
        
        // Handle division in modular arithmetic
        // For simplicity, we'll use regular division since we're working with the secret
        li = li * numerator / denominator;
        result = result + li;
    }
    
    return result;
}

// Extended Euclidean Algorithm for modular inverse
function extendedGCD(a, b) {
    if (a === 0n) return [b, 0n, 1n];
    
    const [gcd, x1, y1] = extendedGCD(b % a, a);
    const x = y1 - (b / a) * x1;
    const y = x1;
    
    return [gcd, x, y];
}

function modInverse(a, m) {
    const [gcd, x] = extendedGCD(a, m);
    if (gcd !== 1n) throw new Error('Modular inverse does not exist');
    return ((x % m) + m) % m;
}

// Lagrange interpolation with modular arithmetic
function lagrangeInterpolationMod(points, prime = 2n**127n - 1n) {
    const k = points.length;
    let result = 0n;
    
    for (let i = 0; i < k; i++) {
        const [xi, yi] = points[i];
        let numerator = 1n;
        let denominator = 1n;
        
        for (let j = 0; j < k; j++) {
            if (i !== j) {
                const [xj] = points[j];
                numerator = (numerator * ((0n - xj + prime) % prime)) % prime;
                denominator = (denominator * ((xi - xj + prime) % prime)) % prime;
            }
        }
        
        const denInv = modInverse(denominator, prime);
        const li = (yi * numerator % prime * denInv % prime) % prime;
        result = (result + li) % prime;
    }
    
    return result;
}

function solveSecretSharing(jsonData) {
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    const { n, k } = data.keys;
    
    console.log(`n = ${n}, k = ${k}`);
    
    // Extract and convert all points
    const points = [];
    
    for (let i = 1; i <= n; i++) {
        if (data[i.toString()]) {
            const point = data[i.toString()];
            const x = BigInt(i);
            const y = baseToDecimal(point.value, parseInt(point.base));
            points.push([x, y]);
            console.log(`Point ${i}: x=${x}, y=${y} (base ${point.base}: ${point.value})`);
        }
    }
    
    // Use only the first k points for interpolation
    const selectedPoints = points.slice(0, k);
    console.log(`\nUsing first ${k} points for interpolation:`);
    selectedPoints.forEach((point, idx) => {
        console.log(`  Point ${idx + 1}: (${point[0]}, ${point[1]})`);
    });
    
    // Find the secret using Lagrange interpolation
    let secret;
    try {
        // Try simple interpolation first
        secret = lagrangeInterpolation(selectedPoints);
        console.log(`\nSecret (simple): ${secret}`);
    } catch (error) {
        console.log("Simple interpolation failed, trying modular arithmetic...");
        secret = lagrangeInterpolationMod(selectedPoints);
        console.log(`\nSecret (modular): ${secret}`);
    }
    
    return secret;
}

// Test with the provided test cases
const testCase1 = {
    "keys": { "n": 4, "k": 3 },
    "1": { "base": "10", "value": "4" },
    "2": { "base": "2", "value": "111" },
    "3": { "base": "10", "value": "12" },
    "6": { "base": "4", "value": "213" }
};

const testCase2 = {
    "keys": { "n": 10, "k": 7 },
    "1": { "base": "6", "value": "13444211440455345511" },
    "2": { "base": "15", "value": "aed7015a346d635" },
    "3": { "base": "15", "value": "6aeeb69631c227c" },
    "4": { "base": "16", "value": "e1b5e05623d881f" },
    "5": { "base": "8", "value": "316034514573652620673" },
    "6": { "base": "3", "value": "2122212201122002221120200210011020220200" },
    "7": { "base": "3", "value": "20120221122211000100210021102001201112121" },
    "8": { "base": "6", "value": "20220554335330240002224253" },
    "9": { "base": "12", "value": "45153788322a1255483" },
    "10": { "base": "7", "value": "1101613130313526312514143" }
};

console.log("=== Test Case 1 ===");
const secret1 = solveSecretSharing(testCase1);

console.log("\n=== Test Case 2 ===");
const secret2 = solveSecretSharing(testCase2);

console.log("\n=== Final Results ===");
console.log(`Test Case 1 Secret: ${secret1}`);
console.log(`Test Case 2 Secret: ${secret2}`);