// Base URL for the JSON server
const API_URL = "http://localhost:3002";

// Fetch all events with optional filters
export async function fetchEvents(city, query) {
  try {
    let url = `${API_URL}/events`;
    const params = new URLSearchParams();

    if (city && city !== "all") {
      params.append("city", city);
    }

    if (query) {
      // Search in event_name, event_title, and event_description
      url += `?${params.toString()}&q=${query}`;
    } else if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

// Fetch a single event by ID
export async function fetchEventById(id) {
  try {
    const response = await fetch(`${API_URL}/events/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching event with ID ${id}:`, error);
    throw error;
  }
}

// Add a new event
export async function addEvent(event) {
  try {
    const response = await fetch(`${API_URL}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding event:", error);
    throw error;
  }
}

// Update an existing event
export async function updateEvent(id, event) {
  try {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating event with ID ${id}:`, error);
    throw error;
  }
}

// Delete an event
export async function deleteEvent(id) {
  try {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error deleting event with ID ${id}:`, error);
    throw error;
  }
}
