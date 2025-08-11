import { app } from "./app.js";
import { config } from "./config.js";
import { prisma } from "./utils/prisma.js";
async function main() {
    // Ensure DB connection on boot
    await prisma.$connect();
    app.listen(config.port, () => {
        // eslint-disable-next-line no-console
        console.log(`API listening on http://localhost:${config.port}`);
    });
}
main().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
});
