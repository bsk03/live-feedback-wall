import React from "react";

export const Card = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="group relative rounded-lg p-[1px]">
      <div className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="bg-background relative flex h-full w-full flex-col items-center justify-center rounded-lg p-6">
        <div className="mb-4 rounded-sm bg-gradient-to-br from-blue-500 to-purple-600 p-2">
          {icon}
        </div>
        <div className="flex flex-col gap-6 text-center">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
};
