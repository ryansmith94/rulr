# iso8601Timestamp

[Back to root readme.md](../../../readme.md)

This function uses the `rulr.isISO8601Timestamp` guard to check the input is a valid ISO 8601 Timestamp as shown in the example below. It should only throw `rulr.InvalidISO8601TimestampError`. This function uses [the much loved validator package](https://github.com/validatorjs/validator.js) and passes the strict option to the `validator.isISO8601` function.

```ts
import * as rulr from 'rulr'

const constrainToExample = rulr.object({
	required: {
		example: rulr.iso8601Timestamp,
	},
})

type Example = rulr.Static<typeof constrainToExample>
// {
//   example: rulr.ISO8601Timestamp
// }

// Valid
const example1: Example = constrainToExample({
	example: '2020-01-01T00:00Z',
})

// Invalid: Not a valid ISO 8601 Timestamp
const example2: Example = constrainToExample({
	example: '2020-01-0100:00Z',
})

// Invalid: Not a string
const example3: Example = constrainToExample({
	example: 1,
})
```
