import { Link } from "react-router-dom";
import { format, parse } from "date-fns";
import { Calendar, MapPin, DollarSign } from "lucide-react";
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

  const formatDate = (dateStr) => {
    try {
      // Parse the date in DD-MM-YYYY format
      const date = parse(dateStr, "dd-MM-yyyy", new Date());
      return format(date, "MMM d, yyyy");
    } catch (error) {
      console.error("Error parsing date:", error);
      return dateStr;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => {
        const eventItem = event.payload.items[0];
        return (
          <Link to={`/events/${event.id}`} key={event.id}>
            <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-48 w-full">
                <img
                  src={event.payload.image || "/placeholder.svg"}
                  alt={eventItem.event_name}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-2 right-2 capitalize">
                  {event.city}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg line-clamp-1">
                  {eventItem.event_name}
                </h3>
                <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                  {eventItem.event_description}
                </p>
              </CardContent>
              <CardFooter className="flex flex-col items-start p-4 pt-0 gap-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    {formatDate(event.payload.event_date)} •{" "}
                    {event.payload.event_time}
                  </span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{event.city}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4 mr-2" />
                  <span>
                    {eventItem.sell_price}{" "}
                    <span className="line-through ml-1">
                      {eventItem.orig_price}
                    </span>
                  </span>
                </div>
              </CardFooter>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
