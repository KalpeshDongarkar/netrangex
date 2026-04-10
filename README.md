# Network IP Pool Generator (netrangex)

A professional Node.js package for calculating comprehensive network information from IP addresses and subnet masks. This utility generates detailed IP pool data, validates network parameters, and provides network classification capabilities.

## Features

✨ **Core Features:**
- Calculate network information from IP address and CIDR subnet notation
- Generate usable IP range from network calculations
- Validate IP addresses and subnet masks
- Classify IP addresses as private or public
- Identify network types and IP classes
- Support for all CIDR notation (8-32)
- Comprehensive error handling
- Lightweight with no external dependencies (except prompt-sync for CLI)

## Installation

```bash
npm install netrangex
```

Or add to your project:

```bash
npm install --save netrangex
```

## Requirements

- Node.js >= 12.0.0
- npm or yarn

## Quick Start

```javascript
const { generateIP, isValidIP, isValidSubnet } = require('netrangex');

// Generate network information
const networkInfo = generateIP('192.168.0.1', 24);
console.log(networkInfo);

// Validate inputs
console.log(isValidIP('192.168.0.1'));        // true
console.log(isValidSubnet(24));               // true
```

## API Reference

### `generateIP(ipAddress, subnet)`

Main function that generates comprehensive IP pool and network information.

**Parameters:**
- `ipAddress` (string): IP address in dotted decimal notation (e.g., '192.168.0.1')
- `subnet` (number): CIDR subnet notation (8-32)

**Returns:** 
Object containing network information with the following properties:

```javascript
{
  ip: string,                    // Original IP address
  subnet: number,                // CIDR subnet value
  numberOfIPs: number,           // Usable IP addresses (total - 2)
  networkIP: string,             // Network address
  subnetMask: string,            // Subnet mask in dotted notation
  usableStartIP: string,         // First usable IP address
  usableEndIP: string,           // Last usable IP address
  broadcastIP: string,           // Broadcast address
  rangeArr: array,               // Array of all usable IP addresses
  networkType: object,           // Network classification
  summary: object                // Summary of network information
}
```

**Throws:** 
- `Error` if IP address is invalid
- `Error` if subnet value is outside valid range (8-32)

**Example:**

```javascript
const { generateIP } = require('netrangex');

try {
  const result = generateIP('192.168.0.1', 24);
  console.log(JSON.stringify(result, null, 2));
  
  // Output:
  // {
  //   "ip": "192.168.0.1",
  //   "subnet": 24,
  //   "numberOfIPs": 254,
  //   "networkIP": "192.168.0.0",
  //   "subnetMask": "255.255.255.0",
  //   "usableStartIP": "192.168.0.1",
  //   "usableEndIP": "192.168.0.254",
  //   "broadcastIP": "192.168.0.255",
  //   "rangeArr": ["192.168.0.1", "192.168.0.2", ..., "192.168.0.254"],
  //   "networkType": {
  //     "type": "PRIVATE",
  //     "class": "Class C Private",
  //     "range": "192.168.0.0 - 192.168.255.255"
  //   },
  //   "summary": {
  //     "totalAddresses": 256,
  //     "usableAddresses": 254,
  //     "networkAddress": "192.168.0.0",
  //     "broadcastAddress": "192.168.0.255"
  //   }
  // }
} catch (error) {
  console.error('Error:', error.message);
}
```

---

### `isValidIP(ip)`

Validates if the provided string is a valid IPv4 address.

**Parameters:**
- `ip` (string): IP address to validate

**Returns:** 
`boolean` - true if valid IP address format, false otherwise

**Example:**

```javascript
const { isValidIP } = require('netrangex');

console.log(isValidIP('192.168.0.1'));      // true
console.log(isValidIP('192.168.0.256'));    // false
console.log(isValidIP('999.999.999.999'));  // false
console.log(isValidIP('10.0.0.1'));         // true
console.log(isValidIP('192.168.0'));        // false (incomplete)
console.log(isValidIP('192.168.0.1.1'));    // false (too many octets)
```

---

### `isValidSubnet(subnet)`

Validates if the provided value is a valid CIDR subnet notation.

**Parameters:**
- `subnet` (number): Subnet value to validate

**Returns:** 
`boolean` - true if valid subnet (8-32), false otherwise

**Example:**

```javascript
const { isValidSubnet } = require('netrangex');

console.log(isValidSubnet(24));    // true
console.log(isValidSubnet(16));    // true
console.log(isValidSubnet(8));     // true (minimum)
console.log(isValidSubnet(32));    // true (maximum - single host)
console.log(isValidSubnet(0));     // false (below minimum)
console.log(isValidSubnet(50));    // false (above maximum)
console.log(isValidSubnet(7));     // false (too small)
```

---

### `isPrivateIP(ip)`

Checks if the provided IP address belongs to private/reserved address spaces.

**Parameters:**
- `ip` (string): IP address to check

