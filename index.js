/**
 * Network IP Pool - Main Entry Point
 * A professional npm package to generate IP pool information from IP address and subnet mask
 */

const { generateIP, isValidIP, isValidSubnet, isPrivateIP, getNetworkType } = require('./lib/ipGenerator');

module.exports = {
  generateIP,
  isValidIP,
  isValidSubnet,
  isPrivateIP,
  getNetworkType
};
