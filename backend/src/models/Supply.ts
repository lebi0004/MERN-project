import { Schema, model, Document } from 'mongoose';

export interface ISupply extends Document {
  name: string;
  category?: string;
  quantity: number;        // current stock count
  unit?: string;           // e.g., boxes, packs, pieces
  threshold?: number;      // when to restock
  supplier?: string;
  price?: number;          // price per unit
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SupplySchema = new Schema<ISupply>(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    unit: { type: String, trim: true },
    threshold: { type: Number, min: 0, default: 0 },
    supplier: { type: String, trim: true },
    price: { type: Number, min: 0 },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

// Optional: quick index for searching by name
SupplySchema.index({ name: 1 });

export default model<ISupply>('Supply', SupplySchema);
