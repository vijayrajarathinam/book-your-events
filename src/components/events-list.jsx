import { Link } from "react-router-dom";
import { format, parse } from "date-fns";
import { Calendar, MapPin, DollarSign } from "lucide-react";
import { Badge } from "./ui/badge";

export default function EventsList({ events }) {
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
    <div className="space-y-4">
      {events.map((event) => {
        const eventItem = event.payload.items[0];
        return (
          <Link to={`/events/${event.id}`} key={event.id} className="block">
            <div className="flex flex-col sm:flex-row gap-4 p-4 border border-border rounded-lg hover:shadow-md transition-shadow bg-card">
              <div className="relative h-40 sm:h-32 sm:w-48 rounded-md overflow-hidden">
                <img
                  src={event.payload.image || "/placeholder.svg"}
                  alt={eventItem.event_name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">
                      {eventItem.event_name}
                    </h3>
                    <Badge variant="secondary" className="ml-2 capitalize">
                      {event.city}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                    {eventItem.event_description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
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
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
