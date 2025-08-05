/**
 * Link User nodes sharing the same attributes (email, phone, address, payment)
 * Creates SHARED_EMAIL, SHARED_PHONE, SHARED_ADDRESS, SHARED_PAYMENT relationships.
 */
export async function linkUsersBySharedAttributes(session, user, attributes = []) {
  for (const attr of attributes) {
    if (user[attr]) {
      // Use parameterized Cypher with attr dynamically - careful of injection via attr, but we trust attributes here
      const relationshipType = `SHARED_${attr.toUpperCase()}`;
      const query = `
        MATCH (u1:User {id: $id}), (u2:User {${attr}: $value})
        WHERE u1.id <> u2.id
        MERGE (u1)-[:${relationshipType}]->(u2)
      `;
      await session.run(query, { id: user.id, value: user[attr] });
    }
  }
}
