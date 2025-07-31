// controllers/relationshipController.js

import { getSession } from '../config/neo4j.js';

export const getUserRelationships = async (req, res) => {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (u:User {id: $id})-[r]-(connected)
      RETURN type(r) AS relationship, connected
      `,
      { id: req.params.id }
    );
    const connections = result.records.map(record => ({
      relationship: record.get('relationship'),
      node: record.get('connected').properties,
      labels: record.get('connected').labels || []
    }));

    res.json(connections);

  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
};

export const getTransactionRelationships = async (req, res) => {
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (t:Transaction {id: $id})-[r]-(connected)
      RETURN type(r) AS relationship, connected
      `,
      { id: req.params.id }
    );
    const connections = result.records.map(record => ({
      relationship: record.get('relationship'),
      node: record.get('connected').properties,
      labels: record.get('connected').labels || []
    }));

    res.json(connections);

  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
};
