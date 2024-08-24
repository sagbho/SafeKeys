"use client";
import React, { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { SaveDialog } from "@/components/save-dialog";
import { Password } from "@/types";
import { decryptPassword } from "@/lib/crypto";
const FormSchema = z.object({
  uppercase: z.boolean(),
  specialChars: z.boolean(),
  numbers: z.boolean(),
  passwordLength: z.number().min(8).max(25),
});

export default function GeneratePage() {
  const [password, setPassword] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      uppercase: true,
      specialChars: true,
      numbers: true,
      passwordLength: 16,
    },
  });

  const generatePassword = (data: z.infer<typeof FormSchema>) => {
    const lowercase: string = "abcdefghijklmnopqrstuvwxyz";
    const uppercase: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers: string = "0123456789";
    const specialChars: string = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    const chars = `${lowercase}${data.uppercase ? uppercase : ""}${
      data.numbers ? numbers : ""
    }${data.specialChars ? specialChars : ""}`;

    let pw: string = "";
    for (var i = 0; i < data.passwordLength; i++) {
      pw += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setPassword(pw);
  };

  const copyPasswordToClipboard = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!password) return;
    e.preventDefault();
    navigator.clipboard.writeText(password);
    toast({
      title: "Password copied",
      description: "Password copied to clipboard",
    });
  };

  const handleClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    e.currentTarget.select();
  };

  const handleSave = (newPassword: Password) => {
    const decryptedPassword = decryptPassword(newPassword.password);
    setPassword(decryptedPassword);
  };
  return (
    <div className="flex flex-col items-center text-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(generatePassword)}>
          <h1 className="text-3xl font-bold tracking-tighter p-10">
            Password Generator
          </h1>
          <div className="grid grid-cols-2 grid-rows-2 gap-6 pb-4 ">
            {/* Options */}
            <FormField
              control={form.control}
              name="uppercase"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Include Uppercase Characters</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialChars"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Include Special Characters</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numbers"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Include Numbers</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwordLength"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center space-x-0 space-y-3 rounded-md border p-4 shadow">
                  <div className="space-y-3 leading-none">
                    <FormLabel>Password Length</FormLabel>
                  </div>
                  <FormControl>
                    <Slider
                      defaultValue={[field.value]}
                      min={8}
                      max={25}
                      step={1}
                      aria-label="passwordLength"
                      onValueChange={(value) => {
                        field.onChange(value[0]);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value}
                    {field.value === 8
                      ? " Passwords are weaker and easier to crack"
                      : ""}
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
          <Textarea
            value={password}
            className="flex rounded-md border shadow resize-none items-center text-center justify-center disabled:cursor-text"
            onClick={handleClick}
            disabled
          ></Textarea>

          <div className="flex flex-col pt-4 space-y-3 items-center ">
            <Button
              onClick={() => {
                toast({
                  title: "Password generated",
                  description: "Password generated successfully",
                });
              }}
            >
              Generate
            </Button>
            {password.length > 0 && (
              <Button
                className="bg-blue-500 hover:bg-blue-600"
                onClick={copyPasswordToClipboard}
              >
                Copy Password
              </Button>
            )}
            {password.length > 0 && (
              <SaveDialog onSave={handleSave} generatedPassword={password} />
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
