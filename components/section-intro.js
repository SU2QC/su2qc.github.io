export function SectionIntro({ title, children, as: Heading = "h2", className = "" }) {
  return (
    <div className={`section-intro ${className}`.trim()} data-heading-description>
      <Heading>{title}</Heading>
      {children ? <p>{children}</p> : null}
    </div>
  );
}
