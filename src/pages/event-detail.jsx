import { useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { mascot } from "../assets/mascot";

const EVENTS = {
  "linocut-workshop": {
    kicker: "workshop",
    title: "Linocut Printmaking Workshop",
    tagline: "Carve, ink, and pull your first print.",
    description:
      "A relaxed, beginner-friendly session in the studio downstairs. We'll cover carving technique, registration, and hand-inking a two-colour print no experience needed, and everyone leaves with a small stack of prints to keep.",
    location: "Studio downstairs",
    duration: "2.5 hours",
    price: "$45",
    totalSeats: 12,
    bookedSeats: 9,
    images: [
      "carving station",
      "inked block",
      "finished prints",
      "studio table",
    ],
    videos: ["carving technique", "inking demo", "last workshop recap"],
    days: [
      {
        day: "Sat",
        date: "29",
        month: "Aug",
        slots: ["10:00am", "11:00am", "2:00pm"],
      },
      { day: "Sat", date: "5", month: "Sep", slots: ["10:00am", "1:00pm"] },
      {
        day: "Sat",
        date: "12",
        month: "Sep",
        slots: ["11:00am", "2:00pm", "3:30pm"],
      },
    ],
  },
  "ceramics-open-studio": {
    kicker: "open studio",
    title: "Ceramics Open Studio",
    tagline: "Wheel time, glazing, and no rules.",
    description:
      "Drop into the studio for a self-directed session at the wheel or hand-building table. A staff potter is around for questions, but this one's mostly just you and the clay.",
    location: "Studio downstairs",
    duration: "3 hours",
    price: "$38",
    totalSeats: 8,
    bookedSeats: 3,
    images: [
      "wheel station",
      "glaze wall",
      "drying shelf",
      "hand-building table",
    ],
    videos: ["centering the clay", "glazing basics"],
    days: [
      { day: "Sun", date: "30", month: "Aug", slots: ["12:00pm", "3:00pm"] },
      {
        day: "Sun",
        date: "6",
        month: "Sep",
        slots: ["12:00pm", "3:00pm", "5:00pm"],
      },
    ],
  },
};

const SeatMeter = ({ total, booked }) => {
  const left = total - booked;
  const pct = Math.round((booked / total) * 100);
  return (
    <div className="seat-meter">
      <span className="seat-meter__label">
        {left} of {total} seats left
      </span>
      <div className="seat-meter__bar">
        <div className="seat-meter__fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
    <circle cx="10" cy="10" r="9" fill="var(--cream)" opacity="0.15" />
    <path d="M8 6.2 L14.5 10 L8 13.8 Z" fill="var(--cream)" />
  </svg>
);

export const EventDetail = () => {
  const { eventId } = useParams();
  const event = EVENTS[eventId];

  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);
  const [booked, setBooked] = useState(false);
  const carouselRef = useRef(null);

  const activeDay = useMemo(
    () => (event ? event.days[selectedDay] : null),
    [event, selectedDay],
  );

  if (!event) {
    return (
      <section className="page">
        <h1>Event not found</h1>
        <p>We couldn't find that one it may have already wrapped up.</p>
        <Link
          to="/"
          className="btn btn-outline doodle doodle-tight"
          style={{ marginTop: 16 }}
        >
          Back home
        </Link>
      </section>
    );
  }

  const scrollCarousel = (dir) => {
    carouselRef.current?.scrollBy({ left: dir * 240, behavior: "smooth" });
  };

  const pickDay = (i) => {
    setSelectedDay(i);
    setSelectedTime(null);
  };

  return (
    <section className="page event-page">
      <div className="event-hero">
        <span className="eyebrow">{event.kicker}</span>
        <h1>{event.title}</h1>
        <p
          style={{
            fontSize: "1.05rem",
            color: "var(--brown-soft)",
            maxWidth: "58ch",
          }}
        >
          {event.description}
        </p>
        <div className="event-meta">
          <span className="tag">{event.price}</span>
          <span className="tag">{event.duration}</span>
          <span className="sticky-note">{event.location}</span>
        </div>
        <SeatMeter total={event.totalSeats} booked={event.bookedSeats} />
      </div>

      <h2 style={{ marginTop: 40 }}>Gallery</h2>
      <div className="gallery-grid">
        {event.images.map((label) => (
          <div className="gallery-item doodle" key={label}>
            <div className="gallery-item__media">{label}</div>
          </div>
        ))}
      </div>

      <h2>Watch</h2>
      <div className="video-carousel-wrap">
        <button
          className="carousel-btn"
          onClick={() => scrollCarousel(-1)}
          aria-label="Scroll videos left"
        >
          ‹
        </button>
        <div className="video-carousel" ref={carouselRef}>
          {event.videos.map((label) => (
            <div className="video-card doodle" key={label}>
              <div className="video-card__thumb">
                <PlayIcon />
              </div>
              <p>{label}</p>
            </div>
          ))}
        </div>
        <button
          className="carousel-btn"
          onClick={() => scrollCarousel(1)}
          aria-label="Scroll videos right"
        >
          ›
        </button>
      </div>

      <h2>Pick a date</h2>
      <div className="booking-panel doodle">
        <div className="booking-panel__calendar">
          <div className="calendar">
            {event.days.map((d, i) => (
              <button
                key={`${d.month}-${d.date}`}
                className={`calendar__day${i === selectedDay ? " selected" : ""}`}
                onClick={() => pickDay(i)}
              >
                <span className="calendar__day-name">{d.day}</span>
                <span className="calendar__day-num">{d.date}</span>
                <span className="calendar__day-month">{d.month}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="booking-panel__slots">
          <h3>
            {activeDay.day} {activeDay.date} {activeDay.month}
          </h3>
          {activeDay.slots.map((t) => (
            <button
              key={t}
              className={`time-slot${selectedTime === t ? " selected" : ""}`}
              onClick={() => setSelectedTime(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="booking-cta">
        {booked ? (
          <div className="confirm-note">
            <img src={mascot.yay} alt="" className="mascot" />
            <span className="sticky-note" style={{ fontSize: "1.2rem" }}>
              you're in see you {activeDay.day} {activeDay.date}{" "}
              {activeDay.month} at {selectedTime}
            </span>
          </div>
        ) : (
          <button
            className="btn btn-primary doodle doodle-tight"
            disabled={!selectedTime}
            onClick={() => setBooked(true)}
          >
            Reserve your spot {event.price}
          </button>
        )}
      </div>
    </section>
  );
};
