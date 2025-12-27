import Joi from 'joi';

export const createEquipmentSchema = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  code: Joi.string().min(2).max(50).required(),
  category: Joi.string().min(2).max(100).required(),
  maintenanceTeamId: Joi.string().required(),
  location: Joi.string().max(200).allow('').optional(),
  serialNumber: Joi.string().max(100).allow('').optional(),
  manufacturer: Joi.string().max(100).allow('').optional(),
  model: Joi.string().max(100).allow('').optional(),
  purchaseDate: Joi.date().iso().optional(),
  warrantyExpiry: Joi.date().iso().optional(),
  status: Joi.string().valid('ACTIVE', 'UNDER_REPAIR', 'SCRAPPED').default('ACTIVE'),
  notes: Joi.string().allow('').optional(),
});

export const updateEquipmentSchema = Joi.object({
  name: Joi.string().min(2).max(200).optional(),
  code: Joi.string().min(2).max(50).optional(),
  category: Joi.string().min(2).max(100).optional(),
  maintenanceTeamId: Joi.string().optional(),
  location: Joi.string().max(200).allow('').optional(),
  serialNumber: Joi.string().max(100).allow('').optional(),
  manufacturer: Joi.string().max(100).allow('').optional(),
  model: Joi.string().max(100).allow('').optional(),
  purchaseDate: Joi.date().iso().optional(),
  warrantyExpiry: Joi.date().iso().optional(),
  status: Joi.string().valid('ACTIVE', 'UNDER_REPAIR', 'SCRAPPED').optional(),
  notes: Joi.string().allow('').optional(),
}).min(1);
