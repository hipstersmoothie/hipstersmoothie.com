import makeClass from "clsx";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ComponentMap } from "mdx-bundler/client";
import { usePopper } from "react-popper";
import { useQueryParam, StringParam } from "use-query-params";

export const Paragraph: React.FC = (props) => {
  if (
    typeof props.children === "object" &&
    "type" in props.children &&
    props.children.type === "img"
  ) {
    return <>{props.children}</>;
  }

  return <p {...props} className="my-6" />;
};

export const Anchor = (props: React.ComponentProps<"a">) => {
  const hideTimeout = useRef<ReturnType<typeof setTimeout>>();
  const [showPopper, setShowPopper] = useState(false);
  const [referenceElement, setReferenceElement] =
    useState<HTMLAnchorElement>(null);
  const [popperElement, setPopperElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement);
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

    return (
      <>
        <Link passHref href={props.href}>
          <a
            {...props}
            className="underline text-pink-500"
            ref={setReferenceElement}
            onMouseEnter={() => {
              clearTimeout(hideTimeout.current);
              setShowPopper(true);
            }}
            onMouseOut={hidePopperDelayed}
          />
        </Link>

        {showPopper && (
          <iframe
            ref={setPopperElement}
            style={styles.popper}
            onMouseOver={() => clearTimeout(hideTimeout.current)}
            onMouseOut={hidePopperDelayed}
            className="bg-white border rounded-xl w-[400px] h-[400px] shadow-xl"
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
      target="_blank"
      rel="noopener"
      className="underline text-blue-500"
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

interface BlockquoteProps {
  author?: React.ReactNode;
}

export const Blockquote: React.FC<BlockquoteProps> = ({ author, ...props }) => {
  return (
    <figure
      className="-m-2 my-6 grid"
      style={{ gridTemplateColumns: "8px auto" }}
    >
      <div className="rounded rounded-r-none bg-pink-500 h-full" />
      <div className="rounded-lg rounded-l-none border-2 border-l-0 px-4">
        <blockquote {...props} />
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
      className="bg-pink-400 rounded-full inline-flex px-3 text-white font-semibold mr-2 last:mr-0"
      onClick={() => setSearch(props.children as string)}
    />
  );
};

export const components: ComponentMap = {
  p: Paragraph,
  a: Anchor,
  blockquote: Blockquote,
  img: (props) => (
    <figure className="my-12">
      <img {...props} className="rounded-xl mx-auto w-full md:w-9/12" />
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
  code: (props: { children: React.ReactNode; className?: string }) => {
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
  },
  h1: (props) => <h1 {...props} className="lvl1 text-4xl mt-6 mb-8" />,
  h2: (props) => (
    <h2
      {...props}
      className="lvl2 text-2xl mt-10 mb-6 pb-3 border-b border-gray-300 font-medium"
    />
  ),
  h3: (props) => <h3 {...props} className="lvl3 text-xl my-4 font-semibold" />,
  h4: (props) => <h4 {...props} className="lvl4 text-lg my-4 font-bold" />,
  h5: (props) => <h5 {...props} className="lvl5 my-4 font-bold" />,
  h6: (props) => <h6 {...props} className="lvl6 text-sm my-4 font-bold" />,
  table: (props) => <table {...props} className="w-full my-6" />,
  th: (props) => (
    <th {...props} className="pb-4 px-3 text-left font-semibold" />
  ),
  td: (props) => <td {...props} className="py-2 px-3 border-b border-t" />,
  Tag,
};
