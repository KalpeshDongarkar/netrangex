/**
 * IP Pool Generator Module
 * Generates network information from IP address and subnet mask
 */

const IP_REGEX = /^((([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])(\.|$)){3}([1-9]?\d|1\d\d|2[0-4]\d|25[0-5]))$/;
const SUBNET_REGEX = /^(8|9|1[0-9]|2[0-9]|3[0-2])$/;

/**
 * Validates IP address format
 * @param {string} ip - IP address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidIP(ip) {
  return IP_REGEX.test(ip);
}

/**
 * Validates subnet value (8-32)
 * @param {number} subnet - Subnet value to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidSubnet(subnet) {
  return SUBNET_REGEX.test(parseInt(subnet));
}

/**
 * Converts decimal to 8-bit binary string
 * @param {number} decimal - Decimal value
 * @returns {string} - Binary string
 */
function decimalToBinary(decimal) {
  let binary = '';
  let num = decimal;
  let rem, v = 1, step = 1;

  while (step <= 8) {
    rem = num % 2;
    num = num / 2;
    binary = (rem !== Math.floor(rem) ? rem.toString().split('.')[0] : rem.toString()) + binary;
    step++;
  }

  return binary;
}

/**
 * Converts 8-bit binary string to decimal
 * @param {string} binary - Binary string
 * @returns {number} - Decimal value
 */
function binaryToDecimal(binary) {
  return parseInt(binary, 2);
}

/**
 * Calculates subnet mask from CIDR notation
 * @param {number} subnet - CIDR notation (8-32)
 * @returns {string} - Subnet mask IP address
 */
function calculateSubnetMask(subnet) {
  let subnetBits = '';
  for (let i = 0; i < 32; i++) {
    subnetBits += i < subnet ? '1' : '0';
  }

  const parts = subnetBits.match(/.{1,8}/g);
  return parts.map(part => binaryToDecimal(part)).join('.');
}

/**
 * Performs bitwise AND operation on IP and subnet
 * @param {string} ip - IP address
 * @param {string} subnetMask - Subnet mask
 * @returns {string} - Network IP
 */
function getNetworkIP(ip, subnetMask) {
  const ipParts = ip.split('.').map(Number);
  const maskParts = subnetMask.split('.').map(Number);

  return ipParts
    .map((part, i) => part & maskParts[i])
    .join('.');
}

/**
 * Calculates broadcast IP from network IP and subnet mask
 * @param {string} networkIP - Network IP address
 * @param {string} subnetMask - Subnet mask
 * @returns {string} - Broadcast IP
 */
function getBroadcastIP(networkIP, subnetMask) {
  const ipParts = networkIP.split('.').map(Number);
  const maskParts = subnetMask.split('.').map(Number);

  return ipParts
    .map((part, i) => part | (255 - maskParts[i]))
    .join('.');
}

/**
 * Checks if IP address is in private range
 * @param {string} ip - IP address to check
 * @returns {boolean} - True if private, false if public
 */
function isPrivateIP(ip) {
  const parts = ip.split('.').map(Number);
  
  // 10.0.0.0 - 10.255.255.255
  if (parts[0] === 10) return true;
  
  // 172.16.0.0 - 172.31.255.255
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  
  // 192.168.0.0 - 192.168.255.255
  if (parts[0] === 192 && parts[1] === 168) return true;
  
  // 127.0.0.0 - 127.255.255.255 (Loopback)
  if (parts[0] === 127) return true;
  
  // 169.254.0.0 - 169.254.255.255 (Link-local)
  if (parts[0] === 169 && parts[1] === 254) return true;
  
  return false;
}

/**
 * Determines network type
 * @param {string} ip - IP address
 * @returns {object} - Network type details
 */
function getNetworkType(ip) {
  const parts = ip.split('.').map(Number);
  
  if (parts[0] === 10) {
    return { type: 'PRIVATE', class: 'Class A Private', range: '10.0.0.0 - 10.255.255.255' };
  }
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) {
    return { type: 'PRIVATE', class: 'Class B Private', range: '172.16.0.0 - 172.31.255.255' };
  }
  if (parts[0] === 192 && parts[1] === 168) {
    return { type: 'PRIVATE', class: 'Class C Private', range: '192.168.0.0 - 192.168.255.255' };
  }
  if (parts[0] === 127) {
    return { type: 'PRIVATE', class: 'Loopback', range: '127.0.0.0 - 127.255.255.255' };
  }
  if (parts[0] === 169 && parts[1] === 254) {
    return { type: 'PRIVATE', class: 'Link-local', range: '169.254.0.0 - 169.254.255.255' };
  }
  
  // Determine public IP class
  let ipClass = '';
  if (parts[0] >= 1 && parts[0] <= 126) ipClass = 'Class A Public';
  else if (parts[0] >= 128 && parts[0] <= 191) ipClass = 'Class B Public';
  else if (parts[0] >= 192 && parts[0] <= 223) ipClass = 'Class C Public';
  else if (parts[0] >= 224 && parts[0] <= 239) ipClass = 'Class D (Multicast)';
  else if (parts[0] >= 240 && parts[0] <= 255) ipClass = 'Class E (Reserved)';
  
  return { type: 'PUBLIC', class: ipClass, range: 'Internet Routable' };
}

