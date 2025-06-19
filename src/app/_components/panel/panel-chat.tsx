import React from "react";
import { Empty } from "./empty";
import { Message } from "../rooms/Message";

export const PanelChat = () => {
  return (
    <div className="col-span-3 flex w-full flex-col gap-8 overflow-hidden">
      <div className="flex h-full flex-1 flex-col gap-4">
        <p className="text-3xl font-bold">Podgląd</p>
        <div className="flex flex-col gap-4 overflow-y-auto rounded-sm border p-4 shadow-sm">
          {/* <Empty /> */}
          <Message message="message" sent_at={new Date()} />
          <Message
            message="Bardzo długa wiadomosc totalnie o niczym, chce zobaczycz jak tekst bedzie sie zawjał. zobaczymy co z tego bedzie"
            sent_at={new Date()}
          />
          <Message message="message" sent_at={new Date()} />
          <Message message="message" sent_at={new Date()} />
          <Message message="message" sent_at={new Date()} />
          <Message message="message" sent_at={new Date()} />
          <Message message="message" sent_at={new Date()} />
          <Message message="message" sent_at={new Date()} />
          <Message message="message" sent_at={new Date()} />
          <Message message="message" sent_at={new Date()} />
          <Message message="message" sent_at={new Date()} />
        </div>
      </div>
    </div>
  );
};
