import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { mascot } from "../assets/mascot";

// smooth acceleration/deceleration for the flight path
const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const lerp = (a, b, t) => a + (b - a) * t;

// how big the mascot ends up once docked in the navbar (matches the
// .mascot-dock height in App.css)
const DOCK_SIZE = 40;

// scroll-progress thresholds (0 = top of hero, 1 = fully scrolled past)
const SLOT_OPEN_AT = 0.55; // navbar starts opening a slot for the mascot
const POSE_MID_AT = 0.4; // switch to the "mid-flight" pose
const LANDED_AT = 0.95; // mascot has arrived, pose settles + pill grows

export default function MainLayout() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [flyer, setFlyer] = useState(null); // { style, src }
  const rafRef = useRef(null);

  useEffect(() => {
    // stop the browser from restoring the old scroll offset on back/forward
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    // the hero (and its mascot anchor) only exists on some routes, and
    // remounts on navigation, so re-measure everything on each route change
    setFlyer(null);
    setScrolled(false);

    // every new page starts at the top, regardless of where the last
    // page was scrolled to — "auto" so it jumps instantly, not smoothly
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const update = () => {
      const heroAnchor = document.getElementById("hero-mascot-anchor");
      const dock = document.getElementById("mascot-dock");

      // no hero on this page (shop, mail club, event detail, 404) —
      // just let the pill sit in its "settled" state, no flying mascot
      if (!heroAnchor || !dock) {
        setScrolled(window.scrollY > 24);
        setFlyer(null);
        return;
      }

      const heroSection = heroAnchor.closest(".hero");
      const heroHeight = heroSection ? heroSection.offsetHeight : 600;
      const progress = clamp(window.scrollY / heroHeight, 0, 1);
      const eased = easeInOutCubic(progress);

      // open up the dock slot inside the pill as the mascot approaches —
      // set directly on the DOM (not via React state) so the very next
      // line can read its up-to-date position with zero frame lag
      const slotT = easeInOutCubic(
        clamp((progress - SLOT_OPEN_AT) / (1 - SLOT_OPEN_AT), 0, 1),
      );
      dock.style.width = `${DOCK_SIZE * slotT}px`;
      dock.style.marginRight = `${10 * slotT}px`;

      const dockRect = dock.getBoundingClientRect();

      // read the mascot's LIVE natural position every single frame —
      // it never actually leaves the DOM (we only fade its opacity), so
      // this is always accurate and can never go stale, unlike a value
      // captured once and cached in a ref
      const liveRect = heroAnchor.getBoundingClientRect();

      // fly between CENTER points rather than box edges — the dock's own
      // box is opening from 0 width during the flight, so its edges move,
      // but its vertical center and left edge stay put, giving a stable target
      const startCenterX = liveRect.left + liveRect.width / 2;
      const startCenterY = liveRect.top + liveRect.height / 2;
      const endCenterX = dockRect.left + DOCK_SIZE / 2;
      const endCenterY = dockRect.top + dockRect.height / 2;

      const size = lerp(
        Math.max(liveRect.width, liveRect.height),
        DOCK_SIZE,
        eased,
      );
      const cx = lerp(startCenterX, endCenterX, eased);
      const cy = lerp(startCenterY, endCenterY, eased);

      // a little scroll-scrubbed "bounce" right as it settles into the dock
      let bounce = 1;
      if (progress > LANDED_AT) {
        const t = clamp((progress - LANDED_AT) / (1 - LANDED_AT), 0, 1);
        bounce = 1 + 0.22 * Math.sin(t * Math.PI) * (1 - t);
      }

      // three-frame "flip book": leaving the hero, mid-flight, landed
      let src = mascot.hello;
      if (progress >= LANDED_AT) src = mascot.shrug;
      else if (progress >= POSE_MID_AT) src = mascot.yay;

      setFlyer({
        src,
        style: {
          position: "fixed",
          left: cx - (size * bounce) / 2,
          top: cy - (size * bounce) / 2,
          width: size * bounce,
          height: size * bounce,
          opacity: progress > 0.02 ? 1 : 0,
          transform: `rotate(${(1 - eased) * -6}deg)`,
        },
      });

      // fade the in-flow hero mascot out quickly as the flight begins, so
      // it reads as "one mascot took off" rather than two overlapping copies
      heroAnchor.style.opacity = String(Math.max(0, 1 - progress / 0.3));

      setScrolled(progress >= LANDED_AT);
    };

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        update();
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [location.pathname]);

  return (
    <div className="app-shell torn-sides">
      <Navbar scrolled={scrolled} />
      {flyer && (
        <img
          src={flyer.src}
          alt=""
          className="mascot mascot-flyer"
          style={flyer.style}
        />
      )}
      <main className="main-content paper-grain">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
