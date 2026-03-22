"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { createRoom } from "@/utils/room";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import OtpInput from "react-otp-input";
import { toast } from "sonner";
import { z } from "zod";

export const RoomJoin = ({ roomId }: { roomId: string }) => {
  const getOtp = () => {
    if (!roomId || roomId.length !== 7) {
      return "";
    }
    const temp = roomId.replaceAll("-", "");
    const otp = temp.slice(0, 6);
    if (otp.length !== 6) {
      return "";
    }
    return otp;
  };
  const router = useRouter();

  const form = useForm<{ otp: string }>({
    resolver: zodResolver(
      z.object({
        otp: z.string().min(6, "Kod jest wymagany").max(6, "Wprowadź 6 cyfr"),
      }),
    ),
    defaultValues: {
      otp: getOtp(),
    },
  });

  const { isPending, mutate } = api.room.join.useMutation({
    onSuccess: (data) => {
      createRoom(data);
      router.push(`/rooms/${data.id}`);
      toast.success("Dołączono do pokoju");
    },
    onError: () => {
      toast.error("Błąd podczas dołączania do pokoju");
    },
  });

  const onSubmit = (data: { otp: string }) => {
    const temp = data.otp.slice(0, 3) + "-" + data.otp.slice(3);
    mutate({
      otp: temp,
    });
  };

  return (
    <>
      <div className="flex h-screen w-full flex-col items-center justify-center gap-10">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold" id="room-code-heading">
            Podaj kod do pokoju
          </h1>
          <p id="room-code-description">
            Wpisz w to miejsce kod dostępu do pokoju
          </p>
        </div>
        <form
          className="flex flex-col items-center justify-center gap-10"
          onSubmit={form.handleSubmit(onSubmit)}
          aria-labelledby="room-code-heading"
          aria-describedby="room-code-description"
        >
          <OtpInput
            value={form.watch("otp")}
            onChange={(val) => {
              form.setValue("otp", val);
            }}
            numInputs={6}
            renderSeparator={(index) =>
              index === 2 ? (
                <span aria-hidden="true">-</span>
              ) : undefined
            }
            inputStyle={{
              width: "50px",
              height: "100px",
              border: "1px solid #ccc",
              fontSize: "24px",
              borderRadius: "5px",
              textAlign: "center",
              margin: "0 10px",
            }}
            renderInput={(props, index) => (
              <Input
                {...props}
                aria-label={`Znak ${index + 1} kodu pokoju`}
              />
            )}
          />
          <Button
            className="w-3/5"
            disabled={form.watch("otp").length !== 6 || isPending}
            type="submit"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span>Dalej</span>
            )}
          </Button>
        </form>
      </div>
    </>
  );
};
