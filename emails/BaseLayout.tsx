import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface BaseLayoutProps {
  previewText: string;
  children: React.ReactNode;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  ? `https://${process.env.NEXT_PUBLIC_BASE_URL}`
  : "";

export const BaseLayout = ({
  previewText,
  children,
}: BaseLayoutProps) => (
  <Html>
    <Head />
    <Preview>{previewText}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Img
            src={`${baseUrl}/logo.png`}
            width="170"
            height="auto"
            alt="Adriatic Bay Exotics"
            style={logo}
          />
        </Section>
        <Section style={content}>
          {children}
        </Section>
        <Hr style={hr} />
        <Section style={footer}>
          <Text style={footerText}>
            Adriatic Bay Exotics | Premium Luxury Car Rentals
          </Text>
          <Text style={footerText}>
            Visit us at <Link href={baseUrl} style={link}>adriaticbayexotics.com</Link>
          </Text>
          <Text style={footerText}>
            © {new Date().getFullYear()} Adriatic Bay Exotics. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const header = {
  padding: "32px 48px",
  textAlign: "center" as const,
  backgroundColor: "#000000",
};

const logo = {
  margin: "0 auto",
};

const content = {
  padding: "32px 48px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  padding: "0 48px",
};

const footerText = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
};

const link = {
  color: "#556cd6",
  textDecoration: "underline",
};
