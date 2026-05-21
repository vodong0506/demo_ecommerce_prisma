declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace PrismaJson {
    type ProductVariantSnapshotType = { id: number; price: string };
  }
}

// This file must be a module.
export {};
