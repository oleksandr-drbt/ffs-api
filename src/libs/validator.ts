import Joi, { SchemaLike, ValidationErrorItem } from 'joi';

export const validator = {
  validate: (data: object, schema: SchemaLike) => {
    const { error } = Joi.validate(data, schema, { abortEarly: false });

    return (error
        ? error.details.reduce((allErrors: object, errorItem: ValidationErrorItem) => {
          const { label }: any = errorItem.context;

          return {
            ...allErrors,
            [label]: errorItem.message,
          };
        }, {})
        : null
    );
  },
};
