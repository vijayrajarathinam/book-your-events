import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Calendar, MapPin } from "lucide-react";
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

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Link to={`/events/${event.id}`} key={event.id} className="block">
          <div className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
            <div className="relative h-40 sm:h-32 sm:w-48 rounded-md overflow-hidden">
              <img
                src={event.image || "https://placehold.co/400x200"}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col">
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">{event.title}</h3>
                  <div className="flex gap-1 flex-wrap">
                    {event.categories?.map((category) => (
                      <Badge
                        key={category}
                        variant="secondary"
                        className="ml-2"
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                  {event.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
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
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
