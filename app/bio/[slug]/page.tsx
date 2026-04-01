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

  const { colors, fonts, logos, voice, bio_links } = project;

  return (
    <html lang="en">
      <head>
        <title>{project.name} -- Links</title>
        <link href={fonts.headingUrl} rel="stylesheet" />
        <link href={fonts.bodyUrl} rel="stylesheet" />
      </head>
      <body
        style={{
          backgroundColor: colors.background,
          color: colors.text,
          fontFamily: `'${fonts.body}', sans-serif`,
          margin: 0,
          padding: 0,
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            maxWidth: "480px",
            margin: "0 auto",
            padding: "48px 24px",
            textAlign: "center",
          }}
        >
          {/* Logo */}
          {logos.length > 0 && (
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "16px",
                overflow: "hidden",
                margin: "0 auto 24px",
                backgroundColor: "#fff",
              }}
            >
              <Image
                src={logos[0].url}
                alt={project.name}
                width={80}
                height={80}
                style={{ objectFit: "contain", padding: "8px" }}
              />
            </div>
          )}

          {/* Name */}
          <h1
            style={{
              fontFamily: `'${fonts.heading}', sans-serif`,
              fontSize: "24px",
              fontWeight: 700,
              margin: "0 0 8px",
              color: colors.text,
            }}
          >
            {project.name}
          </h1>

          {/* Tagline */}
          <p
            style={{
              fontSize: "14px",
              opacity: 0.7,
              margin: "0 0 32px",
            }}
          >
            {voice.tagline}
          </p>

          {/* Links */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {(bio_links || []).map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  padding: "14px 20px",
                  borderRadius: "12px",
                  border: `1px solid ${colors.primary}30`,
                  backgroundColor: `${colors.primary}10`,
                  color: colors.text,
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: 500,
                  transition: "all 0.2s",
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Footer */}
          <p
            style={{
              marginTop: "48px",
              fontSize: "11px",
              opacity: 0.4,
            }}
          >
            Made with glow
          </p>
        </div>
      </body>
    </html>
  );
}
