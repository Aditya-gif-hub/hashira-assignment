# Hashira Placements Assignment - Shamir Secret Sharing
Test Case 1 - 3



Test Case 2- -6290016743746469796



## Problem Description
This assignment implements Shamir's Secret Sharing scheme to reconstruct a polynomial and find its constant term (the secret). 

### Key Concepts:
- **n**: Number of roots provided in the JSON
- **k**: Minimum number of roots required to solve for polynomial coefficients
- **k = m + 1** where m is the degree of the polynomial
- Each root is provided as (x, y) where x is the key and y is the value in a specified base

## Algorithm Explanation

### 1. Base Conversion
First, convert all values from their given bases to decimal (BigInt for precision):
- Supports bases 2-36
- Handles both numeric (0-9) and alphabetic (a-z, A-Z) digits

### 2. Lagrange Interpolation
Uses Lagrange interpolation to find the polynomial value at x=0 (which is the secret):

For a polynomial f(x) and points (x₀, y₀), (x₁, y₁), ..., (xₖ₋₁, yₖ₋₁):

f(0) = Σᵢ yᵢ × Lᵢ(0)

where Lᵢ(0) = Π⃗ⱼ≠ᵢ (0 - xⱼ)/(xᵢ - xⱼ) = Π⃗ⱼ≠ᵢ (-xⱼ)/(xᵢ - xⱼ)

### 3. Precision Handling
- Uses BigInt throughout for arbitrary precision arithmetic
- Includes both simple and modular arithmetic versions
- Handles potential overflow issues with large numbers

## Usage

### Prerequisites
- Node.js installed on your system

### Running the Solution
```bash
node shamir_secret_sharing.js
```

## Test Cases

### Test Case 1
```json
{
  "keys": { "n": 4, "k": 3 },
  "1": { "base": "10", "value": "4" },
  "2": { "base": "2", "value": "111" },
  "3": { "base": "10", "value": "12" },
  "6": { "base": "4", "value": "213" }
}
```

**Points after conversion:**
- Point 1: (1, 4)
- Point 2: (2, 7) [111₂ = 7₁₀]
- Point 3: (3, 12)
- Point 6: (6, 39) [213₄ = 39₁₀]

### Test Case 2
Large numbers with various bases (6, 15, 16, 8, 3, 12, 7).

## Expected Output
The program will display:
1. Conversion of each point from its base to decimal
2. Selected points used for interpolation
3. The calculated secret (constant term of the polynomial)

## Manual Verification
For Test Case 1, you can verify by setting up the system of equations:
- f(1) = 4
- f(2) = 7  
- f(3) = 12

And solving for a quadratic polynomial f(x) = ax² + bx + c, where c is the secret.

## Implementation Notes
- Uses JavaScript with BigInt for arbitrary precision
- Includes error handling for edge cases
- Supports both simple and modular arithmetic approaches
- Comprehensive logging for debugging and verification
