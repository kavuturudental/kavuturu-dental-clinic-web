import useInViewOnce from "../../hooks/useInViewOnce";

/**
 * Lightweight fade/slide-in on scroll (replaces framer-motion's
 * `initial` + `whileInView` + `viewport={{ once: true }}` pattern
 * so the homepage doesn't need to ship the framer-motion library).
 */
function Reveal({
  children,
  x = 0,
  y = 0,
  duration = 0.6,
  delay = 0,
  className = "",
  as: Tag = "div",
}) {
  const [ref, inView] = useInViewOnce("0px");

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : `translate3d(${x}px, ${y}px, 0)`,
        transition: `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s`,
      }}
    >
      {children}
    </Tag>
  );
}

export default Reveal;
