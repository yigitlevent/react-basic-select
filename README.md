# react-basic-select

Just another select component for React. Created for [Autarkis](https://github.com/yigitlevent/autarkis).

[Demo](https://codesandbox.io/s/react-basic-select-33mt5)

## Why?

Because I needed a small, mostly dependency-free Select component for my project. Figured people may use it as well.

## CSS?

You can find an example CSS implementation in `dist/example.css`, which lists all classes used in this package.

## Installation

`npm install react-basic-select`

## Basic Usage

```
const options = ["Option 1", "Option 2", "Option 3"];

<Select	options=[options]/>
```

## Props

| prop                   | type                              | default     | description                                              |
| ---------------------- | --------------------------------- | ----------- | -------------------------------------------------------- |
| **options**            | `string[] \| Option[] \| Group[]` | `n/a`       | Array of either `string`, or `Option` or `Group` objects |
| **multi?**             | `boolean`                         | `undefined` | Allow multiple selections                                |
| **search?**            | `boolean`                         | `undefined` | Allow option search via input value                      |
| **disabled?**          | `boolean`                         | `undefined` | Close option dropdown after selecting an option          |
| **closeOnSelect?**     | `boolean`                         | `undefined` | Close option dropdown after selecting an option          |
| **appendGroupValue?**  | `boolean`                         | `undefined` | Prepends the `group.value` to `option.value`             |
| **showAsText?**        | `boolean`                         | `undefined` | Shows the selected options as a string                   |
| **create?**            | `boolean`                         | `undefined` | Allow user created options                               |
| **createString?**      | `string`                          | `"Create:"` | Prefix text for user created option                      |
| **placeholder?**       | `string`                          | `undefined` | Placeholder text for `input`                             |
| **defaultSelected?**   | `string[] \| Option[] \| Group[]` | `undefined` | Selects value(s) when the Select element is rendered     |
| **searchSensitivity?** | `number` (0.0 to 1.0)             | `undefined` | Search matching sensitivity                              |
| **onOptionSelect?**    | `(value: Option) => void`         | `undefined` | Option Select callback                                   |
| **onSelectedChange?**  | `(values: Option[]) => void`      | `undefined` | Selected value(s) callback                               |
| **onInputChange?**     | `(values: string) => void`        | `undefined` | Input value callback                                     |

## Prop Considerations

-   If both `search` and `create` are false, instead of an `input`, you get a `div` to display the options list.
-   `onOptionSelect` calls the given callback **before** the value is processed, and `onSelectedChange` calls its callback afterwards.
-   `onInputChange` callback is only called if you have either `search` or `create`, or both. It is called after all the filtering and such is done.
-   If `showAsText` is set, users won't be able to remove selected options via clicking on them.

## Options Types

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
