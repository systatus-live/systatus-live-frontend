import React, { JSX, useEffect, useState } from "react";
import InputText from "../InputText";
import Button from "../Button";
import { SearchIcon } from "lucide-react";

type InputDropdownProps = {
  code: string;
  label: string;
  placeholder?: string;
  options: () => Promise<any[]>;
  onSearch?: (query: string) => Promise<any[]>;
  onChange?: (value: any) => void;
  defaultValue?: string | number
};

export default function Finder(props: JSX.IntrinsicAttributes & InputDropdownProps) {
  const [selected, setSelected] = useState<any>({});
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [list, setList] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    props.options().then(response => {
      setList(response);

      // Init selected value with default value if exists
      if (props.defaultValue != null) {
        const findOption = response.find(option => option[props.code] == props.defaultValue);
        if (findOption) {
          setSelected(findOption);
        }
      }
    })

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

  function onSearch() {
    if (props.onSearch) {
      props.onSearch(search).then(response => {
        setList(response);
      })
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
          <div className="p-2 flex items-center">
            <InputText placeholder="Pesquisar..." onChange={(e) => setSearch(e.target.value)} style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }} />
            <Button severity="secondary" onClick={(e) => {e.preventDefault();onSearch()}} style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, height: "2.25rem" }} type="submit">
              <SearchIcon height={16} />
            </Button>
          </div>

          <ul className="flex flex-col gap-y-1 px-3 pb-2">
            {list.length === 0 ? (
              <li>Nenhum resultado</li>
            ) : (
              list.map((option, index) => (
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
