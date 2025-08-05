// dataLoader.js
// This script populates the Neo4j database with sample data for testing.
// It first clears the database and then uses the API endpoints to add users and transactions.

import fetch from 'node-fetch';
import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();

const API_BASE_URL = `http://localhost:${process.env.PORT || 8000}/api`;

const sampleUsers = [
  { id: 'user1', name: 'Alice', email: 'alice@example.com', phone: '123-456-7890', address: '123 Maple St', payment: 'cc_1' },
  { id: 'user2', name: 'Bob', email: 'bob@example.com', phone: '234-567-8901', address: '456 Oak Ave', payment: 'cc_2' },
  { id: 'user3', name: 'Charlie', email: 'charlie@example.com', phone: '123-456-7890', address: '789 Pine Ln', payment: 'cc_3' }, // Shared phone with Alice
  { id: 'user4', name: 'Diana', email: 'diana@example.com', phone: '456-789-0123', address: '123 Maple St', payment: 'cc_4' }, // Shared address with Alice
  { id: 'user5', name: 'Eve', email: 'alice@example.com', phone: '567-890-1234', address: '321 Birch Rd', payment: 'cc_5' }, // Shared email with Alice
  { id: 'user6', name: 'Frank', email: 'frank@example.com', phone: '678-901-2345', address: '654 Cedar Blvd', payment: 'cc_1' }, // Shared payment with Alice
  { id: 'user7', name: 'Grace', email: 'grace@example.com', phone: '789-012-3456', address: '987 Spruce Way', payment: 'cc_7' },
];

const sampleTransactions = [
  // Transactions with shared IP and Device IDs
  { id: 'tx1', from_user: 'user1', to_user: 'user2', amount: 100, ip: '192.168.1.1', device_id: 'device_A' },
  { id: 'tx2', from_user: 'user3', to_user: 'user4', amount: 50, ip: '192.168.1.1', device_id: 'device_B' }, // Shared IP with tx1
  { id: 'tx3', from_user: 'user5', to_user: 'user6', amount: 200, ip: '192.168.1.2', device_id: 'device_C' },
  { id: 'tx4', from_user: 'user1', to_user: 'user7', amount: 75, ip: '192.168.1.3', device_id: 'device_C' }, // Shared Device ID with tx3

  // Standard transactions
  { id: 'tx5', from_user: 'user2', to_user: 'user1', amount: 25, ip: '203.0.113.10', device_id: 'device_D' },
  { id: 'tx6', from_user: 'user4', to_user: 'user3', amount: 150, ip: '203.0.113.11', device_id: 'device_E' },
  { id: 'tx7', from_user: 'user6', to_user: 'user5', amount: 300, ip: '203.0.113.12', device_id: 'device_F' },
  { id: 'tx8', from_user: 'user7', to_user: 'user1', amount: 10, ip: '203.0.113.13', device_id: 'device_G' },
  { id: 'tx9', from_user: 'user1', to_user: 'user3', amount: 40, ip: '203.0.113.14', device_id: 'device_H' },
  { id: 'tx10', from_user: 'user2', to_user: 'user4', amount: 60, ip: '203.0.113.15', device_id: 'device_I' },
  { id: 'tx11', from_user: 'user3', to_user: 'user5', amount: 80, ip: '203.0.113.16', device_id: 'device_J' },
  { id: 'tx12', from_user: 'user4', to_user: 'user6', amount: 120, ip: '203.0.113.17', device_id: 'device_K' },
  { id: 'tx13', from_user: 'user5', to_user: 'user7', amount: 180, ip: '203.0.113.18', device_id: 'device_L' },
  { id: 'tx14', from_user: 'user6', to_user: 'user1', amount: 220, ip: '203.0.113.19', device_id: 'device_M' },
  { id: 'tx15', from_user: 'user7', to_user: 'user2', amount: 95, ip: '203.0.113.20', device_id: 'device_N' },
];

/**
 * Clears all nodes and relationships from the Neo4j database.
 */
const clearDatabase = async () => {
  const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD),
    // Configuration object to disable encryption.
    // This is the key to solving the connection error for local development.
    { disableLosslessIntegers: true, encrypted: 'ENCRYPTION_OFF' }
  );
  const session = driver.session();
  try {
    console.log('Clearing the database...');
    await session.run('MATCH (n) DETACH DELETE n');
    console.log('Database cleared successfully.');
  } catch (error) {
    console.error('Error clearing database:', error);
  } finally {
    await session.close();
    await driver.close();
  }
};

/**
 * Posts data to a specified API endpoint.
 * @param {string} endpoint - The API endpoint (e.g., 'users').
 * @param {object} data - The data to post.
 */
const postData = async (endpoint, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
    }

    const result = await response.json();
    console.log(`Successfully posted to ${endpoint}:`, result);
  } catch (error) {
    console.error(`Failed to post to ${endpoint}:`, error.message);
  }
};

/**
 * Main function to load all sample data into the database.
 */
const loadData = async () => {
  // First, clear the database to ensure a fresh start
  await clearDatabase();

  console.log('\n--- Loading Users ---');
  for (const user of sampleUsers) {
    await postData('users', user);
  }

  console.log('\n--- Loading Transactions ---');
  for (const transaction of sampleTransactions) {
    await postData('transactions', transaction);
  }

  console.log('\n--- Data loading complete! ---');
};

// Run the data loader
loadData();
