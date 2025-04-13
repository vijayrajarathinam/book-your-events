"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Calendar as CalendarComponent } from "../components/ui/calendar";
import Header from "../components/header";
import ErrorBoundary from "../components/error-boundary";
import { addEvent } from "../services/api";
import { locations } from "../data/locations";
import { categories } from "../data/categories";

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  date: z.date({ required_error: "Please select a date" }),
  time: z.string({ required_error: "Please enter a time" }),
  duration: z.string().min(1, { message: "Please enter duration" }),
  location: z.string({ required_error: "Please select a location" }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters" }),
  organizer: z
    .string()
    .min(2, { message: "Organizer name must be at least 2 characters" }),
  categories: z
    .string()
    .array()
    .min(1, { message: "Please select at least one category" }),
  image: z.string().optional(),
});

export default function AddEventPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: "2 hours",
      address: "",
      organizer: "",
      categories: [],
      image: "https://placehold.co/800x400",
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // Combine date and time
      const eventDate = new Date(data.date);
      const [hours, minutes] = data.time.split(":").map(Number);
      eventDate.setHours(hours, minutes);

      const eventData = {
        ...data,
        date: eventDate.toISOString(),
        id: Date.now().toString(),
      };

      await addEvent(eventData);
      navigate("/events");
    } catch (error) {
      console.error("Failed to add event:", error);
      form.setError("root", {
        message: "Failed to add event. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        const updated = prev.filter((c) => c !== category);
        form.setValue("categories", updated);
        return updated;
      } else {
        const updated = [...prev, category];
        form.setValue("categories", updated);
        return updated;
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <ErrorBoundary>
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">
                Add New Event
              </h1>
              <p className="text-muted-foreground mt-1">
                Fill in the details to create a new event
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter event title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your event"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className="w-full pl-3 text-left font-normal"
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span className="text-muted-foreground">
                                    Pick a date
                                  </span>
                                )}
                                <Calendar className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 2 hours" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {locations.map((location) => (
                              <SelectItem key={location} value={location}>
                                {location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter venue address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="organizer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organizer</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter organizer name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categories"
                  render={() => (
                    <FormItem>
                      <FormLabel>Categories</FormLabel>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {categories.map((category) => (
                          <Button
                            key={category}
                            type="button"
                            variant={
                              selectedCategories.includes(category)
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => handleCategoryChange(category)}
                            className="rounded-full"
                          >
                            {category}
                          </Button>
                        ))}
                      </div>
                      {form.formState.errors.categories && (
                        <p className="text-sm font-medium text-destructive mt-2">
                          {form.formState.errors.categories.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                {form.formState.errors.root && (
                  <div className="rounded-md bg-destructive/15 p-3">
                    <p className="text-sm text-destructive">
                      {form.formState.errors.root.message}
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Event"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </ErrorBoundary>
      </main>
    </div>
  );
}
