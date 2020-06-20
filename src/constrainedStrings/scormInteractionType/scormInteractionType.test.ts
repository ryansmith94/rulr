import * as assert from 'assert'
import {
	scormInteractionType,
	ScormInteractionType,
	InvalidScormInteractionTypeError,
} from '../../lib'

test('scormInteractionType should not allow invalid string input', () => {
	const input = 0
	assert.throws(() => scormInteractionType(input), InvalidScormInteractionTypeError)
})

test('scormInteractionType should allow valid scormInteractionType input', () => {
	Object.values(ScormInteractionType).forEach((input) => {
		const output: ScormInteractionType = scormInteractionType(input)
		assert.equal(output, input)
	})
})

test('scormInteractionType should not allow invalid scormInteractionType input', () => {
	const input = 'choices'
	assert.throws(() => scormInteractionType(input), InvalidScormInteractionTypeError)
})