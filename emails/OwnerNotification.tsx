import {
  Button,
  Column,
  Heading,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { BaseLayout } from "./BaseLayout";

interface OwnerNotificationEmailProps {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  carName: string;
  pickupDate: string;
  dropoffDate: string;
  totalAmount: string;
  bookingId: string;
}

export const OwnerNotificationEmail = ({
  customerName = "John Doe",
  customerEmail = "john@example.com",
  customerPhone = "+123456789",
  carName = "Porsche 911 Carrera",
  pickupDate = "Jan 01, 2024",
  dropoffDate = "Jan 03, 2024",
  totalAmount = "$1,200.00",
  bookingId = "booking_123",
}: OwnerNotificationEmailProps) => (
  <BaseLayout previewText={`New Booking Received: ${carName}`}>
    <Heading style={h1}>New Booking Received!</Heading>
    <Text style={text}>
      A new booking has been confirmed for the <strong>{carName}</strong>.
    </Text>

    <Section style={detailsContainer}>
      <Heading style={h2}>Customer Details</Heading>
      <Text style={text}>
        <strong>Name:</strong> {customerName}<br />
        <strong>Email:</strong> {customerEmail}<br />
        <strong>Phone:</strong> {customerPhone}
      </Text>

      <Heading style={h2}>Rental Period</Heading>
      <Text style={text}>
        <strong>Pickup:</strong> {pickupDate}<br />
        <strong>Dropoff:</strong> {dropoffDate}
      </Text>

      <Heading style={h2}>Financials</Heading>
      <Text style={text}>
        <strong>Total Amount:</strong> {totalAmount} (Security Deposit Received)
      </Text>
    </Section>

    <Section style={buttonContainer}>
      <Button style={button} href={`#`}>
        View Booking in Admin Portal
      </Button>
    </Section>
  </BaseLayout>
);

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "30px 0",
};

const h2 = {
  color: "#333",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "20px 0 10px",
  borderBottom: "1px solid #eee",
  paddingBottom: "8px",
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

export default OwnerNotificationEmail;
