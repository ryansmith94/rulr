import * as assert from 'assert'
import {
	array,
	InvalidArrayError,
	number,
	HigherOrderValidationError,
	KeyedValidationError,
} from '../../lib'

test('array should allow empty array', () => {
	const input: number[] = []
	const output: number[] = array(number)(input)
	assert.deepEqual(output, input)
})

test('array should allow array valid items', () => {
	const input = [1, 2, 3]
	const output: number[] = array(number)(input)
	assert.deepEqual(output, input)
})

test('array should not allow array invalid items', () => {
	try {
		array(number)([1, '2', 3])
		assert.fail('Expected error')
	} catch (error) {
		if (error instanceof HigherOrderValidationError) {
			assert.equal(error.errors.length, 1)
			assert.ok(error.errors[0] instanceof KeyedValidationError)
			return
		} else {
			assert.fail('Expected HigherOrderValidationError')
		}
	}
})

test('array should not allow non-array input', () => {
	assert.throws(() => {
		array(number)({})
	}, InvalidArrayError)
})
