import { getSession } from '../config/neo4j.js';

export const addOrUpdateTransaction = async (req, res) => {
  const tx = req.body;

  if (!tx.id || !tx.from_user || !tx.to_user || typeof tx.amount !== 'number') {
    return res.status(400).json({ error: "'id', 'from_user', 'to_user' and numeric 'amount' are required." });
  }

  const session = getSession();

  try {
    // Create or update transaction node & link to users
    // The "WITH t" clause was added here to fix the Cypher syntax error.
    // It passes the created/merged transaction node 't' to the next part of the query.
    await session.run(
      `
      MERGE (t:Transaction {id: $id})
      SET t.amount = $amount, t.ip = $ip, t.device_id = $device_id
      WITH t
      MATCH (uFrom:User {id: $from_user}), (uTo:User {id: $to_user})
      MERGE (uFrom)-[:SENT]->(t)
      MERGE (uTo)-[:RECEIVED]->(t)
      `,
      tx
    );

    // Link transaction-to-transaction by IP (if available)
    if (tx.ip) {
      await session.run(
        `
        MATCH (t1:Transaction {id: $id}), (t2:Transaction {ip: $ip}) WHERE t1.id <> t2.id
        MERGE (t1)-[:SAME_IP]->(t2)
        `,
        { id: tx.id, ip: tx.ip }
      );
    }

    // Link transaction-to-transaction by Device ID (if available)
    if (tx.device_id) {
      await session.run(
        `
        MATCH (t1:Transaction {id: $id}), (t2:Transaction {device_id: $device_id}) WHERE t1.id <> t2.id
        MERGE (t1)-[:SAME_DEVICE]->(t2)
        `,
        { id: tx.id, device_id: tx.device_id }
      );
    }

    res.json({ status: "Transaction added/updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
};

export const listTransactions = async (req, res) => {
  const session = getSession();
  try {
    const result = await session.run("MATCH (t:Transaction) RETURN t");
    const transactions = result.records.map(r => r.get('t').properties);
    res.json(transactions);
  } catch (error) { 
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
};
