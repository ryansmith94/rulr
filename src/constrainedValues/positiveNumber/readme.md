# positiveNumber

[Back to root readme.md](../../../readme.md)

This function uses the `rulr.isPositiveNumber` guard to check the input is a valid positiveNumber as shown in the example below. It should only throw `rulr.InvalidPositiveNumberError`.

```ts
import * as rulr from 'rulr'

const constrainToExample = rulr.object({
	required: {
		example: rulr.positiveNumber,
	},
})

type Example = rulr.Static<typeof constrainToExample>
// {
//   example: rulr.PositiveNumber
// }

// Valid
const example1: Example = constrainToExample({
	example: 1,
})

// Invalid: Not a valid PositiveNumber
const example2: Example = constrainToExample({
	example: -1,
})

// Invalid: Not a number
const example3: Example = constrainToExample({
	example: '1',
})
```
