// controllers/userController.js

import { getSession } from '../config/neo4j.js';
import { linkUsersBySharedAttributes } from '../models/utils.js';

export const addOrUpdateUser = async (req, res) => {
  const user = req.body;

  if (!user.id || !user.name) {
    return res.status(400).json({ error: "User 'id' and 'name' are required." });
  }

  const session = getSession();

  try {
    await session.run(
      `
      MERGE (u:User {id: $id})
      SET u.name = $name, u.email = $email, u.phone = $phone, u.address = $address, u.payment = $payment
      `,
      user
    );
    // Automatically create shared attribute links
    await linkUsersBySharedAttributes(session, user, ['email', 'phone', 'address', 'payment']);

    res.json({ status: "User added/updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
};

export const listUsers = async (req, res) => {
  const session = getSession();
  try {
    const result = await session.run("MATCH (u:User) RETURN u");
    const users = result.records.map(r => r.get('u').properties);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
};
