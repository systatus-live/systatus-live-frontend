import React, { JSX, useEffect, useState } from "react";
import InputText from "../InputText";
import Button from "../Button";

type InputDropdownProps = {
  code: string;
  label: string;
  options: any[];
  placeholder?: string;
  onSearch?: (query: string) => void;
  onChange?: (value: any) => void;
  defaultValue?: string | number
};

export default function InputDropdown2(props: JSX.IntrinsicAttributes & InputDropdownProps) {
  const [selected, setSelected] = useState<any>({});
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    // Init selected value with default value if exists
    if (props.defaultValue != null) {
      const findOption = props.options.find(option => option[props.code] == props.defaultValue);
      if (findOption) {
        setSelected(findOption);
      }
    }

    // Hide dropdown when click outside
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const container = document.getElementById("input-dropdown");
      if (container && !container.contains(target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectOption(option: any) {
    setSelected(option);
    setIsOpen(false);

    if (props.onChange) {
      props.onChange(option);
    }
  }

  return (
    <div id="input-dropdown" className="relative">
      <InputText
        value={selected[props.label] || ""}
        readOnly
        placeholder={props.placeholder}
        onClick={() => setIsOpen(true)}
      />

      {isOpen && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-sm shadow-lg">
          <div className="p-2 flex gap-2">
            <InputText placeholder="Pesquisar..." onChange={(e) => props.onSearch?.(e.target.value)} />
            <Button type="button" onClick={() => props.onSearch?.(selected[props.code])}>Buscar</Button>
          </div>

          <ul className="flex flex-col gap-y-1 px-3 pb-2">
            {props.options.length === 0 ? (
              <li>Nenhum resultado</li>
            ) : (
              props.options.map((option, index) => (
                <li
                  key={index}
                  onClick={() => selectOption(option)}
                  className={`p-2 cursor-pointer text-sm border-l-4 ${selected[props.code] === option[props.code]
                    ? "border-l-blue-700"
                    : "border-l-white hover:border-l-blue-700"
                    } transition-all duration-100`}
                >
                  {option[props.label]}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
