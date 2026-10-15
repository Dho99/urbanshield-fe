"use client";

import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { Command } from "cmdk";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  id?: string;
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  className?: string;
}

const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
  (
    {
      id,
      options,
      value,
      onChange,
      placeholder = "Pilih opsi",
      searchPlaceholder = "Cari…",
      emptyText = "Tidak ada hasil.",
      disabled = false,
      className,
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const selected = options.find((o) => o.value === value);

    return (
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            ref={ref}
            id={id}
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={`${id ?? "combobox"}-listbox`}
            disabled={disabled}
            className={cn(
              "flex h-9 w-full items-center justify-between border border-slate-300 bg-white px-3 py-1 text-sm text-slate-900 focus:border-slate-900 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              !selected && "text-slate-500",
              className,
            )}
          >
            <span className="truncate">{selected ? selected.label : placeholder}</span>
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" aria-hidden />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={4}
            className="z-50 w-[var(--radix-popover-trigger-width)] border border-slate-300 bg-white shadow-md"
          >
            <Command label={placeholder}>
              <div className="border-b border-slate-200">
                <Command.Input placeholder={searchPlaceholder} className="h-9 w-full bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-500" />
              </div>
              <Command.List id={`${id ?? "combobox"}-listbox`} className="max-h-60 overflow-y-auto p-1">
                <Command.Empty className="px-2 py-4 text-center text-sm text-slate-500">{emptyText}</Command.Empty>
                {options.map((o) => (
                  <Command.Item
                    key={o.value}
                    value={`${o.label} ${o.value}`}
                    onSelect={() => {
                      onChange(o.value);
                      setOpen(false);
                    }}
                    className="flex cursor-pointer items-center justify-between gap-2 px-2 py-1.5 text-sm text-slate-900 aria-selected:bg-slate-100 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
                  >
                    <span className="truncate">{o.label}</span>
                    <Check className={cn("size-4 shrink-0", value === o.value ? "opacity-100" : "opacity-0")} aria-hidden />
                  </Command.Item>
                ))}
              </Command.List>
            </Command>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
  },
);
Combobox.displayName = "Combobox";

export { Combobox };
