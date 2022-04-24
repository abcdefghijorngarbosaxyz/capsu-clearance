import React from "react";
import lineHeight from "line-height";

function TextAreaResize(
  { value, name, onChange, minHeight, className, ...props },
  ref
) {
  const [innerValue, setInnerValue] = React.useState("");
  const innerRef = React.useRef(null);
  const divRef = React.useRef(null);

  React.useLayoutEffect(() => {
    update();
  }, [value]);

  function handleChange(e) {
    if (onChange) {
      onChange(e);
      return;
    } else {
      setInnerValue(e.target.value);
    }
  }

  function update() {
    const txt = innerRef.current;
    if (txt) {
      const div = divRef.current;
      const content = txt.value;
      div.innerHTML = content;
      div.style.visibility = "hidden";
      div.style.display = "block";
      txt.style.height = `${div.offsetHeight}px`;
      div.style.visibility = "visible";
      div.style.display = "none";
    }
  }

  function handleKeyDown(e) {
    // if (e.keyCode === 13) {
    //   e.preventDefault();
    //   return false;
    // }
  }

  const lh = React.useMemo(
    () => (innerRef.current ? lineHeight(innerRef.current) : 16),
    []
  );

  const content = value || innerValue;

  return (
    <>
      <textarea
        {...props}
        className={`textarea h-24 py-2 text-sm ${className}`}
        value={content}
        name={name}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        ref={(r) => {
          innerRef.current = r;
          ref && ref(r);
        }}
      />
      <div
        ref={divRef}
        className="textarea-sizer"
        style={{
          minHeight: minHeight ? minHeight : `${lh}px`,
          background: "red",
        }}
      >
        {" "}
      </div>
    </>
  );
}

const TextArea = React.forwardRef(TextAreaResize);

export default TextArea;
