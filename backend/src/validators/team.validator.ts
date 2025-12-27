import Joi from 'joi';

export const createTeamSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().allow('').optional(),
  color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional(),
});

export const updateTeamSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  description: Joi.string().allow('').optional(),
  color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional(),
}).min(1);
