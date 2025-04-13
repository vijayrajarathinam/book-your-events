import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Calendar, MapPin } from "lucide-react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";

export default function EventsGrid({ events }) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg">No events found</p>
        <p className="text-muted-foreground">Try changing your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Link to={`/events/${event.id}`} key={event.id}>
          <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-48 w-full">
              <img
                src={event.image || "https://placehold.co/400x200"}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              {event.categories && event.categories[0] && (
                <Badge className="absolute top-2 right-2">
                  {event.categories[0]}
                </Badge>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg line-clamp-1">
                {event.title}
              </h3>
              <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                {event.description}
              </p>
            </CardContent>
            <CardFooter className="flex flex-col items-start p-4 pt-0 gap-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  {format(new Date(event.date), "MMM d, yyyy • h:mm a")}
                </span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{event.location}</span>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
