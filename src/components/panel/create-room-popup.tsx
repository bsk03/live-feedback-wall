"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useSession } from "@/lib/auth-client";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const CreateRoomPopup = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const utils = api.useUtils();
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);

  const form = useForm<{ name: string }>({
    resolver: zodResolver(
      z.object({
        name: z.string().min(1, "Nazwa pokoju jest wymagana"),
      }),
    ),
    defaultValues: {
      name: "",
    },
  });

  const createRoom = api.room.create.useMutation({
    onSuccess: () => {
      utils.room.infiniteList.invalidate();
      setOpen(false);
      toast.success("Pokój stworzony");
      setName("");
    },
  });
  const onSubmit = (data: { name: string }) => {
    createRoom.mutate({
      name: data.name,
    });
  };
  const session = useSession();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Podaj nazwę pokoju</DialogTitle>
          <DialogDescription>
            Nazwa pokoju będzie widoczna dla innych użytkowników.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <Input placeholder="Nazwa pokoju" {...form.register("name")} />
            <Button type="submit">Stwórz</Button>
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
