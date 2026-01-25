import { type SchemaOptions, Type } from '@sinclair/typebox';

export const StringEnum = <V extends string>(
	values: V[],
	options: SchemaOptions,
) =>
	Type.Union(
		values.map((value) => Type.Literal(value)),
		options,
	);
