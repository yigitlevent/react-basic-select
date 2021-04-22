import { createRef, useEffect, useState } from "react";
import Fuse from "fuse.js";

export interface Option { name: string; value: string; header?: boolean; }
export interface Group { name: string; value: string; options: Option[]; }
export interface SelectProps {
	options: string[] | Option[] | Group[];
	onOptionSelect?: (value: Option) => void;
	onSelectedChange?: (values: Option[]) => void;
	onInputChange?: (values: string) => void;
	multi?: boolean;
	search?: boolean;
	disabled?: boolean;
	closeOnSelect?: boolean;
	appendGroupValue?: boolean;
	showAsText?: boolean;
	create?: boolean;
	createString?: string;
	placeholder?: string;
};

function Select({ options, multi, search, disabled, closeOnSelect, appendGroupValue, showAsText, create, createString, placeholder, onOptionSelect, onSelectedChange, onInputChange }: SelectProps): JSX.Element {
	const [mainOptions, setMainOptions] = useState<Option[]>([]);
	const [userOptions, setUserOptions] = useState<Option[]>([]);

	const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
	const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);

	const [inputValue, setInputValues] = useState<string>("");

	const inputRef = createRef<HTMLInputElement>();
	const optionsRef = createRef<HTMLDivElement>();

	const [showOptions, setShowOptions] = useState(false);

	const switchOptions = (close: boolean) => {
		if (!disabled) { setShowOptions(close); }
	};

	const maybeCloseOptions = (event: MouseEvent): void => {
		const test = !((event.target as HTMLElement).parentElement?.parentElement?.classList.contains("basicselect_select"));
		if (test) switchOptions(false);
	};

	const filterOptions = (searchValue: string) => {
		if (search) {
			const options = { keys: ["value"], includeScore: false, threshold: 0.2 };
			const result = new Fuse([...mainOptions, ...userOptions], options).search(searchValue);
			setFilteredOptions(result.map((v) => v.item));
		}
	};

	const selectOption = (value?: Option) => {
		if (value) {
			if (onOptionSelect) onOptionSelect(value);

			if (create && userOptions.findIndex((v) => v.value === value.value) === -1) {
				setUserOptions([...userOptions, value]);
			}

			if ((create || mainOptions.findIndex((v) => v.value === value.value) > -1)) {
				let newSelected = [...selectedOptions];

				if (selectedOptions.findIndex((v) => v.value === value.value) === -1) {
					if (multi) { newSelected = [...selectedOptions, value]; }
					else { newSelected = [value]; }
				}
				else if (!disabled) {
					const index = newSelected.findIndex((v) => v.value === value.value);
					if (index > -1) { newSelected.splice(index, 1); }
				}
				setSelectedOptions(newSelected);
				if (onSelectedChange) onSelectedChange(newSelected);
			}
		};

		if (closeOnSelect) switchOptions(false);
	};

	const flattenStringArray = (strings: string[]): Option[] => {
		return strings.map((o) => { return { name: o, value: o.toLowerCase() }; });
	};

	const flattenGroupArray = (groups: Group[], appendGroupValue?: boolean): Option[] => {
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
	};

	useEffect(() => {
		if (options.length > 0) {
			if (typeof options[0] === "string") { setMainOptions(flattenStringArray(options as string[])); }
			else if ((options[0] as Group).options) { setMainOptions(flattenGroupArray(options as Group[], appendGroupValue)); }
			else { setMainOptions(options as Option[]); }
		}
		else { setMainOptions([]); }
	}, [setMainOptions, options, appendGroupValue]);

	useEffect(() => {
		setFilteredOptions(mainOptions);
	}, [mainOptions, setFilteredOptions]);

	useEffect(() => {
		document.addEventListener("click", (e) => maybeCloseOptions(e));
		return () => { document.removeEventListener("click", (e) => maybeCloseOptions(e)); };
	}, [mainOptions, setFilteredOptions]);

	const selectedElements = selectedOptions.map((v) => {
		return <span key={v.name} className="basicselect_selected" onClick={() => selectOption(v)}>{v.name}</span>;
	});

	const selectedStrings = selectedOptions.map((v) => { return v.name; });

	const filteredElements = filteredOptions.map((v) => {
		return <div key={v.name}
			className={`
				${(v.header) ? "basicselect_header" : "basicselect_option"}
				${(selectedOptions.findIndex((s) => s.value === v.value) > -1) ? "basicselect_option_selected" : ""}
			`}
			onClick={() => { if (!v.header) selectOption(v); }}
		>
			{v.name}
		</div>;
	});

	return (
		<div className="basicselect_select">

			<div className="basicselect_bar">


				<div className="basicselect_selectedall">
					{(showAsText) ? selectedStrings.join(", ") : selectedElements}
				</div>

				<input
					ref={inputRef}
					className="basicselect_input"
					type="text"
					readOnly={(disabled) ? disabled : undefined}
					placeholder={(placeholder) ? placeholder : undefined}
					value={inputValue}
					onChange={(e) => {
						setInputValues(e.target.value);
						filterOptions(e.target.value);
						if (onInputChange) onInputChange(e.target.value);
					}}
					onFocus={() => switchOptions(true)}
				/>

			</div>

			{(showOptions) ?
				<div className="basicselect_options" ref={optionsRef}>

					{(create && filteredElements.length === 0 && inputValue.length > 0)
						? <div className="basicselect_optionnew"
							onClick={() => {
								if (inputRef.current) selectOption({ name: inputValue, value: inputValue.toLowerCase() });
							}}>
							{(createString) ? createString : "Create:"} "{inputValue}"
					</div>
						: null
					}

					{filteredElements}

				</div>
				: null
			}

		</div>
	);
}

export default Select;
