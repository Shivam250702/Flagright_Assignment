import { prisma } from "../src/utils/prisma.js";
import bcrypt from "bcryptjs";

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);
  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: { email: "demo@example.com", name: "Demo User", passwordHash },
  });
  await prisma.item.createMany({
    data: [
      { title: "Welcome", description: "Your first item", ownerId: user.id },
      { title: "Next steps", description: "Try adding a new item", ownerId: user.id },
    ],
    skipDuplicates: true,
  });
}

main().finally(() => prisma.$disconnect());


