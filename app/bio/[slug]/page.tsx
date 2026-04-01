import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/db";
import Image from "next/image";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BioPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const { colors, fonts, logos, voice, bio_links, name } = project;

  return (
    <>
      <style>{`
        body {
          background-color: ${colors.background};
          color: ${colors.text};
          margin: 0;
          padding: 0;
        }
        @import url('${fonts.headingUrl}');
        @import url('${fonts.bodyUrl}');
      `}</style>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: colors.background,
          color: colors.text,
          fontFamily: `'${fonts.body}', sans-serif`,
        }}
      >
        <div
          style={{
            maxWidth: "480px",
            margin: "0 auto",
            padding: "64px 24px 48px",
            textAlign: "center",
          }}
        >
          {/* Logo */}
          {logos.length > 0 && (
            <div
              style={{
                width: "88px",
                height: "88px",
                borderRadius: "20px",
                overflow: "hidden",
                margin: "0 auto 28px",
                border: `1px solid ${colors.primary}30`,
                backgroundColor: `${colors.primary}10`,
              }}
            >
              <Image
                src={logos[0].url}
                alt={name}
                width={88}
                height={88}
                style={{ objectFit: "contain", padding: "12px" }}
              />
            </div>
          )}

          {/* Name */}
          <h1
            style={{
              fontFamily: `'${fonts.heading}', sans-serif`,
              fontSize: "26px",
              fontWeight: 700,
              margin: "0 0 8px",
              color: colors.text,
              letterSpacing: "-0.02em",
            }}
          >
            {name}
          </h1>

          {/* Tagline */}
          <p
            style={{
              fontSize: "14px",
              color: colors.text,
              opacity: 0.6,
              margin: "0 0 40px",
              lineHeight: 1.5,
            }}
          >
            {voice.tagline}
          </p>

          {/* Links */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {(bio_links || []).map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  padding: "15px 20px",
                  borderRadius: "14px",
                  border: `1.5px solid ${colors.primary}40`,
                  backgroundColor: `${colors.primary}12`,
                  color: colors.text,
                  textDecoration: "none",
                  fontSize: "15px",
                  fontWeight: 500,
                  fontFamily: `'${fonts.body}', sans-serif`,
                  transition: "all 0.15s",
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {(bio_links || []).length === 0 && (
            <p style={{ fontSize: "13px", opacity: 0.4 }}>No links added yet.</p>
          )}

          {/* Footer */}
          <p
            style={{
              marginTop: "56px",
              fontSize: "11px",
              opacity: 0.35,
              letterSpacing: "0.05em",
            }}
          >
            made with glow
          </p>
        </div>
      </div>
    </>
  );
}
