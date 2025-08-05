import neo4j from "neo4j-driver";
import dotenv from "dotenv";
dotenv.config();

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD),
  { encrypted: 'ENCRYPTION_OFF' }
);

export const getSession = () => driver.session();

export const closeDriver = async () => {
  await driver.close();
};
console.log({
  uri: process.env.NEO4J_URI,
  user: process.env.NEO4J_USER,
  password: process.env.NEO4J_PASSWORD,
});
