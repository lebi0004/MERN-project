import { Request, Response } from 'express';
import Supply from '../models/Supply';

// GET /api/supplies
export const listSupplies = async (_req: Request, res: Response) => {
  try {
    const items = await Supply.find().sort({ updatedAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch supplies' });
  }
};

// GET /api/supplies/:id
export const getSupply = async (req: Request, res: Response) => {
  try {
    const item = await Supply.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Supply not found' });
    res.json(item);
  } catch {
    res.status(400).json({ message: 'Invalid id' });
  }
};

// POST /api/supplies
export const createSupply = async (req: Request, res: Response) => {
  try {
    const item = await Supply.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create supply', error: (err as Error).message });
  }
};

// PUT /api/supplies/:id  (full or partial update)
export const updateSupply = async (req: Request, res: Response) => {
  try {
    const item = await Supply.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: 'Supply not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update supply', error: (err as Error).message });
  }
};

// DELETE /api/supplies/:id
export const deleteSupply = async (req: Request, res: Response) => {
  try {
    const item = await Supply.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Supply not found' });
    res.json({ message: 'Deleted', id: item._id });
  } catch {
    res.status(400).json({ message: 'Invalid id' });
  }
};