/**
 * Generates IP range usable IPs
 * @param {string} networkIP - Network IP address
 * @param {string} broadcastIP - Broadcast IP address
 * @param {number} numberOfIPs - Total number of IPs in range
 * @returns {array} - Array of usable IP addresses
 */
function generateIPRange(networkIP, broadcastIP, numberOfIPs) {
  const rangeArr = [];

  if (numberOfIPs <= 0) {
    return rangeArr;
  }

  const startParts = networkIP.split('.').map(Number);
  const endParts = broadcastIP.split('.').map(Number);

  // Convert start IP to number
  let startNum = (startParts[0] * 16777216) + (startParts[1] * 65536) + (startParts[2] * 256) + startParts[3];

  // Generate IPs (excluding network and broadcast)
  const count = Math.min(numberOfIPs - 1, 100000); // Safety limit to prevent memory issues

  for (let i = 1; i < count; i++) {
    const ipNum = startNum + i;
    const a = Math.floor(ipNum / 16777216);
    const b = Math.floor((ipNum % 16777216) / 65536);
    const c = Math.floor((ipNum % 65536) / 256);
    const d = ipNum % 256;

    rangeArr.push(`${a}.${b}.${c}.${d}`);
  }

  return rangeArr;
}

/**
 * Main function to generate IP pool information
 * @param {string} ipAddress - IP address (e.g., '192.168.0.1')
 * @param {number} subnet - Subnet mask in CIDR notation (8-32)
 * @returns {object} - IP pool information object
 * @throws {Error} - If IP or subnet are invalid
 */
function generateIP(ipAddress, subnet) {
  // Validate inputs
  if (!isValidIP(ipAddress)) {
    throw new Error(`Invalid IP address: ${ipAddress}. Expected format: xxx.xxx.xxx.xxx`);
  }

  if (!isValidSubnet(subnet)) {
    throw new Error(`Invalid subnet: ${subnet}. Expected value between 8 and 32`);
  }

  const subnetNum = parseInt(subnet);
  const numberOfIPs = Math.pow(2, 32 - subnetNum) - 2;

  // Calculate network details
  const subnetMask = calculateSubnetMask(subnetNum);
  const networkIP = getNetworkIP(ipAddress, subnetMask);
  const broadcastIP = getBroadcastIP(networkIP, subnetMask);

  // Calculate usable start and end IPs
  const networkParts = networkIP.split('.').map(Number);
  const broadcastParts = broadcastIP.split('.').map(Number);

  let usableStartIP, usableEndIP;

  if (numberOfIPs > 0) {
    // Increment network IP by 1 to get usable start
    usableStartIP = networkParts.slice();
    usableStartIP[3]++;
    usableStartIP = usableStartIP.join('.');

    // Decrement broadcast IP by 1 to get usable end
    usableEndIP = broadcastParts.slice();
    usableEndIP[3]--;
    usableEndIP = usableEndIP.join('.');
  } else {
    usableStartIP = networkIP;
    usableEndIP = networkIP;
  }

  // Generate IP range
  const rangeArr = generateIPRange(networkIP, broadcastIP, numberOfIPs);

  // Return formatted response
  return {
    ip: ipAddress,
    subnet: subnetNum,
    numberOfIPs: numberOfIPs,
    networkIP: networkIP,
    subnetMask: subnetMask,
    usableStartIP: usableStartIP,
    usableEndIP: usableEndIP,
    broadcastIP: broadcastIP,
    rangeArr: rangeArr,
    networkType: getNetworkType(ipAddress),
    summary: {
      totalAddresses: Math.pow(2, 32 - subnetNum),
      usableAddresses: numberOfIPs,
      networkAddress: networkIP,
      broadcastAddress: broadcastIP
    }
  };
}

module.exports = {
  generateIP,
  isValidIP,
  isValidSubnet,
  isPrivateIP,
  getNetworkType
};
