import * as assert from 'assert'
import { dictionary, string, unconstrainedNumber, InvalidObjectError } from '../../lib'

test('dictionary should not allow non-object input', () => {
	assert.throws(() => {
		dictionary(string, unconstrainedNumber)([])
	}, InvalidObjectError)
})

test('dictionary should allow empty dictionary', () => {
	const input = {}
	const output: Record<string, number> = dictionary(string, unconstrainedNumber)(input)
	assert.deepEqual(output, input)
})

test('dictionary should allow valid dictionary entries', () => {
	const input = { test: 0 }
	const output: Record<string, number> = dictionary(string, unconstrainedNumber)(input)
	assert.deepEqual(output, input)
})

test('dictionary should not allow invalid dictionary keys', () => {
	assert.throws(() => dictionary(unconstrainedNumber, unconstrainedNumber)({ test: 0 }))
})

test('dictionary should not allow invalid dictionary values', () => {
	assert.throws(() => dictionary(string, unconstrainedNumber)({ test: '0' }))
})

test('dictionary should not allow invalid dictionary keys or values', () => {
	assert.throws(() => dictionary(unconstrainedNumber, unconstrainedNumber)({ test: '0' }))
})
