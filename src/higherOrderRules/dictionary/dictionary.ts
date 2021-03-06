import { Rule, Key } from '../../core'
import { validateObject } from '../object/object'
import { KeyedValidationError } from '../../errors/KeyedValidationError'
import { ValidationErrors } from '../../errors/ValidationErrors'

export class DictionaryKeyValidationError extends KeyedValidationError {
	constructor(error: unknown, key: Key) {
		super(key, error, key)
	}
}

function validate<Input, Output>(rule: Rule<Output>, input: Input) {
	try {
		const output = rule(input)
		return { output }
	} catch (error) {
		return { error }
	}
}

export function dictionary<K extends Key, Value>(keyRule: Rule<K>, valueRule: Rule<Value>) {
	return (input: unknown) => {
		const objectInput = validateObject(input)
		const keys: string[] = Object.keys(objectInput)
		const output = {} as Record<K, Value>
		const errors = [] as KeyedValidationError[]
		const initialResult = { output, errors }
		const finalResult = keys.reduce((result, key) => {
			const value = objectInput[key]
			const dictionaryKey = validate(keyRule, key)
			const dictionaryValue = validate(valueRule, value)
			if (dictionaryKey.output === undefined || dictionaryValue.output === undefined) {
				if (dictionaryKey.error !== undefined && dictionaryValue.error !== undefined) {
					result.errors.push(
						new DictionaryKeyValidationError(dictionaryKey.error, key),
						new KeyedValidationError(value, dictionaryValue.error, key)
					)
				} else if (dictionaryKey.error !== undefined) {
					result.errors.push(new DictionaryKeyValidationError(dictionaryKey.error, key))
				} else if (dictionaryValue.error !== undefined) {
					result.errors.push(new KeyedValidationError(value, dictionaryValue.error, key))
				}
				return result
			}
			result.output[dictionaryKey.output] = dictionaryValue.output
			return result
		}, initialResult)
		if (finalResult.errors.length > 0) {
			throw new ValidationErrors(finalResult.errors)
		}
		return finalResult.output
	}
}
