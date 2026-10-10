export function PublicPageIntro({
  section,
  title,
  description,
}: {
  section: string;
  title: string;
  description: string;
}) {
  return (
    <section className="public-page-intro">
      <div className="public-page-intro-inner">
        <p className="public-page-intro-kicker">{section}</p>
        <h1 className="public-page-intro-title">{title}</h1>
        <p className="public-page-intro-copy">{description}</p>
      </div>
    </section>
  );
}
