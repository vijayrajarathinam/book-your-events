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
import { useEventsContext } from "../context/events-context";

function EventsContent() {
  const { events, loading, error, fetchEvents } = useEventsContext();
  const [viewMode, setViewMode] = (useState < "grid") | ("list" > "grid");
  const [searchParams] = useSearchParams();
  const location = searchParams.get("location") || "all";
  const category = searchParams.get("category") || "all";
  const query = searchParams.get("q") || "";

  useEffect(() => {
    fetchEvents(location, category, query);
  }, [fetchEvents, location, category, query]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Events</h1>
        <p className="text-muted-foreground">
          Discover amazing events happening near you
        </p>
      </div>

      <EventsFilter />

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {location === "all" ? "All Events" : `Events in ${location}`}
        </h2>
        <Tabs
          defaultValue={viewMode}
          onValueChange={(value) => setViewMode(value)}
          className="w-auto"
        >
          <TabsList className="grid w-[160px] grid-cols-2">
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
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-destructive text-lg">Failed to load events</p>
          <Button onClick={() => fetchEvents(location, category, query)}>
            Try Again
          </Button>
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
