"use client";
import { useState } from "react";

export default function StageTabs({
  tabs,
}: {
  tabs: {
    id: string;
    header: string;
    content: JSX.Element;
  }[];
}) {
  const [selectedId, setSelectedId] = useState(tabs[0].id);
  const selectedTab = tabs.find((tab) => tab.id === selectedId);

  if (!selectedTab) {
    return null;
  }

  return (
    <>
      <div className="flex flex-row">
        {tabs.map((tab) => (
          <div
            className={`${
              selectedId === tab.id
                ? "bg-black text-white"
                : "bg-white text-black"
            } p-1 w-full border-2 border-black opacity-80 `}
            key={tab.id}
            onClick={() => setSelectedId(tab.id)}
          >
            {tab.header}
          </div>
        ))}
      </div>
      <div
        className="flex flex-col w-full overflow-y-auto h-full"
        key={selectedId}
      >
        {selectedTab.content}
      </div>
    </>
  );
}
