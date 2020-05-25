import * as assert from 'assert'
import { symbol, InvalidSymbolError } from '../../lib'

test('should allow symbol', () => {
	const input = Symbol()
	const output: symbol = symbol(input)
	assert.equal(output, input)
})

test('should allow non-symbol value', () => {
	assert.throws(() => symbol(''), InvalidSymbolError)
})
