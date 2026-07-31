import { PrismaClient } from "@prisma/client";
import crypto from "node:crypto";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

// ── Helper: find or create a category by slug ──────────
async function findOrCreateCategory(slug: string, data: Record<string, any>) {
  let cat = await prisma.category.findUnique({ where: { slug } });
  if (!cat) {
    cat = await prisma.category.create({ data: data as any });
    console.log(`✔ Created category: ${slug}`);
  } else {
    console.log(`  Category already exists: ${slug} — skipping`);
  }
  return cat;
}

async function main() {
  console.log("🌱 Seeding database (idempotent — never deletes existing data)...\n");

  // ── Admin User ────────────────────────────────────────
  let admin = await prisma.user.findUnique({ where: { email: "admin@dreamstardc.com" } });
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        email: "admin@dreamstardc.com",
        passwordHash: hashPassword("admin123"),
        firstName: "Dream",
        lastName: "Admin",
        role: "ADMIN",
      },
    });
    console.log(`✔ Admin user created: ${admin.email}`);
  } else {
    console.log(`  Admin user already exists: ${admin.email} — skipping`);
  }

  // ── Categories ─────────────────────────────────────────
  console.log("");

  // Main categories
  const apparel = await findOrCreateCategory("apparel", {
    name: "Apparel", slug: "apparel",
    description: "Premium automotive lifestyle apparel",
    image: "/images/categories/apparel.jpg",
  });
  const accessories = await findOrCreateCategory("accessories", {
    name: "Accessories", slug: "accessories",
    description: "JDM-inspired accessories and lifestyle goods",
    image: "/images/categories/accessories.jpg",
  });
  const dsPerformance = await findOrCreateCategory("ds-performance", {
    name: "DS Performance", slug: "ds-performance",
    description: "High-performance rotary & 2JZ parts",
    image: "/images/categories/ds-performance.jpg",
  });

  // Apparel subcategories
  const apparelMens = await findOrCreateCategory("apparel-mens", {
    name: "Men's", slug: "apparel-mens",
    description: "Men's shirts and apparel", parentId: apparel.id,
  });
  const apparelWomens = await findOrCreateCategory("apparel-womens", {
    name: "Women's", slug: "apparel-womens",
    description: "Women's shirts and apparel", parentId: apparel.id,
  });
  const apparelUnisex = await findOrCreateCategory("apparel-unisex", {
    name: "Unisex", slug: "apparel-unisex",
    description: "Unisex outerwear and accessories", parentId: apparel.id,
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
    perfCats[sub.slug] = await findOrCreateCategory(sub.slug, {
      ...sub, parentId: dsPerformance.id,
    });
  }

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
    accCats[sub.slug] = await findOrCreateCategory(sub.slug, {
      name: sub.name, slug: sub.slug,
      description: `${sub.name} for your ride`,
      parentId: accessories.id,
    });
  }

  // ── Products: The 10 REAL products ──────────────────────
  console.log("");
  const newProductSkus: Set<string> = new Set();

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
    const existing = await prisma.product.findUnique({ where: { sku: p.sku } });
    if (existing) {
      console.log(`  Product already exists: ${p.sku} — skipping`);
    } else {
      await prisma.product.create({ data: p as any });
      newProductSkus.add(p.sku);
      console.log(`✔ Product created: ${p.sku}`);
    }
  }

  // ── Additional sample products ──────────────────────────
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
    // ── Goopy Performance Parts (PLACEHOLDERS — awaiting supplier data) ──
    {
      name: "Goopy Steel Apex Seals — 13B (2mm)",
      slug: "goopy-steel-apex-seals-13b",
      sku: "DS-P-GP-001",
      description: "Precision-engineered steel apex seals for 13B rotary engines. Australian-made by Goopy Performance — trusted by championship-winning rotary teams worldwide. Hardened steel alloy, 2mm thickness, matched set of 6. Ideal for street and mild track builds up to 400whp. [PLACEHOLDER — awaiting final pricing and specs from supplier]",
      price: 280.00,
      salePrice: null,
      cost: 180.00,
      inventory: 0,
      weight: 0.8,
      dimensions: '8x6x1',
      images: JSON.stringify(["/images/products/perf-goopy-steel-apex.jpg"]),
      specifications: JSON.stringify([{ label: "Manufacturer", value: "Goopy Performance (Australia)" }, { label: "Engine", value: "13B / 13B-REW / 13B-T" }, { label: "Material", value: "Hardened Steel Alloy" }, { label: "Thickness", value: "2mm" }, { label: "Set Count", value: "6 Seals" }, { label: "Tier", value: "Street" }]),
      compatibleVehicles: JSON.stringify(["Mazda RX-7 FC3S 1986-1991", "Mazda RX-7 FD3S 1992-2002"]),
      isActive: false,
      isFeatured: false,
      categoryId: perfCats["perf-rotary-engine"].id,
    },
    {
      name: "Goopy Ceramic Apex Seals — 13B (2mm)",
      slug: "goopy-ceramic-apex-seals-13b",
      sku: "DS-P-GP-002",
      description: "Silicon nitride ceramic apex seals for 13B rotary engines. The ultimate rotary seal — lower friction, reduced housing wear, and capable of sustained high-RPM operation beyond 10,000 RPM. Australian-made by Goopy Performance. For dedicated track cars and zero-compromise builds. [PLACEHOLDER — awaiting final pricing and specs from supplier]",
      price: 580.00,
      salePrice: null,
      cost: 420.00,
      inventory: 0,
      weight: 0.8,
      dimensions: '8x6x1',
      images: JSON.stringify(["/images/products/perf-goopy-ceramic-apex.jpg"]),
      specifications: JSON.stringify([{ label: "Manufacturer", value: "Goopy Performance (Australia)" }, { label: "Engine", value: "13B / 13B-REW / 13B-T" }, { label: "Material", value: "Silicon Nitride Ceramic" }, { label: "Thickness", value: "2mm" }, { label: "Set Count", value: "6 Seals" }, { label: "Tier", value: "Race" }]),
      compatibleVehicles: JSON.stringify(["Mazda RX-7 FC3S 1986-1991", "Mazda RX-7 FD3S 1992-2002"]),
      isActive: false,
      isFeatured: false,
      categoryId: perfCats["perf-rotary-engine"].id,
    },
    {
      name: "Goopy Steel Apex Seals — 20B (2mm)",
      slug: "goopy-steel-apex-seals-20b",
      sku: "DS-P-GP-003",
      description: "Hardened steel apex seals for the legendary 20B three-rotor engine. Australian-made by Goopy Performance. Matched set for all three rotors. For the few who dare to run the triple-rotor dream. [PLACEHOLDER — awaiting final pricing and specs from supplier]",
      price: 395.00,
      salePrice: null,
      cost: 260.00,
      inventory: 0,
      weight: 1.1,
      dimensions: '10x8x1.5',
      images: JSON.stringify(["/images/products/perf-goopy-steel-apex-20b.jpg"]),
      specifications: JSON.stringify([{ label: "Manufacturer", value: "Goopy Performance (Australia)" }, { label: "Engine", value: "20B-REW (Three-Rotor)" }, { label: "Material", value: "Hardened Steel Alloy" }, { label: "Thickness", value: "2mm" }, { label: "Set Count", value: "9 Seals (3 Rotors)" }, { label: "Tier", value: "Street" }]),
      compatibleVehicles: JSON.stringify(["Mazda Cosmo JC Series 1990-1996", "Custom 20B Swaps"]),
      isActive: false,
      isFeatured: false,
      categoryId: perfCats["perf-rotary-engine"].id,
    },
    {
      name: "Goopy Side Seals — 13B (Set)",
      slug: "goopy-side-seals-13b",
      sku: "DS-P-GP-004",
      description: "Precision side seals for 13B rotary engines. Australian-made hardened steel. Matched set for a complete rotor housing rebuild. Essential replacement during any porting or rebuild job. [PLACEHOLDER — awaiting final pricing and specs from supplier]",
      price: 150.00,
      salePrice: null,
      cost: 95.00,
      inventory: 0,
      weight: 0.3,
      dimensions: '6x6x0.5',
      images: JSON.stringify(["/images/products/perf-goopy-side-seals.jpg"]),
      specifications: JSON.stringify([{ label: "Manufacturer", value: "Goopy Performance (Australia)" }, { label: "Engine", value: "13B / 13B-REW / 13B-T" }, { label: "Material", value: "Hardened Steel" }, { label: "Set Count", value: "Full Set (6 Side Seals)" }]),
      compatibleVehicles: JSON.stringify(["Mazda RX-7 FC3S 1986-1991", "Mazda RX-7 FD3S 1992-2002"]),
      isActive: false,
      isFeatured: false,
      categoryId: perfCats["perf-rotary-engine"].id,
    },
    {
      name: "Goopy Corner Seals — 13B (Set)",
      slug: "goopy-corner-seals-13b",
      sku: "DS-P-GP-005",
      description: "Hardened steel corner seals for 13B rotary engines. Australian-made by Goopy Performance. Precision-ground for perfect fitment with OEM and aftermarket rotors. [PLACEHOLDER — awaiting final pricing and specs from supplier]",
      price: 105.00,
      salePrice: null,
      cost: 65.00,
      inventory: 0,
      weight: 0.2,
      dimensions: '5x5x0.5',
      images: JSON.stringify(["/images/products/perf-goopy-corner-seals.jpg"]),
      specifications: JSON.stringify([{ label: "Manufacturer", value: "Goopy Performance (Australia)" }, { label: "Engine", value: "13B / 13B-REW / 13B-T" }, { label: "Material", value: "Hardened Steel" }, { label: "Set Count", value: "Full Set (12 Corner Seals)" }]),
      compatibleVehicles: JSON.stringify(["Mazda RX-7 FC3S 1986-1991", "Mazda RX-7 FD3S 1992-2002"]),
      isActive: false,
      isFeatured: false,
      categoryId: perfCats["perf-rotary-engine"].id,
    },
    {
      name: "Goopy Full Rotor Seal Kit — 13B",
      slug: "goopy-rotor-seal-kit-13b",
      sku: "DS-P-GP-006",
      description: "Complete rotor seal kit for 13B rotary engines. Includes steel apex seals, side seals, corner seals, and all springs — everything needed to seal all rotors in a full rebuild. Australian-made by Goopy Performance. [PLACEHOLDER — awaiting final pricing and specs from supplier]",
      price: 495.00,
      salePrice: null,
      cost: 340.00,
      inventory: 0,
      weight: 1.5,
      dimensions: '8x8x2',
      images: JSON.stringify(["/images/products/perf-goopy-rotor-kit.jpg"]),
      specifications: JSON.stringify([{ label: "Manufacturer", value: "Goopy Performance (Australia)" }, { label: "Engine", value: "13B / 13B-REW / 13B-T" }, { label: "Includes", value: "Apex Seals + Side Seals + Corner Seals + Springs" }, { label: "Material", value: "Hardened Steel (Full Set)" }, { label: "Tier", value: "Sport" }]),
      compatibleVehicles: JSON.stringify(["Mazda RX-7 FC3S 1986-1991", "Mazda RX-7 FD3S 1992-2002"]),
      isActive: false,
      isFeatured: false,
      categoryId: perfCats["perf-rotary-engine"].id,
    },
  ];

  for (const p of sampleProducts) {
    const existing = await prisma.product.findUnique({ where: { sku: p.sku } });
    if (existing) {
      console.log(`  Product already exists: ${p.sku} — skipping`);
    } else {
      await prisma.product.create({ data: p as any });
      newProductSkus.add(p.sku);
      console.log(`✔ Product created: ${p.sku}`);
    }
  }

  // ── Product Variants for Apparel ────────────────────────
  // Only create variants for newly-created apparel products
  console.log("");
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
  for (const sku of newProductSkus) {
    const productColors = colors[sku];
    if (!productColors) continue; // not an apparel product with variants

    const product = await prisma.product.findUnique({ where: { sku } });
    if (!product) continue;

    // Find the original product definition to get the base price
    const allProducts = [...realProducts, ...sampleProducts] as any[];
    const productDef = allProducts.find((p: any) => p.sku === sku);
    const basePrice = productDef?.price ?? product.price;

    for (const size of sizes) {
      for (const color of productColors) {
        const variantSku = `${sku}-${size}-${color.substring(0, 3).toUpperCase()}`;
        const existingVariant = await prisma.productVariant.findUnique({ where: { sku: variantSku } });
        if (existingVariant) continue; // variant already exists

        await prisma.productVariant.create({
          data: {
            productId: product.id,
            name: `${size} / ${color}`,
            sku: variantSku,
            price: basePrice,
            inventory: Math.floor(Math.random() * 30) + 5,
          },
        });
        variantCount++;
      }
    }
  }
  if (variantCount > 0) {
    console.log(`✔ ${variantCount} product variants created`);
  } else {
    console.log("  No new product variants to create");
  }

  // ── Blog Posts ──────────────────────────────────────────
  console.log("");

  const blogPosts = [
    {
      title: "The Rotary Doesn't Forgive Guesswork: A Street-Port Beginner's Guide",
      slug: "street-port-beginners-guide",
      excerpt:
        "What street porting actually changes on a 13B — and why supporting systems matter more than the template.",
      content: `Street porting. The words get thrown around rotary circles like they're an initiation rite — and in a lot of ways, they are. You don't street-port a 13B because you read a forum post and got curious. You do it because you've decided that stock isn't enough, that the engine you've been nursing through oil changes and premix calculations deserves to breathe differently.

But here's the thing nobody tells you at the start: the port template is the least important part of the job.

### What a Street Port Actually Changes

Let's start with the facts, because the rotary internet is full of people who'll tell you a street port turns your FC into a fire-breathing monster and others who'll say it's barely noticeable. The truth sits in between.

A street port widens the intake and exhaust ports on the rotor housings and side plates. Not dramatically — we're talking millimeters. But those millimeters change the timing of when the intake charge enters the combustion chamber and when exhaust exits. The result: more air flows through the engine at the same RPM, and the powerband shifts upward.

On a stock-port 13B, power peaks around 6,500 RPM and falls off hard by 7,200. A properly street-ported 13B pulls cleanly to 8,000 and often beyond. Peak horsepower gains range from 15 to 40 wheel horsepower depending on supporting mods, but the real magic is in the curve. The engine stops feeling like it's running out of breath and starts feeling like it's just waking up when a stock motor would be wheezing.

### The Idle: What to Actually Expect

The thing everyone asks about first. Yes, a street port changes the idle. No, it won't make your car sound like a bridge-ported monster at a drift event.

A mild street port produces a subtle lope — think of it like a heartbeat with a slight arrhythmia. At 850-950 RPM, you'll feel a gentle rocking through the chassis. Passengers who don't know rotaries won't notice it. Rotary people will hear it from across the parking lot and walk over to ask what you're running.

If your idle sounds like the engine is actively trying to shake itself out of the bay, you either went too aggressive on the port or you have a vacuum leak. Street ports don't buck. Bridge ports buck. Know the difference.

### The Powerband Shift

This is where street ports earn their reputation. The stock 13B powerband is gentle — torque builds smoothly, peaks around 4,500, and horsepower climbs linearly. A street-port motor trades some of that low-end smoothness for mid-range punch and top-end pull.

Below 3,000 RPM, a street-ported 13B feels slightly softer than stock. Not broken — just softer. The port overlap that helps top-end flow hurts low-end cylinder filling. If you spend your life below 3,000 RPM, don't port your engine. But if you're the kind of driver who downshifts before a corner to keep the revs above four grand — and if you own a rotary, you probably are — the trade is more than worth it.

From 3,500 to 8,000 RPM, the engine pulls with an urgency that stock motors can't match. The transition onto the secondary turbo feels more seamless because the engine is already moving more air. The throttle response sharpens. The car stops feeling like it's working hard and starts feeling like it's working with you.

### Supporting Mods: What the Template Doesn't Tell You

Here's the part that separates a successful street port from an engine that grenades in six months: the template only shows you where to cut. It tells you nothing about everything else that needs to change.

**Cooling becomes non-negotiable.** More air means more combustion heat. The stock radiator and oil cooler were marginal for a stock engine. For a ported engine making more power, they're inadequate. Budget for an upgraded aluminum radiator, an external oil cooler with thermostat, and a front-mount intercooler if you're turbo. Do not skip this. A single overheat event on a fresh port job can warp the housings and destroy the apex seals you just spent hours setting.

**Fuel delivery must keep up.** The stock injectors and fuel pump are sized for stock airflow. A street port flows 15-25% more air, which means you need 15-25% more fuel. If you're still on the factory fuel system, your engine is running lean at wide-open throttle. Lean means hot. Hot means detonation. Detonation means you're doing the rebuild again, and this time it's not just porting — it's replacing everything the detonation destroyed.

**Engine management is not optional.** The factory ECU cannot compensate for the airflow changes a port introduces. It doesn't know the ports are bigger. It doesn't know the engine is breathing differently. It's spraying fuel based on assumptions that are no longer true. A standalone ECU with a proper tune — Haltech, Adaptronic, Link — is the single most important supporting mod for any ported rotary. The tune is what keeps your apex seals where they belong.

**Ignition needs attention.** More air and fuel in the chamber means more cylinder pressure. The stock ignition system was designed for stock cylinder pressure. An upgraded coil kit provides the stronger spark needed for complete combustion in a ported engine. Incomplete combustion leaves carbon deposits on the rotor faces, which leads to hot spots, which leads to detonation. You see where this is going.

### The Template Itself: What to Look For

When you're choosing a port template — like the FC3S Street Port Template Kit — look for a few things. The template should be made from steel, not plastic or aluminum. It needs to hold its shape when you're running a burr against it at 20,000 RPM. It should include templates for both primary and secondary ports, and ideally for both intake and exhaust. A good kit includes a detailed guide that covers not just where to cut, but how deep, at what angle, and what the finished port should look like.

The carbide burrs matter too. A dull burr tears aluminum instead of cutting it. A burr that's too aggressive removes material faster than you can control. The right burr, running at the right speed, with cutting oil, produces a clean port that flows smoothly. The wrong burr produces a ragged port that creates turbulence and cancels out half the gains you're chasing.

### The Real Cost

A street port isn't just template money. It's template money plus gasket kit money plus coolant money plus oil money plus at least one weekend of the engine being apart. And if you're paying a shop, it's labor money — figure 8-12 hours for a disassemble, port, and reassemble job from a rotary specialist.

Do it right and you've got an engine that pulls harder, revs freer, and sounds better than stock ever could. Do it wrong and you're buying new housings.

The rotary doesn't forgive guesswork. But it rewards preparation more generously than any piston engine I've ever built. Port smart. Support the port. And then go drive it like it was meant to be driven.

**Chase the Horizon.**`,
      tag: "Rotary",
    },
    {
      title: "Before the Boost: The 2JZ Timing Belt Checklist",
      slug: "2jz-timing-belt-checklist",
      excerpt:
        "Every 2JZ-GTE owner should read this before chasing more power. Maintenance first.",
      content: `There's a pattern in the 2JZ world that's as predictable as it is painful. Someone buys a Supra, an Aristo, or a GS300 with a 2JZ-GTE. They immediately start researching turbos. They watch dyno videos at 2 AM. They price out single-turbo kits, fuel systems, and ECUs. And then, three weeks into ownership, at 17 PSI on stock twins, the timing belt lets go.

The engine that Toyota over-engineered into legend status — the iron block, the closed deck, the forged crank — is reduced to a very expensive paperweight because of a sixty-dollar belt that should have been changed 40,000 miles ago.

Before the boost, before the tune, before the single-turbo dreams — do the belt. Here's exactly what to check and what to change.

### Know Your Interval

Toyota's official recommendation for the 2JZ-GTE timing belt replacement is 60,000 miles or 6 years, whichever comes first. This is not a suggestion. This is not a guideline you can stretch because the belt "looks fine." Timing belts degrade with age as much as mileage. A 25-year-old Supra with 45,000 original miles is arguably more at risk than one with 120,000 miles and a documented belt change at 90,000.

If you just bought the car and the previous owner can't produce a receipt showing when the belt was changed — change it. Assume it's original. Assume it's overdue. The cost of a timing belt job is a rounding error compared to the cost of a 2JZ head rebuild after the belt snaps and valves meet pistons at 7,000 RPM.

### The Belt: What to Look For

A timing belt on its way out doesn't always announce itself. Unlike serpentine belts that squeal, timing belts fail quietly — until they don't.

Remove the upper timing cover (it's six 10mm bolts — you can do this in a parking lot with basic tools) and inspect the belt visually. What you're looking for:

**Cracking on the ribbed side.** The teeth of the belt should be smooth and uniform. If you see hairline cracks running perpendicular to the belt's length — especially at the base of the teeth — the rubber is hardening and losing flexibility. Hard rubber breaks.

**Glazing on the smooth side.** A healthy belt has a matte finish on the back. If the back of the belt looks shiny or polished, it's been slipping against the tensioner pulley. Slipping creates heat. Heat degrades rubber. Replace it.

**Missing or deformed teeth.** If any tooth on the belt is shorter than the others, chipped, or missing entirely, the belt has already started to fail. Do not start the engine again until this is addressed. A single skipped tooth is the difference between a running engine and a bent valve.

**Oil contamination.** If the belt is wet with oil — usually from a leaking front main seal or cam seal — it's compromised even if it looks new. Oil softens timing belt rubber and causes it to stretch. A stretched belt jumps teeth. Replace the belt and fix the leak.

### The Tensioner: The Part Nobody Replaces

If you're doing the timing belt, replace the hydraulic tensioner. Every single time. No exceptions.

The 2JZ uses a hydraulic tensioner that applies constant pressure to the tensioner pulley. Over time, the internal seals degrade and the tensioner loses its ability to maintain pressure. You can't visually inspect this — a failed tensioner looks exactly like a working one until it allows the belt to go slack under load.

A slack timing belt flaps between the cam gears at high RPM. The flapping momentarily changes cam timing, which the ECU can't compensate for fast enough, and eventually the belt jumps a tooth — or snaps entirely. The tensioner costs about sixty dollars. The head rebuild costs about three thousand. Do the math.

### The Idler Pulley and Water Pump: While You're In There

The timing belt drives the water pump on the 2JZ. If the water pump bearing is worn, it introduces drag on the belt. If it seizes, it shreds the belt instantly. Either way, you're doing the job twice if you skip it the first time.

Spin the water pump pulley by hand with the belt off. It should spin smoothly with no grinding, no play, and no resistance that feels inconsistent. Any roughness means the bearing is on its way out.

The idler pulley is the smooth-faced pulley that guides the belt between the cam gears. Its bearing is sealed and non-serviceable. Spin it by hand — if it makes noise, if it spins freely with no resistance (a healthy bearing has slight drag from the grease), or if it has any side-to-side play, replace it. The pulley itself is fifteen dollars. The labor to get to it is the same as the belt job.

### The Cam and Crank Seals

While the timing belt is off, you're looking at the front of the engine. The camshaft seals and front main seal are right there, exposed, and they cost less than lunch. If they're original — and on most 2JZs, they are — they're hardened and on the verge of leaking.

A leaking cam seal drips oil onto the timing belt. A leaking front main seal does the same from below. Either one ruins your new belt. Replace all three seals while you're in there. It adds twenty minutes to the job and removes the single most common cause of premature timing belt failure.

### The Water Pump: Worth Replacing?

If the water pump has more than 100,000 miles on it, replace it regardless of how it feels. The 2JZ water pump is driven directly by the timing belt, and a seized pump at highway speed is catastrophic. An OEM Aisin pump costs about a hundred dollars and comes with a new gasket. This is not the place to save money.

### The Reality Check

A full timing belt job on a 2JZ — belt, tensioner, idler, water pump, cam seals, front main seal — costs about $350-500 in parts if you do it yourself, and $800-1,200 at a shop. That sounds like a lot until you remember what a 2JZ-GTE long block costs in 2026. A used engine with unknown history runs $6,000-8,000. A built short block starts at $10,000.

The timing belt is the cheapest horsepower you'll ever buy — because it keeps the horsepower you already have from destroying itself.

Do the maintenance. Then do the boost. In that order.

**Chase the Horizon.**`,
      tag: "2JZ",
    },
    {
      title: "Two A.M. in the Garage: The Build That Became Dream Star",
      slug: "the-build-that-became-dream-star",
      excerpt:
        "A forgotten FC RX-7, a failed first rebuild, and the friends who helped bring a rotary back to life.",
      content: `The FC didn't look like much when I first saw it. It was 2 AM in a storage lot off the 405, the kind of place where cars go to be forgotten. The S4 chassis sat on four flat tires, sun-bleached red paint peeling from the hood, and a layer of California dust so thick you couldn't tell if the glass was tinted or just dirty. The odometer read 147,000. The engine bay was complete but hadn't turned over in six years.

I paid eighteen hundred dollars for it. My girlfriend at the time called it "the worst financial decision you've ever made." She wasn't entirely wrong, but she also wasn't seeing what I was seeing. What I was seeing was a 1987 Turbo II with a straight frame, no rust, and a 13B-T that was going to run again if I had to rebuild it bolt by bolt in that storage lot myself.

Turns out, I almost did.

### The First Tear-Down

The initial plan was simple: drain the old fuel, change the plugs, fresh oil, fresh coolant, new battery, see if it starts. That plan lasted about four hours — long enough to realize that six years of sitting had turned the fuel system into a horror show of varnished lines, a seized pump, and injectors that were never going to fire again no matter how much Seafoam I ran through them.

Fine. I'd rebuild the top end. New injectors. New fuel pump. New lines. While I was in there, I'd do the apex seals — because any rotary that's been sitting that long, you don't trust the seals. You just don't.

I pulled the engine in my parents' garage with a Harbor Freight hoist that I'm still not entirely sure was rated for the weight. I labeled everything with blue painter's tape and a Sharpie. I watched probably forty hours of rotary rebuild videos. I bought a factory service manual on eBay. I was, as far as I knew, prepared.

### The Mistake

The first rebuild failed. Spectacularly.

I got the engine back together in about three weeks — nights and weekends, working under a single fluorescent light that buzzed loud enough to give you a headache after an hour. New apex seals, new side seals, new corner seals, new springs. Everything torqued to spec. Everything assembled with assembly lube and prayers.

The engine started on the third crank. It idled. It revved. And then, about forty-five seconds in, the oil pressure gauge dropped to zero and the engine made a sound I will never forget — a metallic shriek, like someone dragging a fork across a chalkboard, but coming from inside the block.

I shut it down immediately. Too late. The damage was done.

Tear-down number two revealed the mistake: when I'd installed the front stack, I'd pinched the oil control ring on the front rotor. It wasn't visible on assembly, but under load and heat, the pinched ring had shattered, sending hardened steel fragments through the oil passages and into the front bearing. The front stationary gear bearing had spun, scoring the e-shaft, and the front iron was galled beyond repair.

The engine I'd spent three weeks building had destroyed itself in less than a minute.

### The Part Where It Gets Better

I sat in the garage — now 3 AM, because failures always seem to happen in the small hours — staring at the engine on the stand, wondering how I was going to afford replacement irons and an e-shaft on a parts-store counter salary. I was twenty-four years old, genuinely broke, and sitting next to twelve hundred pounds of scrap metal that I'd pretended was going to be a car.

And then my phone buzzed. It was Kevin.

Kevin was a guy I'd met at a local Cars & Coffee six months earlier. He drove an FD that he'd built himself, and he'd given me his number with the kind of casual generosity that rotary people seem to have in abundance. "If you ever need help with that FC, call me," he'd said. I hadn't planned to call him at three in the morning, but I also hadn't planned to destroy an engine.

I sent him a text: "Think I just killed my 13B."

He called back in under a minute.

### The Crew

What happened next is the reason Dream Star exists. Kevin showed up the next weekend with a spare set of front and rear irons from a parts engine, an e-shaft he'd been saving for a build that never materialized, and a friend named Marcus who apparently "knows more about rotaries than Mazda's engineering department." Marcus brought his own torque wrench, which he described as "calibrated by God himself," and a cooler full of Modelo.

For the next eight weekends, my parents' garage became a workshop. Kevin taught me how to properly set end play. Marcus walked me through every clearance measurement, explaining not just what the spec was but why it mattered — what happens when it's too tight, what happens when it's too loose, what the failure mode looks like. My neighbor Dave, who owned a plumbing business and had never touched a Japanese car in his life, welded a broken exhaust stud for me at 10 PM on a Tuesday because he "couldn't stand watching me struggle with a bolt any longer."

The second rebuild took three times as long as the first. It was methodical, deliberate, and checked by people who'd made the same mistakes and learned from them. When we finally turned the key, the engine caught on the first crank again — but this time, the oil pressure climbed to 65 PSI and stayed there. The idle smoothed out. The temperature gauge settled at 190 and didn't move. Kevin pulled the dipstick, checked the oil, and said, "That's what it's supposed to sound like."

### What It Taught Me

That FC never became a show car. It never put down big dyno numbers. The paint stayed faded. The interior stayed cracked. But it ran, and it drove, and it made the sound that only a rotary makes — that rising, spinning wail that climbs past 7,000 RPM like it's personally offended by redlines.

More importantly, it taught me something that took years to fully understand. Building cars isn't really about the cars. It's about the people who show up when you're sitting on a garage floor at 3 AM, staring at a broken engine, wondering if you've made the most expensive mistake of your life. It's about the friend who drives forty miles with spare irons in his trunk. The stranger at Cars & Coffee who gives you his phone number before he even knows your last name. The neighbor who can't tell a rotary from a piston engine but welds your exhaust stud anyway because that's what neighbors do.

Dream Star Drivers Club started in that garage. Not when the engine finally ran, but somewhere in between — during the second rebuild, when four people who barely knew each other a year earlier were standing around an engine stand, passing tools, telling stories, and building something together.

The name came later. The brand came later. But the club — the real one, the one that exists in parking lots and garages and group chats and late-night text threads — was born right there, in the mess and the oil stains and the fluorescent light buzz.

### Why We're Still Here

I still have that FC. It's on its third engine now, and the paint is somehow worse than when I bought it. Kevin and Marcus are still the first people I text when something breaks. The club has grown beyond that garage — there are Dream Star drivers in a dozen states now, and the group chat has more people than I can keep track of — but the spirit hasn't changed.

We're still the people who show up. We're still the people who answer the phone at 3 AM. We're still the people who know that the best things in life are usually the ones that almost didn't happen, saved by friends who wouldn't let you quit.

If you're reading this and you're in the middle of your own 3 AM garage moment — the failed rebuild, the seized bolt, the part that doesn't fit, the mistake you didn't see coming — keep going. Call someone. Ask for help. The rotary community, the JDM community, the car community — we've all been there. We've all sat on that floor. And we're all still here because someone answered the phone.

That's Dream Star. Not the logo. Not the products. The people.

**Chase the Horizon.**`,
      tag: "Culture",
    },

    {
      title: "The 13B Rotary Engine: A Rebel's Guide to Maintenance & Mods",
      slug: "13b-rotary-engine-maintenance-mods-guide",
      excerpt:
        "The 13B rotary isn't just an engine — it's a declaration. From apex seal failures to bridge-port screams, this is your complete guide to keeping the triangle spinning, whether you're daily-driving an FC or building an FD for the touge.",
      content: `There are two kinds of people in the car world: those who get the rotary, and those who haven't heard one at 9,000 RPM yet.

The 13B doesn't ask for your understanding. It doesn't care about your torque curve spreadsheet, your piston-count loyalty, or your friend who "knew a guy whose RX-7 blew up." It exists in its own category — a piece of engineering so stubbornly different that Mazda spent four decades refining it while the rest of the industry pretended it didn't exist.

If you're reading this, you're probably already in the first camp. Or you're standing at the edge of it, rotary-shaped rabbit hole open beneath your feet. Either way: welcome. This is the guide I wish someone had handed me the first time I pulled a 13B apart in a garage that smelled like premix and bad decisions.

### A Quick History — Or: Why This Engine Exists At All

Felix Wankel's rotary design wasn't supposed to power sports cars. It was supposed to be a smooth, compact alternative to piston engines — quiet, refined, utterly boring. Then Mazda's engineers got hold of it.

The 13B arrived in 1973, but it was the twin-turbo 13B-REW in the third-generation FD RX-7 that cemented its legend. 255 horsepower from 1.3 liters — in 1992. Sequential twin turbos. A redline that climbed past 8,000 RPM like it was offended by lower numbers. The 13B wasn't just an engine. It was a middle finger to convention, wrapped in a lightweight chassis and pointed at a mountain pass.

The 13B has appeared in multiple forms: the 13B-T (single turbo, FC3S Turbo II), the 13B-REW (twin-turbo, FD3S), the 13B-MSP Renesis (naturally aspirated, RX-8), and countless hybrid builds that enthusiasts have cooked up in garages across the world. Each variant has its own quirks, but the fundamentals — the triangle, the housings, the apex seals, the need for oil metering — remain constant across every generation.

### What Kills a Rotary (And What Keeps It Alive)

Let's address the elephant in the garage. Rotaries have a reputation for unreliability, and like most reputations, it's equal parts truth and misunderstanding.

**The real failure points:**

**Apex seals.** These are the sliding seals at each tip of the triangular rotor. They're under constant friction against the housing surface, and when they fail — either from detonation, overheating, or simple wear — you lose compression and the engine stops making power. A blown apex seal is the rotary equivalent of a thrown rod. It's catastrophic, and it's the single most common cause of rotary engine failure.

**Cooling.** Rotaries run hot. The combustion chamber shape and the way heat concentrates in the housing means cooling is not optional — it's existential. A single overheat event can warp housings and destroy apex seals. If you remember nothing else from this article: watch your temperature gauge like your engine's life depends on it. Because it does.

**Oil.** Rotaries burn oil by design. The oil metering pump injects a small amount of oil into the combustion chamber to lubricate the apex seals. This is not a flaw — it's how the engine works. But it means you must check your oil. Every fill-up. Without exception. Run a rotary low on oil and you're grinding apex seals against dry housings. There's no coming back from that.

**Carbon buildup.** If you drive a rotary gently — short trips, low RPM, never letting it stretch its legs — carbon deposits accumulate on the rotor faces and housings. A rotary that never sees redline is a rotary slowly choking itself to death. The cure? Drive it. Hard. An Italian tune-up isn't just fun in a rotary — it's maintenance.

### The Maintenance Schedule That Actually Matters

Forget what the owner's manual says. Here's what the community has learned through decades of trial, error, and blown engines:

**Every fill-up:** Check oil level. Top off as needed. Use quality conventional or synthetic blend — full synthetic is divisive in rotary circles; many builders recommend against it for street-driven engines because it doesn't burn as cleanly.

**Every 3,000 miles:** Oil change. No exceptions. The rotary's oil system works harder than a piston engine's, and the oil is constantly being consumed. Fresh oil, fresh filter, every 3K. Consider premixing — adding two-stroke oil to your fuel tank at roughly 1 oz per gallon. It provides additional apex seal lubrication independent of the OMP and is cheap insurance.

**Every 15,000 miles:** Spark plugs. Rotaries are hard on plugs. The leading and trailing plugs each see different conditions, and a fouled plug can cause misfires that lead to detonation. NGK is the standard. Don't cheap out on plugs.

**Every 30,000 miles:** Coolant flush. Remember what I said about cooling. Fresh coolant, proper burping procedure (rotaries trap air like nothing else), and visually inspect every hose. A burst coolant hose on a mountain run isn't a roadside inconvenience — it's an engine rebuild.

**Compression test — annually or before any major mod:** A rotary compression test is different from a piston engine test. You need a specialized tester that measures compression in three distinct pulses per rotor face. Anything below 85 PSI across all faces is cause for concern. Uneven numbers between rotor faces suggest a failing apex seal. Catch it early and you're looking at a seal replacement. Catch it late and you're looking at a housing.

### Performance Mod Tiers: Street, Sport, Race

Building a rotary isn't like building a piston engine. The upgrade path is narrower, the tolerances are tighter, and the consequences of getting it wrong are louder and more expensive. Here's how to approach it.

#### Tier 1: Street — Reliability First (250–350 whp)

Before you add power, you make sure the engine can survive it. This tier is about building a foundation.

- **Upgraded cooling:** A larger aluminum radiator, an oil cooler upgrade, and an efficient intercooler. The stock FD cooling system is adequate for stock power. It is not adequate for anything more. Start here.
- **Ignition upgrade:** The IGN-1A smart coil kit replaces the factory coils with units that produce a stronger, more consistent spark. Better ignition means more complete combustion, which means less carbon buildup and more power from the same fuel.
- **Fuel pump:** The Walbro 450LPH in-tank pump flows enough for 700+ whp and is E85 compatible. Even if you're not chasing big numbers yet, a healthy fuel system prevents the lean conditions that cause detonation.
- **Engine management:** A Haltech Elite 1500 standalone ECU gives you full control over fuel, ignition, boost, and safety parameters. The factory ECU was brilliant in 1992. It is not brilliant anymore. A modern ECU with a proper tune is the single best investment you can make in rotary reliability.

#### Tier 2: Sport — The Sweet Spot (350–500 whp)

Now you're building something that can genuinely scare Porsches on a back road. This is the tier where the 13B truly shines — responsive, rev-happy, and capable of sustained hard driving.

- **Street port:** A mild port job widens the intake and exhaust ports, improving airflow without sacrificing drivability. The FC3S Street Port Template Kit gives you everything you need if you're doing it yourself — templates, carbide burrs, and a detailed guide. A street-ported rotary still idles cleanly, still starts easily, and still pulls smoothly from low RPM. It just pulls harder everywhere.
- **Apex seal upgrade:** Cryo-treated steel apex seals handle more heat and more RPM than stock. For dedicated track builds, Goopy ceramic apex seals offer lower friction and can sustain operation beyond 10,000 RPM. Choose based on your use case — steel for mixed street/track duty, ceramic for dedicated race cars.
- **Single turbo conversion:** The FD's sequential twin setup is charming when it works and infuriating when it doesn't. The FD3S Single Turbo Conversion Kit replaces the complexity with a BorgWarner EFR 8374, a tubular manifold, and a TiAL wastegate. Simplified plumbing, broader powerband, and linear boost delivery. It transforms the car.

#### Tier 3: Race — Full Send (500+ whp)

Beyond 500 horsepower, you are operating in territory where every component is stressed to its limit. This is not a street car anymore. This is a weapon.

- **Bridge port or peripheral port:** Aggressive porting that pushes the powerband higher and sacrifices low-end manners for top-end fury. A bridge-ported 13B at full song is one of the most intoxicating sounds in motorsport. It's also loud, thirsty, and demands race fuel or E85.
- **Full rotor seal kit:** The Goopy Full Rotor Seal Kit replaces every seal in the engine — apex, side, corner, and springs. At this power level, stock seals are a liability.
- **Fuel system overhaul:** ID 1050x injectors, upgraded fuel rails, an external pressure regulator, and a surge tank. E85 is essentially mandatory at this tier — the cooling properties of ethanol help control combustion temperatures that would destroy a pump-gas tune.
- **Drivetrain:** An OS Giken twin-plate clutch holds the torque. Stock axles and differential may need upgrades depending on how hard you launch.

### The Rotary Community: Knowledge Is Your Best Mod

One thing the rotary community has in spades that no parts catalog can sell you: hard-won knowledge. The forums may be quieter than they were in 2005, but the RX-7 Club archives contain decades of build threads, troubleshooting, and hard-won wisdom. Facebook groups connect owners across continents. And at every Cars & Coffee, every track day, every late-night parking lot meet, you'll find someone who's been where you are and is happy to talk about it.

The rotary was never supposed to last this long. It was too different, too demanding, too unwilling to compromise. But here we are, decades later, still premixing, still watching temperature gauges, still chasing that rising, spinning wail that no piston engine can replicate.

The 13B wasn't designed for everyone. It was designed for the people who understand that the best things in life require a little extra attention, a little extra care, and a willingness to accept that sometimes, things break.

And you fix them. And you drive.

**Chase the Horizon.**`,
      tag: "rotary",
    },
    {
      title: "2JZ-GTE: Why the Legend Still Rules JDM Culture",
      slug: "2jz-gte-legend-jdm-culture-build-guide",
      excerpt:
        "Three decades later, the Toyota 2JZ-GTE still sets the standard for inline-six performance. From stock twin-turbo sophistication to 1,000-horsepower monsters, here's why this engine earned its crown — and what it takes to build one right.",
      content: `Some engines earn their reputation on paper. Others earn it in magazine features, quarter-mile time slips, and the collective memory of an entire generation of enthusiasts.

The 2JZ-GTE earned it by surviving everything anyone threw at it and asking for more.

When Toyota dropped the 2JZ-GTE into the fourth-generation Supra in 1993, they weren't trying to build a legend. They were building a grand tourer with a sophisticated twin-turbo inline-six — smooth, powerful, refined. 276 horsepower on paper, though anyone who's ever put one on a dyno knows that number was a gentleman's agreement, not a measurement. The real figure was closer to 320. And the engine itself? Capable of double that without opening the block.

Three decades later, the 2JZ hasn't just survived — it's thrived. It's been swapped into everything from IS300s to 240SXs to boats (really). It's powered drift cars, drag cars, time attack cars, and street cars that blur the line between all three. And it's still, somehow, raising the bar.

### The Architecture of Over-Engineering

What makes the 2JZ special isn't any single feature — it's the combination of decisions Toyota made that, in hindsight, look less like engineering and more like a gift to the aftermarket.

**The iron block.** In an era when manufacturers were chasing weight savings with aluminum, Toyota cast the 2JZ block in iron. It's heavy. It's also virtually indestructible. The block has been proven to handle north of 1,500 horsepower without reinforcement. The main bearing caps, the cylinder walls, the deck surface — all were built to tolerances that anticipate abuse the factory never intended.

**The closed-deck design.** The cylinders are fully supported at the top by the deck surface, unlike open-deck designs where cylinders float in the cooling jacket. This means the cylinder bores stay round under extreme cylinder pressure. It's why 2JZ engines don't crack cylinder walls the way lesser blocks do.

**The head and valvetrain.** The 24-valve DOHC head flows remarkably well from the factory. The stock cams are mild enough for smooth idle and strong mid-range, and the valvetrain is stable past 8,000 RPM with nothing more than upgraded springs. Combine that with the factory oiling system — which includes piston oil squirters that spray the underside of the pistons with cooling oil — and you have an engine that was designed with thermal management that most aftermarket builds can't improve on.

**The sequential twin-turbo system.** The stock CT12B twin-turbo setup was ahead of its time in 1993. A small turbo spools instantly for low-end response; a second joins in at higher RPM for top-end flow. The transition point is seamless when everything is working correctly. The system's complexity is its Achilles' heel — vacuum lines, actuators, and check valves that degrade with age — but the concept was brilliant.

### Stock Limitations (Where Even Legends Have Ceilings)

The 2JZ isn't perfect. It's just closer to perfect than almost anything else from its era. Here's what holds it back in stock form:

**The turbochargers.** The CT12B twins are the first bottleneck. They run out of efficiency around 16-18 PSI and produce significant exhaust backpressure beyond that. The ceramic turbine wheels — yes, Toyota used ceramic — are fragile and can fail catastrophically if overspun. If your 2JZ is still on stock twins, keep the boost conservative. Really conservative.

**The fuel system.** Stock 440cc injectors run out of headroom around 400-420 horsepower at the crank. The factory fuel pump is adequate for stock power and not one horsepower more. Any serious build starts with fuel.

**The intercooler.** The factory side-mount intercooler is small and heat-soaks quickly. On a warm day, after a single pull, intake air temperatures climb into territory where the ECU starts pulling timing. An upgraded front-mount intercooler is one of the first mods anyone should make, even on an otherwise stock engine.

**The ECU.** The factory ECU was sophisticated for 1993. It is not sophisticated anymore. It cannot be tuned without a piggyback or standalone. It cannot compensate for larger injectors. It has no flex-fuel capability. It is, effectively, the single biggest constraint on any 2JZ build.

### Build Stages: From Stock to Skyline Material

#### Stage 1: "BPU" — Basic Performance Upgrades (380–430 whp)

BPU is 2JZ shorthand for "Basic Performance Upgrades," and it's the most proven recipe in the platform's history. The formula is simple, repeatable, and has been validated by thousands of owners:

- **Downpipe:** A 3-inch catless or high-flow catted downpipe removes the biggest exhaust restriction. This alone is worth 20-30 horsepower on stock boost.
- **Cat-back exhaust:** 3-inch or larger, mandrel-bent. The 2JZ has a voice — let it speak.
- **Front-mount intercooler:** Ditch the side-mount. A quality bar-and-plate intercooler keeps intake temps in check through repeated pulls.
- **Boost controller:** Raise boost to 16-18 PSI on the stock twins. This is the ceiling for the ceramic turbines. Do not exceed it unless you're prepared to replace a turbo.
- **Fuel pump:** A Walbro 450LPH in-tank pump flows enough for any future build stage. Install it once, never think about it again.
- **Wideband O2 sensor:** An AEM wideband gauge lets you monitor air/fuel ratios in real time. This is not optional. A lean condition kills engines. A wideband is the difference between catching it and rebuilding it.

At BPU levels, the 2JZ is genuinely fast — not by vintage standards, but by modern standards. It'll walk away from a new Mustang GT on the highway. It'll make passengers grab the door handle. And it'll do it with the kind of effortless, turbine-smooth power delivery that turbo four-cylinders can only dream of.

#### Stage 2: Single Turbo Conversion (500–800 whp)

This is where the 2JZ separates itself from everything else on the road. A single turbo conversion simplifies the engine bay, removes the sequential twin complexity, and unlocks the power band the engine was always capable of.

- **Turbo selection:** A BorgWarner EFR or Garrett T04Z in the 62-72mm compressor range hits the sweet spot for a responsive street car. Expect full boost by 3,500-4,000 RPM and power that pulls hard to redline. A 67mm turbo on a built 2JZ makes 600-700 whp on pump gas and 800+ on E85.
- **Fuel system overhaul:** ID 1050x injectors (1050cc) provide enough headroom for E85 at 700+ whp. Upgraded fuel rails, an adjustable pressure regulator, and a surge tank round out the system.
- **ECU:** A Haltech Elite 1500 or equivalent standalone gives you full control over fuel, ignition, boost-by-gear, flex-fuel blending, traction control, and every safety parameter. A good tune on a standalone ECU is worth more horsepower than any bolt-on part.
- **Clutch:** The stock clutch surrenders around 400 lb-ft. An OS Giken twin-plate holds 600+ and remains streetable.
- **Head studs and head gasket:** The stock head gasket is reliable to about 700 whp with proper tuning. ARP head studs are cheap insurance. For 800+, a metal head gasket is mandatory.

At Stage 2, the car is a legitimate supercar killer. 600 whp in a 3,400-pound chassis produces a power-to-weight ratio that rivals modern Ferraris. The difference is that when the Ferrari breaks, you're calling a flatbed to Maranello. When the 2JZ breaks — which it probably won't — you're calling your buddy with an engine hoist.

#### Stage 3: Built Motor (800–1,200+ whp)

Beyond 800 horsepower, you're building the engine. Not modifying it — building it.

- **Forged pistons and rods:** The stock bottom end is legendary, but it has limits. Forged internals with lower compression (9.0:1 or 9.5:1) allow for more boost, more timing, and more safety margin on pump gas or E85.
- **Billet main caps:** The stock main caps can walk under extreme cylinder pressure. Billet caps keep the crankshaft where it belongs.
- **Port and polish:** The 2JZ head flows well stock, but at this level every CFM matters. A quality port job with oversized valves unlocks top-end flow.
- **Cams:** 264° or 272° duration cams shift the powerband higher without destroying idle quality. Choose based on your turbo — larger turbos want more cam to breathe at high RPM.
- **Fuel system:** At 1,000+ whp, you're looking at 2,000cc+ injectors, multiple fuel pumps, and possibly a mechanical fuel pump. E85 is non-negotiable. Pump gas can't support this power level safely.
- **Drivetrain:** The Getrag V160/V161 six-speed is strong, but at this level, even it needs attention. The differential, axles, and driveshaft all become consumables.

Stage 3 cars are not street cars in the traditional sense. They're statements. They're rolling proof that an inline-six designed in the early 1990s can compete with — and beat — modern hypercars in a straight line.

### What the 2JZ Means Beyond the Numbers

Here's the thing about the 2JZ that spec sheets don't capture: it's a cultural artifact as much as an engine. It's the sound of a Supra spooling through a tunnel in a YouTube video you watched at 2 AM. It's the poster on your friend's bedroom wall in 1999. It's the reason a clean MK4 Supra costs more than a new GR Supra.

The 2JZ earned its legend the hard way — not through marketing, but through proving grounds. Drag strips. Highway pulls. Dyno sessions that ended with numbers that made the tuner call his friends. It's an engine that rewards ambition and punishes shortcuts. Every corner cut in a 2JZ build will eventually find you. Every quality part installed correctly will reward you with reliability that shouldn't be possible at this power level.

Toyota doesn't make the 2JZ anymore. The supply of clean blocks is finite. The knowledge is scattered across aging forums and the memories of builders who've been doing this for decades. But the engine itself — the iron block, the closed deck, the over-engineered valvetrain — is as relevant today as it was in 1993. More relevant, arguably, because we now know exactly what it can do.

The 2JZ doesn't need defending. It doesn't need hype. It just needs good parts, good tuning, and an owner who respects what they're working with.

Do that, and you're not driving a 30-year-old Toyota. You're driving a legend that's still writing its story.

**Chase the Horizon.**`,
      tag: "2jz",
    },
    {
      title: "Essential Gear for Your Next Cars & Coffee",
      slug: "essential-gear-cars-and-coffee-guide",
      excerpt:
        "Cars & Coffee isn't just a meet — it's a ritual. From the 6 AM detail session to the parking lot conversations that outlast the coffee, here's what to wear, what to bring, and how to show up right.",
      content: `There's a moment at every Cars & Coffee that has nothing to do with cars.

It's 7:15 AM. The sun is still low, still that golden angle that makes every paint color look like a factory brochure photo. The parking lot is half-full. Someone's idling a bridge-ported 13B in the back corner — that distinctive, choppy lope that says *I woke up earlier than you and I've already checked my oil*. Coffee cups are out. Hoods are starting to open. And for the next three hours, nobody's in a hurry.

This is the ritual. And like any ritual, how you show up matters.

### What to Wear: The Unspoken Dress Code

Nobody at Cars & Coffee is going to hand you a dress code. That's not how this works. But there are languages spoken in parking lots, and what you wear is one of them.

**The tee.** Not any tee. A heavyweight tee. 220 GSM cotton. Something that feels substantial when you pull it on at 5:45 AM and the garage is still cold. The Dream Star Hoshi crew neck is the move — bold graphic, premium cotton, no branding that screams at people. It says *I'm here for the cars, but I didn't roll out of bed five minutes ago*. If you prefer clean and understated, the classic DS crew neck in black or charcoal does the same job with less noise.

**The layer.** Even in summer, mornings are cold. And half the meet takes place before the sun clears the buildings. A windbreaker is practical in a way that hoodies aren't — it packs down, it doesn't add bulk, and it comes off in two seconds when the temperature climbs. The Dream Star windbreaker in black with the logo across the back is water-resistant and light enough to forget you're wearing it. Keep one behind the passenger seat year-round. You'll use it more than you think.

**The accessory nobody talks about.** A lanyard. Hanging from your rearview mirror, catching the morning light at every corner. It's small. It's subtle. But the Dream Star black-and-red lanyard is a signal — a tiny flag that says *I'm part of something*. Park next to someone with the same lanyard and you've already got a conversation starter.

### What to Bring: The Kit

Walk through any Cars & Coffee and you'll notice a pattern. The people who look relaxed? They brought things. The people who look stressed? They're asking to borrow things.

**A real keychain.** Not the free one from the dealership. Something with weight. The DS metal key chain — zinc alloy, gunmetal finish, laser-etched logo — has enough heft to actually find your keys in a jacket pocket. More importantly, it jingles against the steering column when you're running through gears. Small thing. Big difference.

**Stickers.** Bring extras. Not for your car — for someone else's. A kid is going to be staring at your FC with eyes the size of brake rotors. Hand them a Hoshi die-cut sticker and you've just made a future enthusiast. This is how the culture continues. A five-inch vinyl sticker costs less than a coffee and lasts longer than any Instagram post.

**An air freshener.** Not the tree-shaped kind that assaults your nose. The Hoshi air freshener three-pack — Cherry Blossom, New Car, Midnight Forest — hangs from the rearview without screaming for attention. And if someone leans in to check out your interior and catches a hint of cherry blossom instead of last week's track day, that's a win.

**A phone charger.** Your phone will die. You'll be taking photos of engine bays, posting to Instagram, texting your friend who's "five minutes away" for the last forty minutes. Bring a cable. Bring a battery pack. The one morning you don't is the morning a R34 GT-R shows up unannounced and you're stuck describing it with words.

### How to Prep Your Car

The car people who show up at 6:45 AM with a spotless car didn't wash it that morning. They washed it the night before, spent 45 minutes on the wheels, and did a quick detail spray in the parking lot. This is the way.

**The night before:** Wash, dry, and do the wheels properly. Wheel faces, barrels, lug nuts — everything. Wheels are what people notice first. If your wheels are clean, the rest of the car reads as intentional. If they're not, nothing else matters.

**The morning of:** Quick detail spray on the front bumper — that's where the bugs from the drive over will collect. Microfiber on the glass. Check tire pressures. Check oil (especially if you're rotary — you already know).

**The decal that matters:** A Dream Star rear window decal — 18 inches wide, matte black, precision-cut — is visible from across a parking lot. It doesn't shout. It doesn't need to. It's the kind of detail that someone notices, nods at, and mentally files away.

### The Unspoken Rules

Every Cars & Coffee has a culture. The specific crowd changes by city, by season, by which cars happen to show up. But the rules are universal:

**Respect the exit.** When someone is leaving, clear a path. Don't stand in the lane filming. Don't encourage them to rev. They're trying to navigate a crowd of pedestrians in a car with a clutch that cost more than your first car. Let them leave clean.

**Don't touch.** Unless someone explicitly invites you to sit in their car, hands stay in pockets. This applies to paint, interior, engine bay, and especially the carbon fiber. You know this. But it bears repeating.

**The rev is earned.** Revving in the parking lot is not a right — it's a request. And it's only granted when the crowd is right, the exit is clear, and someone credible asks. Unsolicited revving is the fastest way to become the person everyone avoids.

**The coffee is secondary.** Nobody is here for the coffee. The coffee is an excuse. What we're really here for is the conversations — the stranger who knows more about your engine than you do, the kid who's never seen a rotary in person, the builder who tells you exactly which vacuum line is causing your idle surge. These conversations can't be scheduled. They happen because a parking lot full of enthusiasts creates a gravity that pulls the right people together.

### The Drop That Fits the Vibe

The best gear for Cars & Coffee isn't the loudest. It's the stuff that fits the ritual — quality materials, clean design, details that reward a second look.

The Dream Star rear window decal signals the club. The metal keychain jingles against the wheel at every corner. The lanyard hangs from the rearview catching the sunrise. The Hoshi sticker pack goes to the kid who's going to go home, put it on his laptop, and start saving for his own project car.

None of it is loud. None of it needs to be. Cars & Coffee is a culture of signals — small things that say *I belong here*. The gear is just the language.

**Chase the Horizon.**`,
      tag: "lifestyle",
    },
    {
      slug: "rotary-revival-13b-still-matters",
      title: "Rotary Revival — Why the 13B Still Matters",
      excerpt:
        "The rotary engine was declared dead more times than anyone can count. But in garages across the world — late at night, with premix in the air and a timing light in hand — the 13B refused to quit. Here's why it still matters, and why it always will.",
      content: `The first time you hear a bridge-ported 13B clear its throat at 4,000 RPM, something rewires in your brain.

It's not the sound of a piston engine waking up — that familiar, predictable churn of reciprocating mass. This is different. This is a rising, spinning wail that builds like a turbine and screams like nothing else on pavement. By 8,500 RPM, you're not listening to an engine anymore. You're listening to a declaration.

And if you've been around rotaries long enough, you've also heard the other sound. The one that comes after. The silence of a popped motor. An apex seal that let go at the worst possible moment. Steam rising from a hood that won't close on a night that was supposed to be about canyon runs, not tow trucks.

We've all heard it. Some of us have caused it.

But here's the thing: the 13B is still here. Against every prediction, every forum post declaring the rotary dead, every "just LS swap it" comment from someone who never turned a wrench on a Dorito — the 13B is still spinning. And in 2026, it matters more than ever.

## The Dark Days

There was a stretch where it genuinely felt like the end. Mazda had stopped producing rotary engines. Rebuild parts were drying up. The knowledge base was aging out — old-timers retiring, forums going dark, Facebook groups fragmenting into noise. You couldn't just walk into a dealership and order rotor housings anymore. If you blew a motor, you were at the mercy of whatever was left on the shelves.

People started talking about the rotary in past tense. Legacy engine. Historical footnote. A fascinating dead end.

But they underestimated something. They underestimated the people who'd spent their weekends in garages that smelled like premix and ambition. The ones who'd ported their own housings with a die grinder and a prayer. The ones who understood that the rotary wasn't just an engine — it was an obsession.

The community didn't let the 13B die. It couldn't. Because once that sound gets in your head, there's no going back to pistons.

## The Modern Rotary Landscape

Here's what the obituary writers missed.

Aftermarket support for the 13B is better right now than it's been in a decade. Not just surviving — improving. Companies are producing new apex seals with metallurgy that wasn't available in the 90s. CNC-ported housings with tolerances that make hand-porting look like cave drawings. Standalone ECUs that give tuners control Mazda's factory engineers could only dream about. E85 conversions that let you push timing further while keeping EGTs in check. Ceramic-coated rotors. Billet oil pump gears. The list goes on.

A properly built 13B today — street-ported, tuned on a Haltech or Link, fed good premix and treated with respect — is more reliable than the internet mythology would have you believe. The engine didn't change. The support around it did. We stopped guessing and started measuring. We stopped treating rebuilds like dark art and started treating them like precision engineering.

The bridge port that was radical in 2003 is a known quantity now. The peripheral port that was "race only" has been tamed for the street by people smarter than me. The turbo setups that used to grenade motors because of bad wastegate placement and worse tuning now make reliable power with modern boost control and ethanol.

The 13B isn't a dinosaur. It's a platform that the aftermarket finally caught up to.

## It's Not Rational. That's the Point.

You can build a K-series that makes more power per dollar. You can LS swap anything with an engine bay and a dream. These are facts. Nobody's arguing them.

But nobody ever loved a rotary because it was rational.

You love it because of what it does to you at 9,000 RPM. You love it because it weighs nothing and sits behind the front axle like Mazda's engineers understood something about physics that everyone else forgot. You love it because pulling the motor out of an FC takes four bolts, some choice words, and an afternoon. You love it because the first cold start after a rebuild — when the oil pressure climbs and the idle settles into that unmistakable lope — is one of the most satisfying moments you'll ever experience in a garage.

You love it because nothing else sounds like it. Nothing else revs like it. Nothing else feels like it.

That's not a spec sheet argument. That's an emotional one. And it's the only one that matters.

## Where Dream Star Fits

We didn't build Dream Star Drivers Club because we wanted to sell T-shirts. We built it because we believe in this engine. We believe in the community that refused to let it die. We believe in the guy at 2 AM in a single-bay garage, premix in the air, drop cord swinging, apex seals laid out on a clean towel because this time — this time — everything is going to be perfect.

Our DS Performance line exists because we've been that guy. We know what it's like to need a part that doesn't exist in a catalog. We know what it's like to machine your own solution because the aftermarket let you down. We're here to make sure the next builder doesn't have to fight that fight alone.

The apparel? The accessories? That's for the culture. That's so when you're walking through a parking lot and someone sees the rotary triangle on your chest, they know. No explanation needed.

## Keep It Spinning

The 13B isn't a museum piece. It's not a chapter in a history book. It's alive right now — in FCs and FDs howling through canyon passes, in RX-8s surprising people at track days, in garage builds that are three years behind schedule and absolutely worth the wait.

The rotary community is small. It always has been. But small doesn't mean weak. Small means tight. Small means when someone in your area posts that their motor popped, you show up with tools and takeout because you've been there and someone showed up for you.

So keep premixing. Keep porting. Keep explaining to your passengers that no, the engine isn't broken, it's just bridge-ported. Keep proving the obituary writers wrong.

The 13B still matters. Not because it's efficient. Not because it's practical. Not because it makes sense on a spreadsheet.

Because when the tach hits 8,500 and the exhaust note bounces off the canyon walls and everything in the world narrows down to the machine beneath you and the road ahead — there is nothing else like it. There never was. And as long as there are people willing to wrench late into the night to chase that feeling, there never will be.

**Dream Star Drivers Club is here for it. Are you?**`,
      tag: "Rotary",
    },
  ];

  for (const post of blogPosts) {
    const existing = await prisma.post.findUnique({ where: { slug: post.slug } });
    if (existing) {
      console.log(`  Blog post already exists: ${post.slug} — skipping`);
    } else {
      await prisma.post.create({
        data: {
          ...post,
          published: true,
          publishedAt: new Date(),
        },
      });
      console.log(`✔ Blog post created: ${post.slug}`);
    }
  }

  // ── Coupons ─────────────────────────────────────────────
  console.log("");
  const couponW10 = await prisma.coupon.findUnique({ where: { code: "WELCOME10" } });
  if (!couponW10) {
    await prisma.coupon.create({
      data: {
        code: "WELCOME10",
        discountType: "PERCENTAGE",
        discountValue: 10,
        minOrderAmount: 25.00,
        maxUses: 1000,
        currentUses: 0,
        isActive: true,
        expiresAt: new Date("2027-12-31"),
      },
    });
    console.log("✔ Coupon created: WELCOME10 (10% off)");
  } else {
    console.log("  Coupon already exists: WELCOME10 — skipping");
  }

  const couponFS = await prisma.coupon.findUnique({ where: { code: "FREESHIP" } });
  if (!couponFS) {
    await prisma.coupon.create({
      data: {
        code: "FREESHIP",
        discountType: "FIXED",
        discountValue: 0,
        minOrderAmount: 75.00,
        maxUses: 500,
        currentUses: 0,
        isActive: true,
        expiresAt: new Date("2027-12-31"),
      },
    });
    console.log("✔ Coupon created: FREESHIP (free shipping over $75)");
  } else {
    console.log("  Coupon already exists: FREESHIP — skipping");
  }

  console.log("\n✅ Seed complete (idempotent — safe to run anytime)!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
