import Joi from 'joi';

export const createRequestSchema = Joi.object({
  subject: Joi.string().min(5).max(200).required(),
  description: Joi.string().allow('').optional(),
  type: Joi.string().valid('CORRECTIVE', 'PREVENTIVE', 'corrective', 'preventive').required(),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'low', 'medium', 'high', 'urgent').default('medium'),
  equipmentId: Joi.string().uuid().required(),
  technician: Joi.string().optional(),
  scheduledDate: Joi.date().iso().when('type', {
    is: Joi.string().valid('PREVENTIVE', 'preventive'),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  duration: Joi.number().min(0).optional(),
  notes: Joi.string().allow('').optional(),
});

export const updateRequestSchema = Joi.object({
  subject: Joi.string().min(5).max(200).optional(),
  description: Joi.string().allow('').optional(),
  type: Joi.string().valid('CORRECTIVE', 'PREVENTIVE', 'corrective', 'preventive').optional(),
  priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'low', 'medium', 'high', 'urgent').optional(),
  equipmentId: Joi.string().uuid().optional(),
  technician: Joi.string().optional(),
  scheduledDate: Joi.date().iso().optional(),
  duration: Joi.number().min(0).optional(),
  stage: Joi.string().valid('NEW', 'IN_PROGRESS', 'REPAIRED', 'SCRAP', 'new', 'in_progress', 'repaired', 'scrap').optional(),
  notes: Joi.string().allow('').optional(),
}).min(1);
