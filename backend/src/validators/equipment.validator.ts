import Joi from 'joi';

export const createEquipmentSchema = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  code: Joi.string().min(2).max(50).required(),
  categoryId: Joi.number().integer().required(),
  maintenanceTeamId: Joi.number().integer().required(),
  location: Joi.string().max(200).allow('').optional(),
  serialNumber: Joi.string().max(100).allow('').optional(),
  manufacturer: Joi.string().max(100).allow('').optional(),
  model: Joi.string().max(100).allow('').optional(),
  purchaseDate: Joi.date().iso().optional(),
  warrantyExpiry: Joi.date().iso().optional(),
  status: Joi.string().valid('OPERATIONAL', 'UNDER_MAINTENANCE', 'UNUSABLE').default('OPERATIONAL'),
  notes: Joi.string().allow('').optional(),
});

export const updateEquipmentSchema = Joi.object({
  name: Joi.string().min(2).max(200).optional(),
  code: Joi.string().min(2).max(50).optional(),
  categoryId: Joi.number().integer().optional(),
  maintenanceTeamId: Joi.number().integer().optional(),
  location: Joi.string().max(200).allow('').optional(),
  serialNumber: Joi.string().max(100).allow('').optional(),
  manufacturer: Joi.string().max(100).allow('').optional(),
  model: Joi.string().max(100).allow('').optional(),
  purchaseDate: Joi.date().iso().optional(),
  warrantyExpiry: Joi.date().iso().optional(),
  status: Joi.string().valid('OPERATIONAL', 'UNDER_MAINTENANCE', 'UNUSABLE').optional(),
  notes: Joi.string().allow('').optional(),
}).min(1);
