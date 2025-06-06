"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/header";
import EventsFilter from "../components/events-filter";
import EventsGrid from "../components/events-grid";
import EventsList from "../components/events-list";
import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { LayoutGrid, List } from "lucide-react";
import ErrorBoundary from "../components/error-boundary";
import { useSelector, useDispatch } from "react-redux";
import { fetchEvents } from "../store/slices/eventsSlice";

function EventsContent() {
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state.events);
  const [viewMode, setViewMode] = useState("list"); // ("list" , "grid");
  const [searchParams] = useSearchParams();
  const city = searchParams.get("city") || "all";
  const query = searchParams.get("q") || "";

  useEffect(() => {
    dispatch(fetchEvents({ city, query }));
  }, [dispatch, city, query]);

  return (
    <div className="flex flex-col gap-6">
      <EventsFilter />

      <div className="flex flex-col justify-between items-center">
        <h2 className="text-xl font-semibold capitalize">
          {city === "all" ? "All Events" : `Events in ${city}`}
        </h2>
        <Tabs
          defaultValue={viewMode}
          onValueChange={(value) => setViewMode(value)}
          className="w-auto "
        >
          <TabsList className="hidden md:grid w-[160px] grid-cols-2">
            <TabsTrigger value="grid" className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              <span>Grid</span>
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              <span>List</span>
            </TabsTrigger>
          </TabsList>
          {!loading && !error && (
            <>
              <TabsContent value="grid">
                <EventsGrid events={events} />
              </TabsContent>
              <TabsContent value="list">
                <EventsList events={events} />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64" role="status">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-destructive text-lg">Failed to load events</p>
          <Button onClick={() => fetchEvents(city, query)}>Try Again</Button>
        </div>
      ) : (
        <div className="mt-6">
          {/* This div is just a placeholder to maintain spacing */}
        </div>
      )}
    </div>
  );
}

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <ErrorBoundary>
          <EventsContent />
        </ErrorBoundary>
      </main>
    </div>
  );
}
