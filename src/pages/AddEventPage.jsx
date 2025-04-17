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
import { useDispatch } from "react-redux";
import { fetchEvents } from "../store/slices/eventsSlice";
import { cities } from "../data/cities";

const formSchema = z.object({
  city: z.string().min(1, { message: "Please select a city" }),
  event_name: z
    .string()
    .min(3, { message: "Event name must be at least 3 characters" }),
  event_title: z
    .string()
    .min(3, { message: "Event title must be at least 3 characters" }),
  event_description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  event_date: z.date({ required_error: "Please select a date" }),
  event_time: z.string({ required_error: "Please enter a time" }),
  address_1: z
    .string()
    .min(5, { message: "Address must be at least 5 characters" }),
  address_2: z.string().optional(),
  city_name: z
    .string()
    .min(2, { message: "City name must be at least 2 characters" }),
  phone_number: z
    .string()
    .min(10, { message: "Phone number must be at least 10 characters" }),
  company_name: z
    .string()
    .min(2, { message: "Company name must be at least 2 characters" }),
  sell_price: z.string().min(1, { message: "Please enter selling price" }),
  orig_price: z.string().min(1, { message: "Please enter original price" }),
  image: z.string().url({ message: "Please enter a valid image URL" }),
});

export default function AddEventPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: "",
      event_name: "",
      event_title: "",
      event_description: "",
      address_1: "",
      address_2: "",
      city_name: "",
      phone_number: "",
      company_name: "",
      sell_price: "",
      orig_price: "",
      image:
        "https://corefestival.com/uploads/resized/uploads/256610/220528-132053-CORE22-HL-_HIL2573-LR_2022-10-27-121950_yhmp_4092684b658d2e7b7a3f764f5c1c951a.webp",
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // Format date to DD-MM-YYYY
      const formattedDate = format(data.event_date, "dd-MM-yyyy");

      // Create event object with the new structure
      const eventData = {
        id: Date.now(),
        type: "CREATED",
        owner_id: "123663",
        city: data.city,
        payload: {
          event_date: formattedDate,
          event_time: data.event_time,
          image: data.image,
          items: [
            {
              event_id: Date.now().toString(),
              event_name: data.event_name,
              event_title: data.event_title,
              event_description: data.event_description,
              location: {
                loc_address: {
                  name: data.company_name,
                  address_1: data.address_1,
                  address_2: data.address_2 || "",
                  city_name: data.city_name,
                  state_id: 62,
                  state_short_name: "ST",
                  postal_code: "000000",
                  phone_number: data.phone_number,
                  country_name: "India",
                  country_code: 91,
                  is_commercial: true,
                  company_name: data.company_name,
                },
                loc_geometry: {
                  type: "Point",
                  coordinates: [-72.7738706, 41.6332836],
                },
              },
              sell_price: data.sell_price,
              orig_price: data.orig_price,
            },
          ],
        },
        published_at: formattedDate,
      };

      await addEvent(eventData);
      // Refresh events list after adding a new event
      dispatch(fetchEvents({}));
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
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a city" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cities
                            .filter((c) => c !== "all")
                            .map((city) => (
                              <SelectItem
                                key={city}
                                value={city}
                                className="capitalize"
                              >
                                {city}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="event_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter event name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="event_title"
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
                  name="event_description"
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
                    name="event_date"
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
                    name="event_time"
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

                <FormField
                  control={form.control}
                  name="address_1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 1</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter address line 1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address_2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 2 (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter address line 2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="city_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter city name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="sell_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Selling Price</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. $100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="orig_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Original Price</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. $150" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter image URL" {...field} />
                      </FormControl>
                      <FormMessage />
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