**Returns:** 
`boolean` - true if private/reserved IP, false if public

**Private Ranges Detected:**
- `10.0.0.0 - 10.255.255.255` (Class A Private)
- `172.16.0.0 - 172.31.255.255` (Class B Private)
- `192.168.0.0 - 192.168.255.255` (Class C Private)
- `127.0.0.0 - 127.255.255.255` (Loopback)
- `169.254.0.0 - 169.254.255.255` (Link-local)

**Example:**

```javascript
const { isPrivateIP } = require('netrangex');

console.log(isPrivateIP('192.168.0.1'));    // true (private)
console.log(isPrivateIP('10.0.0.1'));       // true (private)
console.log(isPrivateIP('172.20.0.1'));     // true (private)
console.log(isPrivateIP('127.0.0.1'));      // true (loopback)
console.log(isPrivateIP('169.254.1.1'));    // true (link-local)
console.log(isPrivateIP('8.8.8.8'));        // false (public)
console.log(isPrivateIP('1.1.1.1'));        // false (public)
console.log(isPrivateIP('208.67.222.123')); // false (public)
```

---

### `getNetworkType(ip)`

Determines the network type and classification of an IP address.

**Parameters:**
- `ip` (string): IP address to classify

**Returns:** 
Object containing network type information:

```javascript
{
  type: string,        // 'PRIVATE' or 'PUBLIC'
  class: string,       // IP class (Class A, B, C, etc.)
  range: string        // Address range description
}
```

**Example:**

```javascript
const { getNetworkType } = require('netrangex');

console.log(getNetworkType('192.168.0.1'));
// Output:
// {
//   type: 'PRIVATE',
//   class: 'Class C Private',
//   range: '192.168.0.0 - 192.168.255.255'
// }

console.log(getNetworkType('10.0.0.1'));
// Output:
// {
//   type: 'PRIVATE',
//   class: 'Class A Private',
//   range: '10.0.0.0 - 10.255.255.255'
// }

console.log(getNetworkType('8.8.8.8'));
// Output:
// {
//   type: 'PUBLIC',
//   class: 'Class A Public',
//   range: 'Internet Routable'
// }

console.log(getNetworkType('224.0.0.1'));
// Output:
// {
//   type: 'PUBLIC',
//   class: 'Class D (Multicast)',
//   range: 'Internet Routable'
// }
```

---

## Usage Examples

### Example 1: Class C Network

```javascript
const { generateIP } = require('netrangex');

const result = generateIP('192.168.1.0', 24);
console.log(`Network: ${result.networkIP}/${result.subnet}`);
console.log(`Subnet Mask: ${result.subnetMask}`);
console.log(`Usable IPs: ${result.numberOfIPs}`);
console.log(`Range: ${result.usableStartIP} - ${result.usableEndIP}`);

// Output:
// Network: 192.168.1.0/24
// Subnet Mask: 255.255.255.0
// Usable IPs: 254
// Range: 192.168.1.1 - 192.168.1.254
```

### Example 2: Larger RFC1918 Network

```javascript
const { generateIP } = require('netrangex');

const result = generateIP('10.0.0.5', 16);
console.log(`Network: ${result.networkIP}/${result.subnet}`);
console.log(`Total IPs: ${result.summary.totalAddresses}`);
console.log(`Usable IPs: ${result.numberOfIPs}`);
console.log(`Broadcast: ${result.broadcastIP}`);

// Output:
// Network: 10.0.0.0/16
// Total IPs: 65536
// Usable IPs: 65534
// Broadcast: 10.255.255.255
```

### Example 3: Single Host (/32)

```javascript
const { generateIP } = require('netrangex');

const result = generateIP('192.168.0.100', 32);
console.log(`Network: ${result.networkIP}/${result.subnet}`);
console.log(`Subnet Mask: ${result.subnetMask}`);
console.log(`Type: ${result.networkType.class}`);

// Output:
// Network: 192.168.0.100/32
// Subnet Mask: 255.255.255.255
// Type: Class C Private
```

### Example 4: Large Enterprise Network

```javascript
const { generateIP } = require('netrangex');

const result = generateIP('172.16.0.1', 12);
console.log(`Network: ${result.networkIP}/${result.subnet}`);
console.log(`Subnet Mask: ${result.subnetMask}`);
console.log(`Usable Hosts: ${result.numberOfIPs.toLocaleString()}`);
console.log(`Range: ${result.usableStartIP} - ${result.usableEndIP}`);

// Output:
// Network: 172.16.0.0/12
// Subnet Mask: 255.240.0.0
// Usable Hosts: 1,048,574
// Range: 172.16.0.1 - 172.31.255.254
```

### Example 5: Error Handling

