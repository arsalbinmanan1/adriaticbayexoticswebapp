import {
  Button,
  Heading,
  Text,
  Section,
} from "@react-email/components";
import * as React from "react";
import { BaseLayout } from "./BaseLayout";

interface ReminderEmailProps {
  customerName: string;
  carName: string;
  pickupTime: string;
  pickupLocation: string;
  type: "48h" | "24h";
}

export const ReminderEmail = ({
  customerName = "Valued Customer",
  carName = "Luxury Vehicle",
  pickupTime = "Jan 01, 2024 at 10:00 AM",
  pickupLocation = "Tivat Airport",
  type = "48h",
}: ReminderEmailProps) => (
  <BaseLayout previewText={`${type === "48h" ? "48-Hour" : "24-Hour"} Reminder: Your rental is coming up!`}>
    <Heading style={h1}>Pickup Reminder</Heading>
    <Text style={text}>
      Hi {customerName},
    </Text>
    <Text style={text}>
      We're looking forward to seeing you soon! This is a reminder that your rental for the <strong>{carName}</strong> is scheduled for pickup in approximately {type === "48h" ? "48 hours" : "24 hours"}.
    </Text>

    <Section style={detailsContainer}>
      <Text style={text}>
        <strong>Pickup Time:</strong> {pickupTime}
      </Text>
      <Text style={text}>
        <strong>Location:</strong> {pickupLocation}
      </Text>
    </Section>

    <Text style={text}>
      Please remember to bring your <strong>Driver&apos;s License</strong> and the <strong>Credit Card</strong> used for the deposit.
    </Text>

    <Section style={buttonContainer}>
      <Button style={button} href="#">
        View Trip Details
      </Button>
    </Section>

    <Text style={text}>
      Safe travels, and see you soon!
    </Text>
  </BaseLayout>
);

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "30px 0",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "24px",
};

const detailsContainer = {
  backgroundColor: "#f9f9f9",
  padding: "20px",
  borderRadius: "8px",
  margin: "20px 0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const button = {
  backgroundColor: "#000",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

export default ReminderEmail;
