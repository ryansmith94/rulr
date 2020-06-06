import * as assert from 'assert'
import { string, ConstrainedStringError, Constrained } from '../../lib'

test('constrained string should not allow invalid string input', () => {
	const input = 0
	const rule = string<'Test'>({ constraintId: 'Test' })
	assert.throws(() => rule(input), ConstrainedStringError)
})

test('constrained string should not allow input greater than max length', () => {
	const input = '12'
	const rule = string<'Test'>({ constraintId: 'Test', maxLength: 1 })
	assert.throws(() => rule(input), ConstrainedStringError)
})

test('constrained string should allow input equal to max length', () => {
	const input = '1'
	const rule = string<'Test'>({ constraintId: 'Test', maxLength: 1 })
	const output: Constrained<'Test', string> = rule(input)
	assert.equal(output, input)
})

test('constrained string should allow input less than max length', () => {
	const input = ''
	const rule = string<'Test'>({ constraintId: 'Test', maxLength: 1 })
	const output: Constrained<'Test', string> = rule(input)
	assert.equal(output, input)
})

test('constrained string should not allow input less than min length', () => {
	const input = ''
	const rule = string<'Test'>({ constraintId: 'Test', minLength: 1 })
	assert.throws(() => rule(input), ConstrainedStringError)
})

test('constrained string should allow input equal to min length', () => {
	const input = '1'
	const rule = string<'Test'>({ constraintId: 'Test', minLength: 1 })
	const output: Constrained<'Test', string> = rule(input)
	assert.equal(output, input)
})

test('constrained string should allow input greater than min length', () => {
	const input = '12'
	const rule = string<'Test'>({ constraintId: 'Test', minLength: 1 })
	const output: Constrained<'Test', string> = rule(input)
	assert.equal(output, input)
})

test('constrained string should allow input matching pattern', () => {
	const input = '1'
	const rule = string<'Test'>({
		constraintId: 'Test',
		patternTest: (stringInput) => {
			return /^1$/.test(stringInput)
		},
	})
	const output: Constrained<'Test', string> = rule(input)
	assert.equal(output, input)
})

test('constrained string should not allow input not matching pattern', () => {
	const input = '12'
	const rule = string<'Test'>({
		constraintId: 'Test',
		patternTest: (stringInput) => {
			return /^1$/.test(stringInput)
		},
	})
	assert.throws(() => rule(input), ConstrainedStringError)
})