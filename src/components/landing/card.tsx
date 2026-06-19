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
    <div className="group bg-card border-border hover:border-foreground/20 flex h-full flex-col rounded-xl border p-6 transition-all duration-200 hover:shadow-md">
      <div className="bg-foreground mb-5 flex h-11 w-11 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105">
        {icon}
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};
