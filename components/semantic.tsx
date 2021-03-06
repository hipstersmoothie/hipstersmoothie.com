import makeClass from "clsx";
import { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ComponentMap } from "mdx-bundler/client";
import { usePopper } from "react-popper";
import { useQueryParam, StringParam } from "use-query-params";
import toast from "react-hot-toast";
import copy from "copy-to-clipboard";

import { Time } from "./Time";
import { LeafContext } from "../pages/garden/[leaf]";
import { IframeContext } from "./IframeContext";
import { PlantHealth } from "./PlantHealth";

export const Paragraph: React.FC = (props) => {
  if (typeof props.children === "object" && "type" in props.children) {
    return <>{props.children}</>;
  }

  return <p {...props} className="my-6" />;
};

export const Anchor = (props: React.ComponentProps<"a">) => {
  const { inIframe } = useContext(IframeContext);
  const showTimeout = useRef<ReturnType<typeof setTimeout>>();
  const hideTimeout = useRef<ReturnType<typeof setTimeout>>();
  const [showPopper, setShowPopper] = useState(false);
  const [referenceElement, setReferenceElement] =
    useState<HTMLAnchorElement>(null);
  const [popperElement, setPopperElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [
      {
        name: "preventOverflow",
        options: {
          padding: 10,
        },
      },
      {
        name: "offset",
        options: {
          offset: [0, 8],
        },
      },
    ],
  });
  const isBackLink = props.href.startsWith("/garden");

  useEffect(() => {
    const hidePopper = () => setShowPopper(false);
    document.addEventListener("click", hidePopper);

    return () => {
      document.removeEventListener("click", hidePopper);
    };
  }, []);

  if (isBackLink) {
    const hidePopperDelayed = () => {
      hideTimeout.current = setTimeout(() => setShowPopper(false), 500);
    };
    const showPopperDelayed = () => {
      showTimeout.current = setTimeout(() => setShowPopper(true), 500);
    };

    return (
      <>
        <Link passHref href={props.href}>
          <a
            {...props}
            data-backlink
            className={makeClass("underline text-pink-500", props.className)}
            ref={setReferenceElement}
            onMouseEnter={() => {
              clearTimeout(hideTimeout.current);
              showPopperDelayed();
            }}
            onMouseOut={() => {
              clearTimeout(showTimeout.current);
              hidePopperDelayed();
            }}
            onClick={(e) => {
              clearTimeout(showTimeout.current);
              props.onClick?.(e);
            }}
          />
        </Link>

        {showPopper && !inIframe && (
          <iframe
            ref={setPopperElement}
            style={styles.popper}
            onMouseOver={() => clearTimeout(hideTimeout.current)}
            onMouseOut={hidePopperDelayed}
            className="bg-white border rounded-sm w-[400px] h-[400px] shadow-xl"
            {...attributes.popper}
            src={`${window.location.origin}${props.href}?in-iframe=true`}
          />
        )}
      </>
    );
  }

  return (
    <a
      {...props}
      target={props["data-heading"] ? "_self" : "_blank"}
      rel="noopener"
      className={makeClass(
        "text-blue-500",
        props.className,
        !props.className?.includes("underline") && "underline"
      )}
    />
  );
};

interface BlockQuoteAuthorProps {
  href?: string;
  children: string;
}

export const BlockQuoteAuthor = ({ children, href }: BlockQuoteAuthorProps) => {
  const name = <span>{children}</span>;

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener">
        {name}
      </a>
    );
  }

  return name;
};

interface BlockquoteProps extends React.ComponentProps<"figure"> {
  author?: React.ReactNode;
}

export const Blockquote: React.FC<BlockquoteProps> = ({
  author,
  className,
  children,
  ...props
}) => {
  return (
    <figure
      {...props}
      className={makeClass("-m-2 my-6 grid", className)}
      style={{ gridTemplateColumns: "8px auto" }}
    >
      <div className="rounded-sm rounded-r-none bg-pink-500" />
      <div className="rounded-sm rounded-l-none bg-white border-2 border-l-0 border-gray-100 px-4">
        <blockquote children={children} />
        {author && (
          <figcaption className="-mt-2 mb-6 text-right text-[1.05rem] text-gray-600 font-semibold">
            <span className="text-xl font-medium">{"~ "}</span>
            <cite>{author}</cite>
          </figcaption>
        )}
      </div>
    </figure>
  );
};

export const HorizontalRule: React.FC = (props) => (
  <hr {...props} className="mx-auto h-2 w-8 rounded bg-gray-200 my-10" />
);

export const OrderedList: React.FC = (props) => (
  <ol {...props} className="list-decimal ml-8 my-8" />
);

