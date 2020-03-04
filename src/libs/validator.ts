import Joi, { SchemaLike, ValidationErrorItem } from 'joi';

export const validator = {
	validate: (data: Object, schema: SchemaLike) => {
		const { error } = Joi.validate(data, schema, { abortEarly: false });

		return (error
			? error.details.reduce((allErrors: Object, errorItem: ValidationErrorItem) => {
				const { label }: any = errorItem.context;

				return {
					...allErrors,
					[label]: errorItem.message
				}
			}, {})
			: null
		);
	}
};
