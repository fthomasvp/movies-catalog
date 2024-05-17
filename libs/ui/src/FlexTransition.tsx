import { useState } from "react";

import "./App.css";

export function FlexTransition() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* max-h-[568px] */}
      <div
        className="flex h-[568px] max-w-80 flex-col rounded-xl bg-blue-700 px-6 py-7"
        onClick={() => setIsOpen((p) => !p)}
      >
        {/* isOpen FALSE */}
        <p>Get $25 off!</p>

        {/* isOpen TRUE */}
        <div
          className="flex flex-col space-y-4 overflow-hidden"
          style={{
            height: "auto",
            flex: isOpen ? 1 : 0,
            transition: "flex .4s linear",
          }}
        >
          <div id="header" className="space-y-2">
            <p>Some things</p>
            <h3>Some things</h3>
            <p>Some things</p>
          </div>
          <div id="form" className="flex flex-col space-y-2">
            <input type="text" />
            <input type="text" />
            <div className="flex items-baseline">
              <input type="checkbox" />
              <span className="text-xs">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolor
                numquam eligendi rerum labore error iste neque architecto.
              </span>
            </div>
          </div>
          <div id="submit">
            <button type="submit">Get Discount</button>
          </div>
        </div>
      </div>
    </>
  );
}
