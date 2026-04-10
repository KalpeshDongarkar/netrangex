/**
 * Usage Examples for Network IP Pool Generator
 */

const { generateIP, isValidIP, isValidSubnet } = require('./index');

console.log('='.repeat(60));
console.log('Network IP Pool Generator - Usage Examples');
console.log('='.repeat(60));

// Example 1: Basic usage with standard Class C network
console.log('\n--- Example 1: Class C Network (192.168.0.0/24) ---');
try {
  const result1 = generateIP('192.168.0.1', 24);
  console.log(JSON.stringify(result1, null, 2));
} catch (error) {
  console.error('Error:', error.message);
}

// Example 2: Smaller subnet with more usable IPs
console.log('\n--- Example 2: Larger Network (10.0.0.0/16) ---');
try {
  const result2 = generateIP('10.0.0.1', 16);
  console.log(JSON.stringify(result2, null, 2));
} catch (error) {
  console.error('Error:', error.message);
}

// Example 3: Single host subnet (/32)
console.log('\n--- Example 3: Single Host (192.168.0.1/32) ---');
try {
  const result3 = generateIP('192.168.0.1', 32);
  console.log(JSON.stringify(result3, null, 2));
} catch (error) {
  console.error('Error:', error.message);
}

// Example 4: Large network (/8)
console.log('\n--- Example 4: Large Network (10.0.0.1/8) ---');
try {
  const result4 = generateIP('10.0.0.1', 8);
  console.log(JSON.stringify(result4, null, 2));
} catch (error) {
  console.error('Error:', error.message);
}

// Example 5: Error handling - Invalid IP
console.log('\n--- Example 5: Invalid IP Address ---');
try {
  const result5 = generateIP('999.999.999.999', 24);
  console.log(JSON.stringify(result5, null, 2));
} catch (error) {
  console.error('Error:', error.message);
}

// Example 6: Error handling - Invalid Subnet
console.log('\n--- Example 6: Invalid Subnet ---');
try {
  const result6 = generateIP('192.168.0.1', 50);
  console.log(JSON.stringify(result6, null, 2));
} catch (error) {
  console.error('Error:', error.message);
}

// Example 7: Validation functions
console.log('\n--- Example 7: Validation Functions ---');
console.log('Is 192.168.0.1 valid?', isValidIP('192.168.0.1'));
console.log('Is 999.999.999.999 valid?', isValidIP('999.999.999.999'));
console.log('Is subnet 24 valid?', isValidSubnet(24));
console.log('Is subnet 50 valid?', isValidSubnet(50));

console.log('\n' + '='.repeat(60));
