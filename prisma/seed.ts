import { PrismaClient, Role, DiscountType } from "@prisma/client";
import crypto from "node:crypto";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  console.log("🌱 Seeding database...");

  // ── Clean existing data ────────────────────────────
  await prisma.review.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  // ── Users ──────────────────────────────────────────
  const admin = await prisma.user.create({
    data: {
      email: "admin@dreamstardc.com",
      passwordHash: hashPassword("admin123"),
      firstName: "Dream",
      lastName: "Admin",
      role: Role.ADMIN,
    },
  });
  console.log(`✔ Admin user: ${admin.email}`);

  // ── Categories ─────────────────────────────────────

  // Main categories
  const apparel = await prisma.category.create({
    data: { name: "Apparel", slug: "apparel", description: "Premium automotive lifestyle apparel", image: "/images/categories/apparel.jpg" },
  });
  const accessories = await prisma.category.create({
    data: { name: "Accessories", slug: "accessories", description: "JDM-inspired accessories and lifestyle goods", image: "/images/categories/accessories.jpg" },
  });
  const dsPerformance = await prisma.category.create({
    data: { name: "DS Performance", slug: "ds-performance", description: "High-performance rotary & 2JZ parts", image: "/images/categories/ds-performance.jpg" },
  });

  // Apparel subcategories
  const apparelMens = await prisma.category.create({
    data: { name: "Men's", slug: "apparel-mens", description: "Men's shirts and apparel", parentId: apparel.id },
  });
  const apparelWomens = await prisma.category.create({
    data: { name: "Women's", slug: "apparel-womens", description: "Women's shirts and apparel", parentId: apparel.id },
  });
  const apparelUnisex = await prisma.category.create({
    data: { name: "Unisex", slug: "apparel-unisex", description: "Unisex outerwear and accessories", parentId: apparel.id },
  });

  // DS Performance subcategories
  const perfSubcategories = [
    { name: "RX-7 FC", slug: "perf-rx7-fc", description: "Mazda RX-7 FC3S performance parts" },
    { name: "RX-7 FD", slug: "perf-rx7-fd", description: "Mazda RX-7 FD3S performance parts" },
    { name: "RX-8", slug: "perf-rx8", description: "Mazda RX-8 SE3P performance parts" },
    { name: "Rotary Engine Parts", slug: "perf-rotary-engine", description: "13B, 12A, and Renesis engine components" },
    { name: "Turbo Components", slug: "perf-turbo", description: "Turbochargers, manifolds, and boost control" },
    { name: "Cooling", slug: "perf-cooling", description: "Radiators, oil coolers, and intercoolers" },
    { name: "Fuel System", slug: "perf-fuel", description: "Pumps, injectors, and fuel management" },
    { name: "Ignition", slug: "perf-ignition", description: "Coils, plugs, and ignition upgrades" },
    { name: "Intake", slug: "perf-intake", description: "Intake manifolds and cold air systems" },
    { name: "Exhaust", slug: "perf-exhaust", description: "Downpipes, catbacks, and racing exhausts" },
    { name: "Suspension", slug: "perf-suspension", description: "Coilovers, sway bars, and chassis bracing" },
    { name: "Drivetrain", slug: "perf-drivetrain", description: "Clutches, flywheels, and differentials" },
    { name: "Electronics", slug: "perf-electronics", description: "ECUs, gauges, and wiring solutions" },
    { name: "Interior", slug: "perf-interior", description: "Seats, steering wheels, and interior trim" },
    { name: "Exterior", slug: "perf-exterior", description: "Aero kits, spoilers, and body panels" },
  ];

  const perfCats: Record<string, any> = {};
  for (const sub of perfSubcategories) {
    perfCats[sub.slug] = await prisma.category.create({
      data: { ...sub, parentId: dsPerformance.id },
    });
  }
  console.log(`✔ DS Performance: ${perfSubcategories.length} subcategories`);

  // Accessories subcategories
  const accSubcategories = [
    { name: "Vinyl Stickers", slug: "acc-stickers" },
    { name: "Key Chains", slug: "acc-keychains" },
    { name: "Lanyards", slug: "acc-lanyards" },
    { name: "License Plate Frames", slug: "acc-plate-frames" },
    { name: "Air Fresheners", slug: "acc-air-fresheners" },
    { name: "Decals", slug: "acc-decals" },
  ];

  const accCats: Record<string, any> = {};
  for (const sub of accSubcategories) {
    accCats[sub.slug] = await prisma.category.create({
      data: { name: sub.name, slug: sub.slug, description: `${sub.name} for your ride`, parentId: accessories.id },
    });
  }
  console.log(`✔ Accessories: ${accSubcategories.length} subcategories`);

  // ── Products: The 10 REAL products ─────────────────
  const realProducts = [
    {
      name: "Men's DS Shirt - Crew Neck",
      slug: "mens-ds-shirt-crew-neck",
      sku: "DS-M-CRW-001",
      description: "Classic crew neck tee with the iconic Dream Star logo. Premium ring-spun cotton for that perfect fit — whether you're at a meet or cruising the touge.",
      price: 24.99,
      salePrice: null,
      cost: 9.50,
      inventory: 150,
      weight: 0.4,
      dimensions: '10x8x1',
      images: JSON.stringify(["/images/products/ds-m-crw-front.jpg", "/images/products/ds-m-crw-back.jpg"]),
      specifications: JSON.stringify([{ label: "Material", value: "100% Ring-Spun Cotton" }, { label: "Fit", value: "Regular" }, { label: "Weight", value: "6.1 oz" }]),
      compatibleVehicles: JSON.stringify([]),
      isActive: true,
      isFeatured: true,
      categoryId: apparelMens.id,
    },
    {
      name: "Men's DS Shirt - V Neck",
      slug: "mens-ds-shirt-v-neck",
      sku: "DS-M-VNK-001",
      description: "V-neck edition of the Dream Star tee. Same premium cotton, same unmistakable style — just a sharper neckline for those who like to switch it up.",
      price: 24.99,
      salePrice: null,
      cost: 9.50,
      inventory: 120,
      weight: 0.4,
      dimensions: '10x8x1',
      images: JSON.stringify(["/images/products/ds-m-vnk-front.jpg"]),
      specifications: JSON.stringify([{ label: "Material", value: "100% Ring-Spun Cotton" }, { label: "Fit", value: "Regular" }, { label: "Weight", value: "6.1 oz" }]),
      compatibleVehicles: JSON.stringify([]),
      isActive: true,
      isFeatured: false,
      categoryId: apparelMens.id,
    },
    {
      name: "Men's DS Hoshi - Crew Neck",
      slug: "mens-ds-hoshi-crew-neck",
      sku: "DS-M-HCW-001",
      description: "The Hoshi mascot takes center stage on this crew neck. Our star character in full color — for those who rep the club loud and proud.",
      price: 24.99,
      salePrice: null,
      cost: 10.00,
      inventory: 130,
      weight: 0.4,
      dimensions: '10x8x1',
      images: JSON.stringify(["/images/products/ds-m-hcw-front.jpg"]),
      specifications: JSON.stringify([{ label: "Material", value: "100% Ring-Spun Cotton" }, { label: "Fit", value: "Regular" }, { label: "Weight", value: "6.1 oz" }]),
      compatibleVehicles: JSON.stringify([]),
      isActive: true,
      isFeatured: true,
      categoryId: apparelMens.id,
    },
    {
      name: "Men's DS Hoshi - V Neck",
      slug: "mens-ds-hoshi-v-neck",
      sku: "DS-M-HVK-001",
      description: "Hoshi V-neck for the win. All the character of our mascot tee with the sharp V-neck cut. Same great fit, same great statement.",
      price: 24.99,
      salePrice: null,
      cost: 10.00,
      inventory: 110,
      weight: 0.4,
      dimensions: '10x8x1',
      images: JSON.stringify(["/images/products/ds-m-hvk-front.jpg"]),
      specifications: JSON.stringify([{ label: "Material", value: "100% Ring-Spun Cotton" }, { label: "Fit", value: "Regular" }, { label: "Weight", value: "6.1 oz" }]),
      compatibleVehicles: JSON.stringify([]),
      isActive: true,
      isFeatured: false,
      categoryId: apparelMens.id,
    },
    {
      name: "Women's DS Shirt - Crew Neck",
      slug: "womens-ds-shirt-crew-neck",
      sku: "DS-W-CRW-001",
      description: "The Dream Star logo, tailored for her. Women's cut crew neck in premium ring-spun cotton. Because the rotary life is for everyone.",
      price: 24.99,
      salePrice: null,
      cost: 9.50,
      inventory: 100,
      weight: 0.35,
      dimensions: '9x7x1',
      images: JSON.stringify(["/images/products/ds-w-crw-front.jpg"]),
      specifications: JSON.stringify([{ label: "Material", value: "100% Ring-Spun Cotton" }, { label: "Fit", value: "Women's Regular" }, { label: "Weight", value: "5.3 oz" }]),
      compatibleVehicles: JSON.stringify([]),
      isActive: true,
      isFeatured: false,
      categoryId: apparelWomens.id,
    },
    {
      name: "Women's DS Shirt - V Neck",
      slug: "womens-ds-shirt-v-neck",
      sku: "DS-W-VNK-001",
      description: "Women's V-neck with the Dream Star mark. A flattering cut with the same premium quality — made for the track day queen.",
      price: 24.99,
      salePrice: null,
      cost: 9.50,
      inventory: 90,
      weight: 0.35,
      dimensions: '9x7x1',
      images: JSON.stringify(["/images/products/ds-w-vnk-front.jpg"]),
      specifications: JSON.stringify([{ label: "Material", value: "100% Ring-Spun Cotton" }, { label: "Fit", value: "Women's Regular" }, { label: "Weight", value: "5.3 oz" }]),
      compatibleVehicles: JSON.stringify([]),
      isActive: true,
      isFeatured: false,
      categoryId: apparelWomens.id,
    },
    {
      name: "Women's DS Hoshi - Crew Neck",
      slug: "womens-ds-hoshi-crew-neck",
      sku: "DS-W-HCW-001",
      description: "Hoshi in full color on a women's crew neck. Our mascot looks right at home on this tailored cut — wear the club with pride.",
      price: 24.99,
      salePrice: null,
      cost: 10.00,
      inventory: 85,
      weight: 0.35,
      dimensions: '9x7x1',
      images: JSON.stringify(["/images/products/ds-w-hcw-front.jpg"]),
      specifications: JSON.stringify([{ label: "Material", value: "100% Ring-Spun Cotton" }, { label: "Fit", value: "Women's Regular" }, { label: "Weight", value: "5.3 oz" }]),
      compatibleVehicles: JSON.stringify([]),
      isActive: true,
      isFeatured: true,
      categoryId: apparelWomens.id,
    },
    {
      name: "Women's DS Hoshi - V Neck",
      slug: "womens-ds-hoshi-v-neck",
      sku: "DS-W-HVK-001",
      description: "The Hoshi V-neck for women — bold design meets flattering fit. Everything you love about the mascot tee with a sharper neckline.",
      price: 24.99,
      salePrice: null,
      cost: 10.00,
      inventory: 75,
      weight: 0.35,
      dimensions: '9x7x1',
      images: JSON.stringify(["/images/products/ds-w-hvk-front.jpg"]),
      specifications: JSON.stringify([{ label: "Material", value: "100% Ring-Spun Cotton" }, { label: "Fit", value: "Women's Regular" }, { label: "Weight", value: "5.3 oz" }]),
      compatibleVehicles: JSON.stringify([]),
      isActive: true,
      isFeatured: false,
      categoryId: apparelWomens.id,
    },
    {
      name: "Unisex Windbreaker DS",
      slug: "unisex-windbreaker-ds",
      sku: "DS-U-WDS-001",
      description: "Lightweight windbreaker with the Dream Star logo across the back. Water-resistant shell, packable design — perfect for those early-morning mountain runs or late-night meets when the temperature drops.",
      price: 34.99,
      salePrice: null,
      cost: 14.00,
      inventory: 80,
      weight: 0.65,
      dimensions: '14x12x2',
      images: JSON.stringify(["/images/products/ds-u-wds-front.jpg", "/images/products/ds-u-wds-back.jpg"]),
      specifications: JSON.stringify([{ label: "Material", value: "100% Polyester" }, { label: "Fit", value: "Unisex Relaxed" }, { label: "Features", value: "Water-resistant, Packable" }]),
      compatibleVehicles: JSON.stringify([]),
      isActive: true,
      isFeatured: true,
      categoryId: apparelUnisex.id,
    },
    {
      name: "Unisex Windbreaker Hoshi",
      slug: "unisex-windbreaker-hoshi",
      sku: "DS-U-WHS-001",
      description: "Hoshi edition windbreaker. Our mascot in full color on a water-resistant shell — go ahead, brave the weather and turn heads doing it.",
      price: 34.99,
      salePrice: null,
      cost: 14.50,
      inventory: 70,
      weight: 0.65,
      dimensions: '14x12x2',
      images: JSON.stringify(["/images/products/ds-u-whs-front.jpg"]),
      specifications: JSON.stringify([{ label: "Material", value: "100% Polyester" }, { label: "Fit", value: "Unisex Relaxed" }, { label: "Features", value: "Water-resistant, Packable" }]),
      compatibleVehicles: JSON.stringify([]),
      isActive: true,
      isFeatured: false,
      categoryId: apparelUnisex.id,
    },
  ];

  for (const p of realProducts) {
    await prisma.product.create({ data: p as any });
  }
  console.log(`✔ ${realProducts.length} real products seeded`);

  // ── Additional sample products ─────────────────────
  const sampleProducts = [
    // --- DS Performance: RX-7 FC ---
    {
      name: "FC3S Street Port Template Kit",
      slug: "fc3s-street-port-template",
      sku: "DS-P-FC-001",
      description: "Complete street port template kit for the 13B-REW. Includes primary and secondary port templates, carbide burrs, and detailed porting guide. Designed for 300-400whp street setups.",
      price: 199.99,
      salePrice: 179.99,
      cost: 80.00,
      inventory: 25,
      weight: 2.0,
      dimensions: '12x8x3',
      images: JSON.stringify(["/images/products/perf-fc-port.jpg"]),
      specifications: JSON.stringify([{ label: "Engine", value: "13B-REW / 13B-T" }, { label: "Includes", value: "Templates, Burrs, Guide" }]),
      compatibleVehicles: JSON.stringify(["Mazda RX-7 FC3S 1986-1991"]),
      isActive: true,
      isFeatured: true,
      categoryId: perfCats["perf-rx7-fc"].id,
    },
    {
      name: "FC Racing Beat Catback Exhaust",
      slug: "fc-racing-beat-catback",
      sku: "DS-P-FC-002",
      description: "Racing Beat catback exhaust for FC3S. 3-inch mandrel-bent stainless steel with dual resonated tips. The iconic rotary sound — deep, throaty, and unmistakable.",
      price: 549.99,
      salePrice: null,
      cost: 280.00,
      inventory: 10,
      weight: 35.0,
      dimensions: '60x12x12',
      images: JSON.stringify(["/images/products/perf-fc-exhaust.jpg"]),
      specifications: JSON.stringify([{ label: "Material", value: "304 Stainless Steel" }, { label: "Diameter", value: "3 inch" }, { label: "Tip", value: "Dual 4 inch" }]),
      compatibleVehicles: JSON.stringify(["Mazda RX-7 FC3S 1986-1991"]),
      isActive: true,
      isFeatured: false,
      categoryId: perfCats["perf-rx7-fc"].id,
    },
    {
      name: "FC Oil Cooler Upgrade Kit",
      slug: "fc-oil-cooler-upgrade",
      sku: "DS-P-FC-003",
      description: "Upgraded 25-row oil cooler kit for FC3S. Includes AN-10 lines, sandwich plate with thermostat, and mounting bracket. Essential for any rotary running above stock power.",
      price: 349.99,
      salePrice: 319.99,
      cost: 170.00,
      inventory: 18,
      weight: 8.0,
      dimensions: '24x10x6',
      images: JSON.stringify(["/images/products/perf-fc-oilcooler.jpg"]),
      specifications: JSON.stringify([{ label: "Rows", value: "25" }, { label: "Fittings", value: "AN-10" }, { label: "Thermostat", value: "180°F" }]),
      compatibleVehicles: JSON.stringify(["Mazda RX-7 FC3S 1986-1991"]),
      isActive: true,
      isFeatured: false,
      categoryId: perfCats["perf-cooling"].id,
    },
    // --- DS Performance: RX-7 FD ---
    {
      name: "FD3S Single Turbo Conversion Kit",
      slug: "fd3s-single-turbo-kit",
      sku: "DS-P-FD-001",
      description: "Complete single turbo conversion for the FD3S. BorgWarner EFR 8374 turbo, tubular manifold, TiAL wastegate, and all plumbing. Ditch the sequential twins for reliable big power.",
      price: 4299.99,
      salePrice: 3899.99,
      cost: 2600.00,
      inventory: 5,
      weight: 65.0,
      dimensions: '30x20x20',
      images: JSON.stringify(["/images/products/perf-fd-turbo.jpg"]),
      specifications: JSON.stringify([{ label: "Turbo", value: "BorgWarner EFR 8374" }, { label: "Wastegate", value: "TiAL MVR 44mm" }, { label: "Power Range", value: "400-700whp" }]),
      compatibleVehicles: JSON.stringify(["Mazda RX-7 FD3S 1992-2002"]),
      isActive: true,
      isFeatured: true,
      categoryId: perfCats["perf-rx7-fd"].id,
    },
    {
      name: "FD Apex Seal Kit — Cryo-Treated",
      slug: "fd-apex-seal-kit",
      sku: "DS-P-FD-002",
      description: "Cryogenically treated apex seal set for 13B-REW. 2mm super-strong steel alloy, corner seals, and springs included. The foundation of any serious rotary rebuild.",
      price: 449.99,
      salePrice: null,
      cost: 220.00,
      inventory: 30,
      weight: 1.5,
      dimensions: '8x8x2',
      images: JSON.stringify(["/images/products/perf-fd-apex.jpg"]),
      specifications: JSON.stringify([{ label: "Material", value: "Cryo-Treated Steel Alloy" }, { label: "Thickness", value: "2mm" }, { label: "Includes", value: "6 Apex Seals, Springs, Corners" }]),
      compatibleVehicles: JSON.stringify(["Mazda RX-7 FD3S 1992-2002", "Mazda RX-7 FC3S 1986-1991"]),
      isActive: true,
      isFeatured: true,
      categoryId: perfCats["perf-rotary-engine"].id,
    },
    {
      name: "FD Coilover Kit — Track Spec",
      slug: "fd-coilover-track-spec",
      sku: "DS-P-FD-003",
      description: "32-way adjustable coilover kit for FD3S. Digressive valving, camber plates included, Swift spring upgrade available. From canyon carving to circuit assault.",
      price: 1499.99,
      salePrice: 1349.99,
      cost: 800.00,
      inventory: 8,
      weight: 48.0,
      dimensions: '30x24x12',
      images: JSON.stringify(["/images/products/perf-fd-coils.jpg"]),
      specifications: JSON.stringify([{ label: "Adjustment", value: "32-way" }, { label: "Spring Rate", value: "12K/10K" }, { label: "Includes", value: "Camber Plates, Spanners" }]),
      compatibleVehicles: JSON.stringify(["Mazda RX-7 FD3S 1992-2002"]),
      isActive: true,
      isFeatured: false,
      categoryId: perfCats["perf-suspension"].id,
    },
    // --- DS Performance: RX-8 ---
    {
      name: "RX-8 Renesis Rebuild Kit",
      slug: "rx8-renesis-rebuild-kit",
      sku: "DS-P-R8-001",
      description: "Complete Renesis engine rebuild kit. Everything you need to bring your 13B-MSP back to life — apex seals, side seals, corner seals, springs, gaskets, and O-rings.",
      price: 699.99,
      salePrice: null,
      cost: 380.00,
      inventory: 20,
      weight: 5.0,
      dimensions: '14x10x4',
      images: JSON.stringify(["/images/products/perf-r8-rebuild.jpg"]),
      specifications: JSON.stringify([{ label: "Engine", value: "13B-MSP Renesis" }, { label: "Includes", value: "Full Seal Kit + Gaskets + O-Rings" }]),
      compatibleVehicles: JSON.stringify(["Mazda RX-8 SE3P 2004-2012"]),
      isActive: true,
      isFeatured: false,
      categoryId: perfCats["perf-rx8"].id,
    },
    {
      name: "RX-8 Cold Air Intake System",
      slug: "rx8-cold-air-intake",
      sku: "DS-P-R8-002",
      description: "Cold air intake for RX-8 Series I & II. 3.5-inch aluminum piping, high-flow dry filter, and heat shield. Better throttle response and that unmistakable induction roar.",
      price: 289.99,
      salePrice: 259.99,
      cost: 130.00,
      inventory: 15,
      weight: 6.0,
      dimensions: '20x12x10',
      images: JSON.stringify(["/images/products/perf-r8-intake.jpg"]),
      specifications: JSON.stringify([{ label: "Pipe Diameter", value: "3.5 inch" }, { label: "Filter Type", value: "Dry High-Flow" }, { label: "Material", value: "6061 Aluminum" }]),
      compatibleVehicles: JSON.stringify(["Mazda RX-8 SE3P 2004-2012"]),
      isActive: true,
      isFeatured: false,
      categoryId: perfCats["perf-intake"].id,
    },
    // --- Turbo Components ---
    {
      name: "T04Z Dual Ball Bearing Turbocharger",
      slug: "t04z-turbocharger",
      sku: "DS-P-TB-001",
      description: "Garrett T04Z dual ball bearing turbo. 67mm compressor, T4 divided housing — the gold standard for high-horsepower rotary builds. Spools fast, flows hard.",
      price: 1899.99,
      salePrice: null,
      cost: 1200.00,
      inventory: 6,
      weight: 22.0,
      dimensions: '14x14x14',
      images: JSON.stringify(["/images/products/perf-t04z.jpg"]),
      specifications: JSON.stringify([{ label: "Compressor", value: "67mm" }, { label: "Bearing", value: "Dual Ball Bearing" }, { label: "Housing", value: "T4 Divided" }]),
      compatibleVehicles: JSON.stringify(["Universal — Rotary 13B/20B"]),
      isActive: true,
      isFeatured: true,
      categoryId: perfCats["perf-turbo"].id,
    },
    {
      name: "TiAL Sport Q Blow Off Valve",
      slug: "tial-q-bov",
      sku: "DS-P-TB-002",
      description: "TiAL Sport Q 50mm blow-off valve. The crisp, clean release sound that rotary and 2JZ builds are famous for. V-band clamp, multiple spring options included.",
      price: 279.99,
      salePrice: null,
      cost: 160.00,
      inventory: 20,
      weight: 1.8,
      dimensions: '6x6x4',
      images: JSON.stringify(["/images/products/perf-tial-bov.jpg"]),
      specifications: JSON.stringify([{ label: "Size", value: "50mm" }, { label: "Connection", value: "V-Band" }, { label: "Includes", value: "Spring Kit, Clamp" }]),
      compatibleVehicles: JSON.stringify(["Universal"]),
      isActive: true,
      isFeatured: false,
      categoryId: perfCats["perf-turbo"].id,
    },
    // --- Fuel System ---
    {
      name: "Walbro 450LPH Fuel Pump Kit",
      slug: "walbro-450-fuel-pump",
      sku: "DS-P-FU-001",
      description: "Walbro 450LPH in-tank fuel pump with install kit. E85 compatible. Flows enough for 700+whp on pump gas. The go-to upgrade for serious rotary and 2JZ builds.",
      price: 149.99,
      salePrice: 129.99,
      cost: 85.00,
      inventory: 35,
      weight: 2.0,
      dimensions: '8x4x4',
      images: JSON.stringify(["/images/products/perf-walbro.jpg"]),
      specifications: JSON.stringify([{ label: "Flow Rate", value: "450 LPH" }, { label: "Compatibility", value: "E85 / Pump Gas" }, { label: "Includes", value: "Install Kit" }]),
      compatibleVehicles: JSON.stringify(["Universal"]),
      isActive: true,
      isFeatured: false,
      categoryId: perfCats["perf-fuel"].id,
    },
    {
      name: "ID 1050x Injector Set — 4-Pack",
      slug: "id1050x-injector-set",
      sku: "DS-P-FU-002",
      description: "Injector Dynamics ID1050x — 1050cc top-feed injectors. Matched set of 4. Industry standard for high-horsepower rotary and 2JZ builds. Perfect idle, massive flow.",
      price: 699.99,
      salePrice: null,
      cost: 480.00,
      inventory: 12,
      weight: 1.5,
      dimensions: '8x6x3',
      images: JSON.stringify(["/images/products/perf-id1050.jpg"]),
      specifications: JSON.stringify([{ label: "Flow", value: "1050cc/min" }, { label: "Type", value: "Top Feed" }, { label: "Count", value: "4 (Matched Set)" }]),
      compatibleVehicles: JSON.stringify(["Universal"]),
      isActive: true,
      isFeatured: false,
      categoryId: perfCats["perf-fuel"].id,
    },
    // --- Electronics ---
    {
      name: "Haltech Elite 1500 ECU",
      slug: "haltech-elite-1500",
      sku: "DS-P-EL-001",
      description: "Haltech Elite 1500 standalone ECU with plug-and-play harness for FD3S. Full sequential control, flex fuel, anti-lag, traction control — the brain your rotary deserves.",
      price: 1899.99,
      salePrice: 1749.99,
      cost: 1200.00,
      inventory: 4,
      weight: 3.0,
      dimensions: '12x10x4',
      images: JSON.stringify(["/images/products/perf-haltech.jpg"]),
      specifications: JSON.stringify([{ label: "Model", value: "Elite 1500" }, { label: "Harness", value: "FD3S PnP" }, { label: "Features", value: "Flex Fuel, Anti-Lag, Traction Control" }]),
      compatibleVehicles: JSON.stringify(["Mazda RX-7 FD3S 1992-2002"]),
      isActive: true,
      isFeatured: true,
      categoryId: perfCats["perf-electronics"].id,
    },
    {
      name: "AEM Wideband O2 Sensor Kit",
      slug: "aem-wideband-o2",
      sku: "DS-P-EL-002",
      description: "AEM X-Series wideband air/fuel ratio gauge kit. Bosch 4.9 LSU sensor, 0-5V analog output for ECU logging. Essential tuning tool for any modified build.",
      price: 199.99,
      salePrice: null,
      cost: 110.00,
      inventory: 22,
      weight: 1.5,
      dimensions: '8x6x4',
      images: JSON.stringify(["/images/products/perf-aem-wideband.jpg"]),
      specifications: JSON.stringify([{ label: "Sensor", value: "Bosch 4.9 LSU" }, { label: "Output", value: "0-5V Analog" }, { label: "Range", value: "8.0:1 – 20.0:1 AFR" }]),
      compatibleVehicles: JSON.stringify(["Universal"]),
      isActive: true,
      isFeatured: false,
      categoryId: perfCats["perf-electronics"].id,
    },
    // --- Ignition ---
    {
      name: "IGN-1A Smart Coil Kit — 4-Pack",
      slug: "ign1a-coil-kit",
      sku: "DS-P-IG-001",
      description: "IGN-1A racing smart coils. Four-pack with mounting bracket and harness. The gold standard for rotary ignition upgrades — enough spark energy for 40+ PSI on E85.",
      price: 399.99,
      salePrice: 359.99,
      cost: 220.00,
      inventory: 14,
      weight: 4.0,
      dimensions: '14x8x4',
      images: JSON.stringify(["/images/products/perf-ign1a.jpg"]),
      specifications: JSON.stringify([{ label: "Type", value: "IGN-1A Smart Coil" }, { label: "Count", value: "4" }, { label: "Includes", value: "Bracket, Harness" }]),
      compatibleVehicles: JSON.stringify(["Universal — Rotary 13B/20B"]),
      isActive: true,
      isFeatured: false,
      categoryId: perfCats["perf-ignition"].id,
    },
    // --- Drivetrain ---
    {
      name: "OS Giken Twin Plate Clutch — FD3S",
      slug: "os-giken-twin-clutch-fd",
      sku: "DS-P-DT-001",
      description: "OS Giken STR twin plate clutch kit for FD3S. Holds 600+whp with manageable pedal effort. The clutch that serious rotary builds trust at the drag strip and circuit.",
      price: 1799.99,
      salePrice: null,
      cost: 1100.00,
      inventory: 5,
      weight: 28.0,
      dimensions: '18x18x8',
      images: JSON.stringify(["/images/products/perf-osgiken.jpg"]),
      specifications: JSON.stringify([{ label: "Type", value: "Twin Plate STR" }, { label: "Torque Capacity", value: "600+ lb-ft" }, { label: "Disc", value: "Organic / Metallic" }]),
      compatibleVehicles: JSON.stringify(["Mazda RX-7 FD3S 1992-2002"]),
      isActive: true,
      isFeatured: false,
      categoryId: perfCats["perf-drivetrain"].id,
    },
    // --- Accessories ---
    {
      name: "Dream Star Hoshi Die-Cut Sticker",
      slug: "hoshi-diecut-sticker",
      sku: "DS-A-ST-001",
      description: "Premium die-cut vinyl sticker featuring the Hoshi mascot. Weatherproof, UV-resistant, 5-inch tall. Perfect for your rear window or toolbox.",
      price: 6.99,
      salePrice: null,
      cost: 1.20,
      inventory: 500,
      weight: 0.05,
      dimensions: '6x6x0.1',
      images: JSON.stringify(["/images/products/acc-hoshi-sticker.jpg"]),
      specifications: JSON.stringify([{ label: "Material", value: "Weatherproof Vinyl" }, { label: "Size", value: "5 inches" }, { label: "Finish", value: "Matte UV" }]),
      compatibleVehicles: JSON.stringify([]),
      isActive: true,
      isFeatured: true,
      categoryId: accCats["acc-stickers"].id,
    },
    {
      name: "Rotary Spirit Vinyl Sticker Pack",
      slug: "rotary-spirit-sticker-pack",
      sku: "DS-A-ST-002",
      description: "Set of 3 vinyl stickers celebrating the rotary spirit. Triangle rotor, 13B silhouette, and 'Spin Hard' text. Die-cut, waterproof, and ready to stick.",
      price: 9.99,
      salePrice: null,
      cost: 2.00,
      inventory: 300,
      weight: 0.08,
      dimensions: '8x6x0.1',
      images: JSON.stringify(["/images/products/acc-rotary-stickers.jpg"]),
      specifications: JSON.stringify([{ label: "Count", value: "3 Stickers" }, { label: "Material", value: "Weatherproof Vinyl" }]),
      compatibleVehicles: JSON.stringify([]),
      isActive: true,
      isFeatured: false,
      categoryId: accCats["acc-stickers"].id,
    },
    {
      name: "DS Metal Key Chain",
      slug: "ds-metal-keychain",
      sku: "DS-A-KC-001",
      description: "Heavy-duty metal key chain with the Dream Star logo laser-etched. Solid zinc alloy, gunmetal finish. The jingle every enthusiast recognizes at Cars & Coffee.",
      price: 14.99,
      salePrice: null,
      cost: 4.50,
      inventory: 200,
      weight: 0.15,
      dimensions: '4x2x0.3',
      images: JSON.stringify(["/images/products/acc-keychain.jpg"]),
      specifications: JSON.stringify([{ label: "Material", value: "Zinc Alloy" }, { label: "Finish", value: "Gunmetal" }, { label: "Size", value: "2.5 inches" }]),
      compatibleVehicles: JSON.stringify([]),
      isActive: true,
      isFeatured: true,
      categoryId: accCats["acc-keychains"].id,
    },
    {
      name: "Dream Star Lanyard — Black/Red",
      slug: "ds-lanyard-black-red",
      sku: "DS-A-LY-001",
      description: "Woven polyester lanyard in black with red Dream Star branding. Detachable buckle, metal clip. Wear your keys around your neck with club pride.",
      price: 9.99,
      salePrice: null,
      cost: 2.50,
      inventory: 250,
      weight: 0.08,
      dimensions: '6x4x0.2',
      images: JSON.stringify(["/images/products/acc-lanyard.jpg"]),
      specifications: JSON.stringify([{ label: "Material", value: "Woven Polyester" }, { label: "Width", value: "0.75 inch" }, { label: "Features", value: "Detachable Buckle" }]),
      compatibleVehicles: JSON.stringify([]),
      isActive: true,
      isFeatured: false,
      categoryId: accCats["acc-lanyards"].id,
    },
    {
      name: "DS License Plate Frame — Black",
      slug: "ds-plate-frame-black",
      sku: "DS-A-PF-001",
      description: "Matte black license plate frame with 'Dream Star Drivers Club' engraved on the bottom. Stainless steel, rust-proof. Subtle, clean, and unmistakable.",
      price: 19.99,
      salePrice: null,
      cost: 6.00,
      inventory: 150,
      weight: 0.35,
      dimensions: '13x7x0.5',
      images: JSON.stringify(["/images/products/acc-plateframe.jpg"]),
      specifications: JSON.stringify([{ label: "Material", value: "Stainless Steel" }, { label: "Finish", value: "Matte Black Powder Coat" }, { label: "Fitment", value: "Standard US Plate" }]),
      compatibleVehicles: JSON.stringify([]),
      isActive: true,
      isFeatured: false,
      categoryId: accCats["acc-plate-frames"].id,
    },
    {
      name: "Hoshi Air Freshener — 3-Pack",
      slug: "hoshi-air-freshener-3pack",
      sku: "DS-A-AF-001",
      description: "Hoshi-shaped hanging air fresheners. Three scents: New Car, Cherry Blossom, and Midnight Forest. Because even your daily driver deserves some personality.",
      price: 12.99,
      salePrice: 9.99,
      cost: 3.00,
      inventory: 180,
      weight: 0.1,
      dimensions: '6x4x0.3',
      images: JSON.stringify(["/images/products/acc-airfreshener.jpg"]),
      specifications: JSON.stringify([{ label: "Count", value: "3" }, { label: "Scents", value: "New Car, Cherry Blossom, Midnight Forest" }, { label: "Duration", value: "4-6 weeks each" }]),
      compatibleVehicles: JSON.stringify([]),
      isActive: true,
      isFeatured: false,
      categoryId: accCats["acc-air-fresheners"].id,
    },
    {
      name: "Dream Star Rear Window Decal",
      slug: "ds-rear-window-decal",
      sku: "DS-A-DC-001",
      description: "Large format Dream Star logo decal for rear window. Precision-cut matte black vinyl, 18 inches wide. Clean removal, no residue.",
      price: 24.99,
      salePrice: null,
      cost: 5.00,
      inventory: 100,
      weight: 0.2,
      dimensions: '20x6x0.1',
      images: JSON.stringify(["/images/products/acc-decal.jpg"]),
      specifications: JSON.stringify([{ label: "Size", value: "18 x 4 inches" }, { label: "Material", value: "Matte Black Vinyl" }, { label: "Application", value: "External, Clean Removal" }]),
      compatibleVehicles: JSON.stringify([]),
      isActive: true,
      isFeatured: false,
      categoryId: accCats["acc-decals"].id,
    },
  ];

  for (const p of sampleProducts) {
    await prisma.product.create({ data: p as any });
  }
  console.log(`✔ ${sampleProducts.length} sample products seeded`);

  // ── Product Variants for Apparel ───────────────────
  // Add size/color variants for the main apparel items
  const apparelProductIds = realProducts.map((p: any) => p.sku);
  const sizes = ["S", "M", "L", "XL", "2XL"];
  const colors: Record<string, string[]> = {
    "DS-M-CRW-001": ["Black", "Charcoal", "White"],
    "DS-M-VNK-001": ["Black", "Charcoal", "White"],
    "DS-M-HCW-001": ["Black", "Navy"],
    "DS-M-HVK-001": ["Black", "Navy"],
    "DS-W-CRW-001": ["Black", "Charcoal", "White"],
    "DS-W-VNK-001": ["Black", "Charcoal", "White"],
    "DS-W-HCW-001": ["Black", "Burgundy"],
    "DS-W-HVK-001": ["Black", "Burgundy"],
    "DS-U-WDS-001": ["Black", "Charcoal"],
    "DS-U-WHS-001": ["Black", "Navy"],
  };

  let variantCount = 0;
  for (const p of realProducts) {
    const product = await prisma.product.findUnique({ where: { sku: p.sku } });
    if (!product) continue;
    const productColors = colors[p.sku] || ["Black"];
    for (const size of sizes) {
      for (const color of productColors) {
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            name: `${size} / ${color}`,
            sku: `${p.sku}-${size}-${color.substring(0, 3).toUpperCase()}`,
            price: p.price,
            inventory: Math.floor(Math.random() * 30) + 5,
          },
        });
        variantCount++;
      }
    }
  }
  console.log(`✔ ${variantCount} product variants seeded`);

  // ── Coupons ────────────────────────────────────────
  await prisma.coupon.create({
    data: {
      code: "WELCOME10",
      discountType: DiscountType.PERCENTAGE,
      discountValue: 10,
      minOrderAmount: 25.00,
      maxUses: 1000,
      currentUses: 0,
      isActive: true,
      expiresAt: new Date("2027-12-31"),
    },
  });
  console.log("✔ Coupon: WELCOME10 (10% off)");

  await prisma.coupon.create({
    data: {
      code: "FREESHIP",
      discountType: DiscountType.FIXED,
      discountValue: 0,
      minOrderAmount: 75.00,
      maxUses: 500,
      currentUses: 0,
      isActive: true,
      expiresAt: new Date("2027-12-31"),
    },
  });
  console.log("✔ Coupon: FREESHIP (free shipping over $75)");

  console.log("\n✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
