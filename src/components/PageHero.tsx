type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  accent?: string;
  titleClassName?: string;
};

export default function PageHero({ eyebrow, title, description, titleClassName }: PageHeroProps) {
  return (
    <section style={{ 
      backgroundColor: '#36533f', 
      color: '#fff', 
      textAlign: 'center', 
      padding: '2.5rem 2rem 2.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {eyebrow && (
        <p style={{ 
          fontSize: '11px', 
          textTransform: 'uppercase', 
          letterSpacing: '0.2em', 
          color: 'var(--gold)', 
          fontWeight: 'bold', 
          marginBottom: '1rem' 
        }}>
          {eyebrow}
        </p>
      )}
      <h1 style={{ 
        fontSize: '42px', 
        fontWeight: '700', 
        fontFamily: 'var(--font-serif)', 
        margin: '0 0 1.5rem 0', 
        letterSpacing: '0.02em',
        lineHeight: '1.2'
      }} className={titleClassName}>
        {title === "Browse every collection through the same rich, home-page-inspired lens" ? "Prrayasha Collections" : title}
      </h1>
      <p style={{ 
        fontSize: '15px', 
        maxWidth: '650px', 
        margin: '0 auto', 
        color: '#f0f0f0', 
        lineHeight: '1.7',
        fontWeight: '300'
      }}>
        {description}
      </p>
    </section>
  );
}
