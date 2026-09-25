import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Award, Trophy, Users, Heart } from 'lucide-react';

const achievements = [
  { icon: <Trophy size={20} />, text: 'IGP1 achieved with my own dog, Koda' },
  { icon: <Award size={20} />, text: '1st place — IGP1 category, 2026 National IGP Meisterschaft' },
  { icon: <Users size={20} />, text: 'KUSA Helper' },
  { icon: <Heart size={20} />, text: 'Member of the Cape Rottweiler Club' },
];

const paragraphs = [
  'Dogs have always been a big part of my life. What started as a love for dogs grew into a passion for training, working with them and understanding what makes each dog unique.',
  'Over the years, I\u2019ve been fortunate to gain extensive hands-on experience through IGP training and competition, including achieving IGP1 with my own dog, Koda, and placing 1st in the IGP1 category at the 2026 National IGP Meisterschaft. I\u2019ve also been involved in the wider dog community as a KUSA Helper and through my involvement with the Cape Rottweiler Club.',
  'But beyond the titles and competitions, it\u2019s the dogs themselves that I enjoy most.',
  'I believe every dog has their own personality, needs and little quirks. Some are full of energy, some prefer a quiet corner, and others simply want someone to sit with them and give them a bit of attention. Understanding and caring for those differences is something that is very important to me.',
  'Doggo\u2019tel is something my wife, Laaiqah, and I built together. In fact, the idea for the dog hotel was hers \u2014 and it grew into a shared dream. We wanted to create a place where owners can leave their dogs knowing they are in safe, caring hands, and where the dogs themselves can feel comfortable, relaxed and at home.',
  'When your dog stays with us, they aren\u2019t just another booking or kennel number. We get to know them, care for them and treat them as individuals.',
  'For us, this isn\u2019t simply a business. It\u2019s a place built around something we love \u2014 dogs.',
];

const AboutPage = () => {
  return (
    <div style={{ paddingTop: 70, background: 'var(--cream)' }}>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, var(--brown-900), var(--brown-800))',
        padding: '80px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'var(--cream)', clipPath: 'ellipse(55% 100% at 50% 100%)' }} />
        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-block', background: 'rgba(245,237,224,0.12)', color: 'var(--olive-400)', padding: '4px 14px', borderRadius: 'var(--radius-full)', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
            Our Story
          </div>
          <h1 style={{ fontSize: 'clamp(30px,5vw,52px)', fontWeight: 800, color: '#f5ede0', marginBottom: 16 }}>
            Meet Yusri & Laaiqah
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(245,237,224,0.75)', lineHeight: 1.7 }}>
            The couple behind Doggo'tel — and a shared love of dogs.
          </p>
        </div>
      </section>

      {/* Story */}
      <section style={{ padding: '70px 24px' }}>
        <div style={{ maxWidth: 1050, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 48, alignItems: 'start' }}>

          {/* Left: profile card + achievements */}
          <div>
            <div style={{
              background: '#fff', borderRadius: 'var(--radius-xl)', overflow: 'hidden',
              border: '1px solid var(--brown-100)', boxShadow: 'var(--shadow-lg)', marginBottom: 24,
            }}>
              {/* Owner photo — full image, nothing cropped */}
              <img
                src="/images/Aboutus.jpeg"
                alt="Yusri and Laaiqah Damon with their dog"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
              <div style={{ padding: '20px 24px' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--brown-900)' }}>Yusri & Laaiqah Damon</div>
                <div style={{ fontSize: 14, color: 'var(--olive-700)', fontWeight: 600, marginBottom: 4 }}>Owners, Doggo'tel</div>
                <div style={{ fontSize: 13, color: 'var(--brown-500)' }}>Schaapkraal, Cape Town</div>
              </div>
            </div>

            {/* Achievements */}
            <div style={{
              background: 'var(--beige)', borderRadius: 'var(--radius-lg)', padding: '20px 24px',
              border: '1px solid var(--brown-100)',
            }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--brown-700)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
                Experience & Achievements
              </h3>
              {achievements.map(({ icon, text }, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: i < achievements.length - 1 ? 14 : 0 }}>
                  <span style={{ color: 'var(--olive-700)', flexShrink: 0, marginTop: 1 }}>{icon}</span>
                  <span style={{ fontSize: 14, color: 'var(--brown-800)', lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: the story text */}
          <div>
            {paragraphs.map((para, i) => (
              <p key={i} style={{
                fontSize: 16, lineHeight: 1.85, color: 'var(--gray-700)',
                marginBottom: 18,
                ...(i === 2 || i === 6 ? { fontWeight: 600, color: 'var(--brown-800)', fontSize: 17 } : {}),
              }}>
                {para}
              </p>
            ))}

            <div style={{ marginTop: 32, paddingTop: 28, borderTop: '1px solid var(--brown-100)' }}>
              <p style={{ fontSize: 15, color: 'var(--gray-600)', marginBottom: 20 }}>
                Ready to give your dog a home away from home?
              </p>
              <Link to="/booking" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 30px', borderRadius: 'var(--radius-full)', fontWeight: 700, fontSize: 15,
                background: 'linear-gradient(135deg, var(--olive-600), var(--olive-900))', color: '#fff',
                boxShadow: '0 4px 16px rgba(74,94,32,0.4)', textDecoration: 'none',
                transition: 'transform 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              >
                Book a Stay <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