export const UnorderedList: React.FC = (props) => (
  <ul {...props} className="list-disc ml-8 my-8" />
);

export const Tag = (props: React.ComponentProps<"button">) => {
  const [_, setSearch] = useQueryParam("search", StringParam);

  return (
    <button
      {...props}
      className="bg-pink-400 rounded-md inline-flex px-3 text-white font-semibold mr-2 last:mr-0 focus:outline-none"
      onClick={() => setSearch(props.children as string)}
    />
  );
};

export const H1 = (props: React.ComponentProps<"h1">) => {
  const { currentLeaf } = useContext(LeafContext);

  return (
    <>
      <h1
        {...props}
        className="lvl1 mt-6 md:mt-8 pb-4 md:pb-6 mb-6 md:mb-4 border-b flex justify-between text-4xl md:text-6xl"
      />

      <div className="mb-10 md:mb-12 sm:flex items-baseline justify-between">
        <div className="space-x-4 md:space-y-0 text-sm flex flex-row mb-4 md:mb-0">
          <div className="text-gray-500">
            <span className="italic">Created: </span>
            <Time
              date={currentLeaf.creationDate || new Date().toLocaleString()}
              className="text-gray-900 font-medium"
            />
          </div>

          <div className="text-gray-500">
            <span className="italic">Updated: </span>
            <Time
              date={currentLeaf.lastUpdatedDate || new Date().toLocaleString()}
              className="text-gray-900 font-medium"
            />
          </div>
        </div>

        <PlantHealth
          showTooltip={false}
          leaf={currentLeaf}
          className="text-green-900 text-sm font-medium"
        />
      </div>
    </>
  );
};

export const Code = (props: {
  children: React.ReactNode;
  className?: string;
}) => {
  if ("className" in props) {
    if (props.className.startsWith("language-")) {
      return (
        <code
          {...props}
          className={makeClass(
            props.className,
            "text-gray-600 rounded block py-8 px-6 overflow-auto"
          )}
        />
      );
    }

    return <code {...props} />;
  }

  return (
    <code
      {...props}
      className="text-xs rounded px-2 py-1 bg-gray-200 text-gray-900"
    />
  );
};

const onHeadingClick = (e: React.MouseEvent<HTMLHeadingElement>) => {
  // Update the location hash without scrolling
  history.replaceState(null, null, `#${e.currentTarget.id}`);
  // Copy new location to clipboard
  copy(window.location.toString());

  toast.success("Link to heading copied to clipboard!", { duration: 3 * 1000 });
  e.preventDefault();
};

export const components: ComponentMap = {
  p: Paragraph,
  a: Anchor,
  blockquote: Blockquote,
  img: (props) => (
    <figure className="my-12">
      <img {...props} className="rounded-sm mx-auto w-full md:w-9/12" />
      <figcaption className="text-sm font-medium my-2 text-center italic">
        {(props as any).alt}
      </figcaption>
    </figure>
  ),
  hr: HorizontalRule,
  ul: UnorderedList,
  ol: OrderedList,
  pre: (props) => (
    <pre {...props} className="bg-gray-200 rounded border my-6" />
  ),
  code: Code,
  h1: H1,
  h2: (props: React.ComponentProps<"h2">) => (
    <h2
      {...props}
      className="lvl2 text-2xl mt-10 mb-6 pb-3 border-b border-gray-300 font-medium"
      onClick={(e) => {
        props.onClick?.(e);
        onHeadingClick(e);
      }}
    />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3
      {...props}
      className="lvl3 text-xl my-4 font-semibold"
      onClick={(e) => {
        props.onClick?.(e);
        onHeadingClick(e);
      }}
    />
  ),
  h4: (props: React.ComponentProps<"h4">) => (
    <h4
      {...props}
      className="lvl4 text-lg my-4 font-bold"
      onClick={(e) => {
        props.onClick?.(e);
        onHeadingClick(e);
      }}
    />
  ),
  h5: (props: React.ComponentProps<"h5">) => (
    <h5
      {...props}
      className="lvl5 my-4 font-bold"
      onClick={(e) => {
        props.onClick?.(e);
        onHeadingClick(e);
      }}
    />
  ),
  h6: (props: React.ComponentProps<"h6">) => (
    <h6
      {...props}
      className="lvl6 text-sm my-4 font-bold"
      onClick={(e) => {
        props.onClick?.(e);
        onHeadingClick(e);
      }}
    />
  ),
  table: (props) => <table {...props} className="w-full my-6" />,
  th: (props) => (
    <th {...props} className="pb-4 px-3 text-left font-semibold" />
  ),
  td: (props) => <td {...props} className="py-2 px-3 border-b border-t" />,
  Tag,
};
