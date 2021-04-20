import { createRef, useEffect, useState } from "react";
import Fuse from "fuse.js";

import "temp.css";

interface Option { name: string; value: string; header?: boolean; }
interface Group { name: string; value: string; options: Option[]; }
interface SelectProps {
	options: string[] | Option[] | Group[];
	onOptionSelect?: (value: Option) => void;
	onSelectedChange?: (values: Option[]) => void;
	multi?: boolean;
	search?: boolean;
	disabled?: boolean;
	closeOnSelect?: boolean;
	appendGroupValue?: boolean;
	create?: boolean;
	createString?: string;
	placeholder?: string;
};

function flattenStringArray(strings: string[]): Option[] {
	return strings.map((o) => { return { name: o, value: o.toLowerCase() }; });
}

function flattenGroupArray(groups: Group[], appendGroupValue?: boolean): Option[] {
	const tempArray: Option[] = [];
	for (const group in groups) {
		tempArray.push(
			{ name: groups[group].name, value: groups[group].value, header: true },
			...groups[group].options.map((v) => {
				return { name: v.name, value: `${(appendGroupValue) ? `${groups[group].value} ` : ""}${v.value}` };
			})
		);
	}
	return tempArray;
}

function Select({ options, multi, search, disabled, closeOnSelect, appendGroupValue, create, createString, placeholder, onOptionSelect, onSelectedChange }: SelectProps): JSX.Element {
	const [mainOptions, setMainOptions] = useState<Option[]>([]);
	const [userOptions, setUserOptions] = useState<Option[]>([]);

	const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
	const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);

	const [inputValue, setInputValues] = useState<string>("");

	const inputRef = createRef<HTMLInputElement>();
	const optionsRef = createRef<HTMLDivElement>();

	const openOptions = () => {
		if (!disabled) { optionsRef.current?.classList.add("show"); }
	};

	const filterOptions = (searchValue: string) => {
		if (search) {
			const options = { keys: ["value"], includeScore: false, threshold: 0.2 };
			const result = new Fuse([...mainOptions, ...userOptions], options).search(searchValue);
			setFilteredOptions(result.map((v) => v.item));
		}
	};

	const selectOption = (value?: Option) => {
		if (value && (mainOptions.findIndex((v) => v.value === value.value) > -1 || userOptions.findIndex((v) => v.value === value.value) > -1)) {

			if (create && userOptions.findIndex((v) => v.value === value.value) === -1) {
				setUserOptions([...userOptions, value]);
			}

			if (create || mainOptions.findIndex((v) => v.value === value.value) > -1) {
				if (multi) { setSelectedOptions([...selectedOptions, value]); }
				else { setSelectedOptions([value]); }
			}
		}

		if (value && onOptionSelect) onOptionSelect(value);

		if (closeOnSelect) optionsRef.current?.classList.remove("show");
	};

	const deleteSelected = (value?: Option) => {
		if (value && !disabled && selectedOptions.findIndex((v) => v.value === value.value) > -1) selectedOptions.slice(0, -1);
	};

	useEffect(() => {
		filterOptions("");

		if (options.length > 0) {
			if (typeof options[0] === "string") { setMainOptions(flattenStringArray(options as string[])); }
			else if ((options[0] as Group).name) { setMainOptions(flattenGroupArray(options as Group[], appendGroupValue)); }
			else { setMainOptions(options as Option[]); }
		}
		else { setMainOptions([]); }
	}, []);

	const displaySelected = selectedOptions.map((v) => {
		return <div className="easyselect_selected" onClick={() => deleteSelected(v)}>{v}</div>;
	});

	const displayOptions = filteredOptions.map((v) => {
		return <div className="easyselect_option" onClick={() => selectOption(v)}>{v.name}</div>;
	});

	return (
		<div className="easyselect_select">

			<div className="easyselect_bar">

				<div className="easyselect_selectedall">{displaySelected}</div>

				<input
					ref={inputRef}
					className="easyselect_input"
					type="text"
					readOnly={(disabled) ? disabled : undefined}
					placeholder={(placeholder) ? placeholder : undefined}
					value={inputValue}
					onChange={(e) => {
						setInputValues(e.target.value);
						filterOptions(e.target.value);
						if (onSelectedChange) onSelectedChange(selectedOptions);
					}}
					onFocus={openOptions}
				/>

			</div>

			<div className="easyselect_options" ref={optionsRef}>

				{(create && filteredOptions.length === 0)
					? <div className="easyselect_optionnew"
						onClick={() => {
							if (inputRef.current) selectOption({ name: inputRef.current.value, value: inputRef.current.value.toLowerCase() });
						}}>
						{(createString) ? createString : "Create:"} "{inputRef.current?.value}"
					</div>
					: null
				}

				{displayOptions}

			</div>

		</div>
	);
}

export default Select;
