"use client";

import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Password } from "@/types";
import { useEffect } from "react";
import { useToast } from "./ui/use-toast";

const formSchema = z.object({
  service: z.string().min(1, { message: "Service is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export function SaveDialog({
  onSave,
  generatedPassword,
}: {
  onSave: (password: Password) => void;
  generatedPassword: string;
}) {
  const router = useRouter();
  const passedInPassword = generatedPassword;
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      service: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    form.setValue("password", passedInPassword);
  }, [passedInPassword]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/passwords", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error Response:", errorData);
        throw new Error(`Error: ${response.status} - ${errorData.error}`);
      }

      const newPassword = await response.json();

      toast({
        title: "Password saved",
        description: "Password saved successfully",
      });
      onSave(newPassword);
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Failed to add password",
        description: (error as Error).message,
      });
    }
    form.reset();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-green-500 hover:bg-green-600">
          Save to Vault
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Password</DialogTitle>
          <DialogDescription>
            Save this password to your vault.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="service"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service</FormLabel>
                  <FormControl>
                    <Input placeholder="Service" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" className="primary">
                Save Password
              </Button>
              <DialogClose asChild>
                <Button type="button">Close</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
