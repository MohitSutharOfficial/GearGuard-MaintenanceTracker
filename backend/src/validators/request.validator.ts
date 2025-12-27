import Joi from 'joi';

export const createRequestSchema = Joi.object({
  subject: Joi.string().min(5).max(200).required(),
  description: Joi.string().allow('').optional(),
  type: Joi.string().valid('CORRECTIVE', 'PREVENTIVE').required(),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL').default('MEDIUM'),
  equipmentId: Joi.number().integer().required(),
  technicianId: Joi.number().integer().optional(),
  scheduledDate: Joi.date().iso().when('type', {
    is: 'PREVENTIVE',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  notes: Joi.string().allow('').optional(),
});

export const updateRequestSchema = Joi.object({
  subject: Joi.string().min(5).max(200).optional(),
  description: Joi.string().allow('').optional(),
  type: Joi.string().valid('CORRECTIVE', 'PREVENTIVE').optional(),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL').optional(),
  equipmentId: Joi.number().integer().optional(),
  technicianId: Joi.number().integer().optional(),
  scheduledDate: Joi.date().iso().optional(),
  duration: Joi.number().min(0).optional(),
  stage: Joi.string().valid('NEW', 'IN_PROGRESS', 'REPAIRED', 'SCRAP').optional(),
  notes: Joi.string().allow('').optional(),
}).min(1);
