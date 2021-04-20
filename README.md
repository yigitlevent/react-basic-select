# react-basic-select

just another select component for react

## usage

```
const options = ["Option 1", "Option 2", "Option 3"];

<Select	options=[options]/>
```

## props

prop | type | default | description
--- | --- | --- | --- 
**options** | `string[] | Option[] | Group[]` | `n/a` | Array of either `string`, or `Option` or `Group` objects
**onOptionSelect?** | `(value: Option) => void` | `undefined` | Option Select callback
**onSelectedChange?** | `(values: Option[]) => void` | `undefined` | Selected values callback
**multi?** | `boolean` | `undefined` | Allow multiple selections
**search?** | `boolean` | `undefined` | Allow option search via input value
**disabled?** | `boolean` | `undefined` | Close option dropdown after selecting an option
**closeOnSelect?** | `boolean` | `undefined` | Close option dropdown after selecting an option
**appendGroupValue?** | `boolean` | `undefined` | Prepends the `group.value` to `option.value`
**create?** | `boolean` | `undefined` | Allow user created options
**createString?** | `string` | `"Create:"` | Prefix text for user created option
**placeholder?** | `string` | `undefined` | Placeholder text for `input`

## options types

```
cosnt stringArray = ["Option 1", "Option 2"]
```

```
cosnt optionArray = [
	{ name: "Option 1", value: "option_1" },
	{ name: "Option 2", value: "option_2" }
]
```

```
cosnt groupArray = [
	{ name: "Group 1", value: "group_1" 
		options: [
			{ name: "Option 1", value: "option_1" },
			{ name: "Option 2", value: "option_2" }
		]
	},
	{ name: "Group 2", value: "group_2" 
		options: [
			{ name: "Option 3", value: "option_3" },
			{ name: "Option 4", value: "option_4" }
		]
	},
]
```
