import { useRef } from "react";
import { useRouter } from "next/router";
import CommandPalette from "react-command-palette";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { LeafObject } from "../utils/leaves";
import { useQueryParam, StringParam } from "use-query-params";

function Note({ title, tags }: LeafObject) {
  return (
    <div className="flex justify-between space-x-2">
      <div>{title}</div>

      {tags?.length > 0 && (
        <div className="flex space-x-2 items-baseline pt-[1px]">
          {tags.map((tag) => (
            <div className="text-[.6rem] md:text-xs rounded bg-pink-400 text-white px-1 py-[0.125rem]">{tag}</div>
          ))}
        </div>
      )}
    </div>
  );
}

interface NoteSwitcherProps {
  leaves: LeafObject[];
}

export const NoteSwitcher = ({ leaves }: NoteSwitcherProps) => {
  const paletteWrapper = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [search, setSearch] = useQueryParam("search", StringParam);

  const onClose = () => {
    enableBodyScroll(paletteWrapper.current)
    setSearch(undefined)
  }

  if (typeof window === "undefined") {
    return null;
  }

  return (
    <div ref={paletteWrapper}>
      <CommandPalette
        closeOnSelect
        resetInputOnOpen
        open={search}
        defaultInputValue={search}
        options={{
          keys: ["name", "tags.0", "tags.1", "tags.2", "tags.3", "tags.4", "tags.5", "tags.6", "tags.7"], 
          threshold: 0, 
          limit: Infinity,
          allowTypo: true, 
          scoreFn: null 
        }}
        highlightFirstSuggestion={false}
        header={<div className="text-xl mt-2 mb-4 mx-1">Note Switcher</div>}
        placeholder="Type the name of a note"
        hotKeys="command+k"
        onAfterOpen={() => disableBodyScroll(paletteWrapper.current)}
        onRequestClose={onClose}
        onSelect={onClose}
        renderCommand={Note}
        commands={leaves.map((leaf) => {
          return {
            ...leaf,
            name: leaf.title,
            command: () => router.push(`/garden/${leaf.title}`),
          };
        })}
        trigger={null}
        theme={{
          modal:
            "command-modal absolute bg-white w-[90vw] md:w-[605px] top-[10%] left-1/2 p-6 rounded-lg transform -translate-x-2/4 shadow-lg",
          overlay: "atom-overlay",
          header: "color-gray-900",
          input:
            "w-full bg-gray-100 border border-gray-300 p-2 rounded text-[14px]",
          inputFocused: "border-gray-400 focus:bg-white outline-none",
          suggestionsContainer:
            "command-list overflow-auto rounded-lg border border-gray-200 mt-4",
          suggestion:
            "text-gray-900 py-4 px-3 text-[1rem] font-medium border-b border-gray-200 last:border-none",
          suggestionHighlighted: "bg-gray-200 !text-black",
        }}
      />
    </div>
  );
};
