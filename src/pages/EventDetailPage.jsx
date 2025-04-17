"use client";

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { parse, format } from "date-fns";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  Share2,
  Heart,
  DollarSign,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import Header from "../components/header";
import ErrorBoundary from "../components/error-boundary";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEventById,
  clearSelectedEvent,
} from "../store/slices/eventsSlice";

export default function EventDetailPage() {
  const dispatch = useDispatch();
  const {
    selectedEvent: event,
    loading,
    error,
  } = useSelector((state) => state.events);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(fetchEventById(id));
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearSelectedEvent());
    };
  }, [dispatch, id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const formatDate = (dateStr) => {
    try {
      // Parse the date in DD-MM-YYYY format
      const date = parse(dateStr, "dd-MM-yyyy", new Date());
      return format(date, "EEEE, MMMM d, yyyy");
    } catch (error) {
      console.error("Error parsing date:", error);
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <ErrorBoundary>
          <Button variant="ghost" className="mb-6 pl-0" onClick={handleGoBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <p className="text-destructive text-lg">{error}</p>
              <Button onClick={() => navigate("/events")}>Go to Events</Button>
            </div>
          ) : event ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div className="relative rounded-lg overflow-hidden h-[300px] md:h-[400px]">
                  <img
                    src={event.payload.image || "/placeholder.svg"}
                    alt={event.payload.items[0].event_name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 right-4 capitalize">
                    {event.city}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h1 className="text-3xl font-bold">
                      {event.payload.items[0].event_name}
                    </h1>
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">
                      {event.payload.items[0].event_title}
                    </h2>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {event.payload.items[0].event_description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <Card className="border border-border">
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Date and time</h3>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(event.payload.event_date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{event.payload.event_time}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold">Location</h3>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{event.city}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {event.payload.items[0].location.loc_address.address_1},{" "}
                        {event.payload.items[0].location.loc_address.city_name}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold">Price</h3>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-medium text-primary">
                          {event.payload.items[0].sell_price}
                        </span>
                        <span className="line-through text-sm">
                          {event.payload.items[0].orig_price}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button className="w-full">Book Now</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-border">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-semibold">Contact Information</h3>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Phone:</span>{" "}
                        {
                          event.payload.items[0].location.loc_address
                            .phone_number
                        }
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Company:</span>{" "}
                        {
                          event.payload.items[0].location.loc_address
                            .company_name
                        }
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Country:</span>{" "}
                        {
                          event.payload.items[0].location.loc_address
                            .country_name
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <p className="text-lg">Event not found</p>
              <Button onClick={() => navigate("/events")}>Go to Events</Button>
            </div>
          )}
        </ErrorBoundary>
      </main>
    </div>
  );
}
