import { mascot } from "../assets/mascot";

/**
 * Full-screen (or inline) loading state for the storefront — matches the
 * paper-texture theme so it never looks like a jarring blank flash between
 * the site and whatever's still loading.
 *
 * @param {string} label - text under the spinner, e.g. "Loading the shop…"
 * @param {boolean} inline - false (default): covers the whole viewport,
 *   for page-level loads. true: sits inline in normal document flow, sized
 *   to its container — for loading a section without hiding the nav/footer.
 * @param {string} mascotImage - which mascot pose to show (defaults to the
 *   waving "hello" pose). Pass `mascot.grumpy` etc. for other moments.
 */
export const LoadingScreen = ({
  label = "Just a moment…",
  inline = false,
  mascotImage = mascot.hello,
}) => {
  return (
    <div
      className={`loading-screen paper-grain${inline ? " loading-screen--inline" : ""}`}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <img src={mascotImage} alt="" className="mascot loading-screen__mascot" />

      <svg className="loading-screen__spinner" viewBox="0 0 50 50" fill="none" aria-hidden="true">
        <circle cx="25" cy="25" r="20" stroke="var(--paper-line)" strokeWidth="4" />
        <circle
          cx="25"
          cy="25"
          r="20"
          stroke="var(--plum)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="90 125"
        />
      </svg>

      <span className="loading-screen__label">{label}</span>
    </div>
  );
};