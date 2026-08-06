import prisma from "../src/config/database";

async function main() {
  const taper = await prisma.taper.findFirst({
    where: { taperType: "new00" },
    include: { specs: true },
  });
  console.log("Taper new00 specs in DB:", JSON.stringify(taper, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
