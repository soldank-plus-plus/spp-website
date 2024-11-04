import Joi, { ObjectSchema } from 'joi';

import { Environment } from '@api/types';

export type ConfigType = {
  NODE_ENV: string;

  // DB_HOST: string;
  // DB_PORT: number;
  // DB_USER: string;
  // DB_PASSWORD: string;
  // DB_DATABASE: string;
  // DB_LOCAL_ROOT_PASSWORD?: string;
};

const DEFAULTS: Partial<ConfigType> = {
  NODE_ENV: Environment.DEVELOPMENT,
};

export const configValidationSchema: ObjectSchema<ConfigType> = Joi.object({
  NODE_ENV: Joi.string()
    .valid(...Object.values(Environment))
    .default(DEFAULTS.NODE_ENV),

  // DB_HOST: Joi.string().required(),
  // DB_PORT: Joi.number().required(),
  // DB_USER: Joi.string().required(),
  // DB_PASSWORD: Joi.string().required(),
  // DB_DATABASE: Joi.string().required(),
  // DB_LOCAL_ROOT_PASSWORD: Joi.when('NODE_ENV', {
  //   is: Environment.DEVELOPMENT,
  //   then: Joi.string().required(),
  //   otherwise: Joi.string().optional().empty(''),
  // }),
});
