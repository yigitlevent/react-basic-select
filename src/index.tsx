import { createRef, useCallback, useEffect, useState } from "react";
import Fuse from "fuse.js";

export interface Option { name: string; value: string; header?: boolean; }

export interface Group { name: string; value: string; options: Option[]; }

export interface SelectProps {
	options: string[] | Option[] | Group[];
	multi?: boolean;
	search?: boolean;
	disabled?: boolean;
	closeOnSelect?: boolean;
	appendGroupValue?: boolean;
	showAsText?: boolean;
	create?: boolean;
	createString?: string;
	placeholder?: string;
	defaultSelected?: string[];
	searchSensitivity?: number;
	onOptionSelect?: (value: Option) => void;
	onSelectedChange?: (values: Option[]) => void;
	onInputChange?: (values: string) => void;
}

export default function Select(props: SelectProps): JSX.Element {
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

	const [mainOptions, setMainOptions] = useState<Option[]>([]);
	const [userOptions, setUserOptions] = useState<Option[]>([]);

	const [selectedOptions, setSelectedOptions] = useState<Option[]>((props.defaultSelected) ? flattenStringArray(props.defaultSelected) : []);
	const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);

	const [inputValue, setInputValues] = useState<string>("");

	const inputRef = createRef<HTMLInputElement>();
	const optionsRef = createRef<HTMLDivElement>();
	
	const [showOptions, setShowOptions] = useState(false);

	const maybeCloseOptions = useCallback((event: MouseEvent): void => {
		const test = !((event.target as HTMLElement).parentElement?.parentElement?.classList.contains("bs_select"));
		if (test) setShowOptions(false);
	}, []);

	const filterOptions = useCallback((searchValue: string): void => {
		if (props.search && searchValue.length > 0) {
			const options = { keys: ["value"], includeScore: false, threshold: (props.searchSensitivity) ? props.searchSensitivity : 0.05 };
			const result = new Fuse([...mainOptions, ...userOptions], options).search(searchValue);
			setFilteredOptions(result.map((v) => v.item));
		}
		else {
			setFilteredOptions(mainOptions);
		}
	}, [mainOptions, props.search, props.searchSensitivity, userOptions]);

	const selectOption = useCallback((value?: Option): void => {
		if (value) {
			if (props.onOptionSelect) props.onOptionSelect(value);

			if (props.create
				&& mainOptions.findIndex((v) => v.value === value.value) === -1
				&& userOptions.findIndex((v) => v.value === value.value) === -1) {
				setUserOptions([...userOptions, value]);
			}

			if ((props.create || mainOptions.findIndex((v) => v.value === value.value) > -1)) {
				let newSelected = [...selectedOptions];

				if (selectedOptions.findIndex((v) => v.value === value.value) === -1) {
					if (props.multi) { newSelected = [...selectedOptions, value]; }
					else { newSelected = [value]; }
				}
				else if (!props.disabled) {
					const index = newSelected.findIndex((v) => v.value === value.value);
					if (index > -1) { newSelected.splice(index, 1); }
				}
				setSelectedOptions(newSelected);
				if (props.onSelectedChange) props.onSelectedChange(newSelected);
			}
		}
	}, [mainOptions, props, selectedOptions, userOptions]);

	const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		setInputValues(event.target.value);
		filterOptions(event.target.value);
		if (props.onInputChange) props.onInputChange(event.target.value);
	}, [filterOptions, props]);

	const selectedElements = selectedOptions.map((v) => {
		return <span key={v.name} className="bs_selected" onClick={() => selectOption(v)}>{v.name}</span>;
	});

	const selectedStrings = selectedOptions.map((v) => { return v.name; });

	const filteredElements = [...filteredOptions, ...userOptions].map((v) => {
		return <div key={v.name}
			className={`
				${(v.header) ? "bs_header" : "bs_option"}
				${(selectedOptions.findIndex((s) => s.value === v.value) > -1) ? "bs_option_selected" : ""}
			`}
			onClick={() => {
				if (!v.header) selectOption(v);
				if (props.closeOnSelect) setShowOptions(false);
			}}
		>
			{v.name}
		</div>;
	});

	useEffect(() => {
		if (props.options.length > 0) {
			if (typeof props.options[0] === "string") { setMainOptions(flattenStringArray(props.options as string[])); }
			else if ((props.options[0] as Group).options) { setMainOptions(flattenGroupArray(props.options as Group[], props.appendGroupValue)); }
			else { setMainOptions(props.options as Option[]); }
		}
		else { setMainOptions([]); }
	}, [setMainOptions, props.options, props.appendGroupValue]);

	useEffect(() => {
		setFilteredOptions(mainOptions);
	}, [mainOptions, setFilteredOptions]);

	useEffect(() => {
		document.addEventListener("click", maybeCloseOptions);
		return () => { document.removeEventListener("click", maybeCloseOptions); };
	}, [mainOptions, maybeCloseOptions]);

	useEffect(() => {
		return () => { setShowOptions(false); };
	}, [setShowOptions]);

	return (
		<div className="bs_select">

			<div className="bs_bar">

				<div className="bs_selectedall">
					{(props.showAsText) ? selectedStrings.join(", ") : selectedElements}
				</div>

				{(props.search || props.create)
					? <input
						ref={inputRef}
						className="bs_input"
						type="text"
						readOnly={(props.disabled) ? props.disabled : undefined}
						placeholder={
							(props.placeholder)
								? props.placeholder
								: undefined
						}
						value={inputValue}
						onChange={(e) => { onChange(e); }}
						onFocus={() => setShowOptions(true)}
					/>
					: <div className="bs_input" onClick={() => setShowOptions(true)}>
						{(props.placeholder) ? props.placeholder : ""}
					</div>
				}

			</div>

			{(showOptions) ?
				<div className="bs_options" ref={optionsRef}>

					{(props.create && filteredElements.length === 0 && inputValue.length > 0)
						? <div className="bs_optionnew"
							onClick={() => {
								if (inputRef.current) selectOption({ name: inputValue, value: inputValue.toLowerCase() });
							}}>
							{(props.createString) ? props.createString : "Create:"} &quot;{inputValue}&quot;
						</div>
						: null
					}

					{(filteredElements.length === 0)
						? <div className="bs_none">Searched value cannot be found...</div>
						: filteredElements
					}

				</div>
				: null
			}

		</div>
	);
}
