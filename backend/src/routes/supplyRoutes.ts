import { Router } from 'express';
import {
  listSupplies,
  getSupply,
  createSupply,
  updateSupply,
  deleteSupply,
} from '../controllers/supplyController';

const router = Router();

router.get('/', listSupplies);
router.get('/:id', getSupply);
router.post('/', createSupply);
router.put('/:id', updateSupply);
router.delete('/:id', deleteSupply);

export default router;
