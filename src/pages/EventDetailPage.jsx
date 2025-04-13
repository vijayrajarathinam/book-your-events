"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  Share2,
  Heart,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import Header from "../components/header";
import ErrorBoundary from "../components/error-boundary";
import { fetchEventById } from "../services/api";

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getEvent = async () => {
      try {
        setLoading(true);
        if (id) {
          const eventData = await fetchEventById(id);
          setEvent(eventData);
          setError(null);
        }
      } catch (err) {
        setError("Failed to load event details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getEvent();
    }
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
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
                    src={event.image || "https://placehold.co/800x400"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h1 className="text-3xl font-bold">{event.title}</h1>
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {event.categories?.map((category) => (
                      <Badge key={category} variant="secondary">
                        {category}
                      </Badge>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold">About this event</h2>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Date and time</h3>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {format(new Date(event.date), "EEEE, MMMM d, yyyy")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          {format(new Date(event.date), "h:mm a")} -{" "}
                          {event.duration}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-semibold">Location</h3>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {event.address}
                      </p>
                    </div>

                    <div className="pt-4">
                      <Button className="w-full">Book Now</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-semibold">Organizer</h3>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {event.organizer?.charAt(0) || "O"}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{event.organizer}</p>
                        <p className="text-sm text-muted-foreground">
                          Event Organizer
                        </p>
                      </div>
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