```javascript
const { generateIP, isValidIP, isValidSubnet } = require('netrangex');

// Check validation before processing
if (!isValidIP('999.999.999.999')) {
  console.log('Invalid IP address format');
}

if (!isValidSubnet(50)) {
  console.log('Subnet must be between 8 and 32');
}

// Or use try-catch with generateIP
try {
  const result = generateIP('192.168.0.1', 50);
} catch (error) {
  console.error('Error:', error.message);
  // Output: Error: Invalid subnet: 50. Expected value between 8 and 32
}

try {
  const result = generateIP('999.0.0.1', 24);
} catch (error) {
  console.error('Error:', error.message);
  // Output: Error: Invalid IP address: 999.0.0.1. Expected format: xxx.xxx.xxx.xxx
}
```

### Example 6: IP Classification

```javascript
const { isPrivateIP, getNetworkType } = require('netrangex');

const testIPs = [
  '192.168.1.1',
  '10.0.0.1',
  '8.8.8.8',
  '127.0.0.1',
  '172.20.0.1'
];

testIPs.forEach(ip => {
  const isPrivate = isPrivateIP(ip);
  const type = getNetworkType(ip);
  console.log(`${ip}: ${isPrivate ? 'Private' : 'Public'} - ${type.class}`);
});

// Output:
// 192.168.1.1: Private - Class C Private
// 10.0.0.1: Private - Class A Private
// 8.8.8.8: Public - Class A Public
// 127.0.0.1: Private - Loopback
// 172.20.0.1: Private - Class B Private
```

---

## Running Examples

Run the included example file to see the package in action:

```bash
npm run example
```

This will execute `example.js` which demonstrates all the main functions with various network configurations.

---

## Common CIDR Subnet Masks

| CIDR | Subnet Mask     | Usable IPs | Class    |
|------|-----------------|-----------|----------|
| /8   | 255.0.0.0       | 16,777,214| Large    |
| /12  | 255.240.0.0     | 1,048,574 | Large    |
| /16  | 255.255.0.0     | 65,534    | Medium   |
| /24  | 255.255.255.0   | 254       | Small    |
| /25  | 255.255.255.128 | 126       | Small    |
| /26  | 255.255.255.192 | 62        | Tiny     |
| /27  | 255.255.255.224 | 30        | Tiny     |
| /28  | 255.255.255.240 | 14        | Tiny     |
| /29  | 255.255.255.248 | 6         | Tiny     |
| /30  | 255.255.255.252 | 2         | Point-to-Point |
| /32  | 255.255.255.255 | 1         | Host     |

---

## Real-World Use Cases

### 1. Network Planning
```javascript
const { generateIP } = require('netrangex');

// Plan a new office network
const officeNetwork = generateIP('192.168.100.0', 24);
console.log(`Available IPs for office: ${officeNetwork.numberOfIPs}`);
```

### 2. IP Address Management
```javascript
const { isPrivateIP } = require('netrangex');

// Filter private vs public IPs from a list
const ips = ['192.168.1.1', '8.8.8.8', '10.0.0.1'];
const privateIPs = ips.filter(ip => isPrivateIP(ip));
```

### 3. Network Validation
```javascript
const { isValidIP, isValidSubnet } = require('netrangex');

// Validate user input before processing
function createNetwork(ip, subnet) {
  if (!isValidIP(ip)) return { error: 'Invalid IP' };
  if (!isValidSubnet(subnet)) return { error: 'Invalid Subnet' };
  // Process network...
}
```

---

## Error Handling

The package provides comprehensive error messages:

```javascript
const { generateIP } = require('netrangex');

// Invalid IP
try {
  generateIP('192.168.0.999', 24);
} catch (e) {
  console.error(e.message);
  // Invalid IP address: 192.168.0.999. Expected format: xxx.xxx.xxx.xxx
}

// Invalid Subnet
try {
  generateIP('192.168.0.1', 33);
} catch (e) {
  console.error(e.message);
  // Invalid subnet: 33. Expected value between 8 and 32
}
```

---

## Performance Considerations

- **IP Range Generation**: For large networks (/8, /9), the package limits range array generation to 100,000 IPs to prevent memory issues
- **Validation**: Uses RegEx patterns for fast IP and subnet validation
- **Memory**: Summary information is provided without storing full IP ranges for very large networks

---

## License

MIT License - See LICENSE file for details

---

## Author

**Kalpesh Dongarkar**
- Email: kalpeshdongarkar67@gmail.com
- GitHub: [KalpeshDongarkar](https://github.com/KalpeshDongarkar)

---

## Repository

- GitHub: [netrangex](https://github.com/KalpeshDongarkar/netrangex)
- Bug Reports: [Issues](https://github.com/KalpeshDongarkar/netrangex/issues)

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## Related Resources

- [CIDR Notation](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing)
- [IPv4 Address Classes](https://en.wikipedia.org/wiki/Classful_network)
- [Private IP Addresses (RFC 1918)](https://tools.ietf.org/html/rfc1918)
- [Subnet Calculator](https://www.subnet-calculator.com/)

---

## Changelog

### Version 1.0.0
- Initial release
- Core IP pool generation functionality
- IP validation
- Network type classification
- Private IP detection