import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

async function readHidden(prompt: string) {
  output.write(prompt);
  input.setRawMode?.(true);

  let value = "";
  for await (const chunk of input) {
    const char = chunk.toString("utf8");
    if (char === "\r" || char === "\n") {
      output.write("\n");
      break;
    }
    if (char === "\u0003") {
      output.write("\n");
      process.exit(130);
    }
    if (char === "\u007f") {
      value = value.slice(0, -1);
      continue;
    }
    value += char;
  }

  input.setRawMode?.(false);
  return value;
}

async function main() {
  const rl = readline.createInterface({ input, output });
  const username = (await rl.question("Admin username: ")).trim();
  rl.close();

  const password = await readHidden("Admin password: ");
  const confirm = await readHidden("Confirm password: ");

  if (!username) {
    throw new Error("Username is required.");
  }
  if (password.length < 12) {
    throw new Error("Password must be at least 12 characters.");
  }
  if (password !== confirm) {
    throw new Error("Passwords do not match.");
  }

  const prisma = new PrismaClient();
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash },
  });

  await prisma.auditLog.create({
    data: {
      action: "admin.create",
      entityType: "User",
      metadata: { username },
    },
  });

  await prisma.$disconnect();
  output.write("Admin user created or updated. Password hash was not printed.\n");
}

main().catch(async (error) => {
  console.error(error instanceof Error ? error.message : "Failed to create admin user.");
  process.exit(1);
});
