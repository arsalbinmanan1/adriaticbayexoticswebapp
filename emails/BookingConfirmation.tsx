import {
  Button,
  Column,
  Heading,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { BaseLayout } from "./BaseLayout";

interface BookingConfirmationEmailProps {
  customerName: string;
  bookingReference: string;
  carName: string;
  pickupDate: string;
  dropoffDate: string;
  pickupLocation: string;
  dropoffLocation: string;
  totalAmount: string;
  depositPaid: string;
}

export const BookingConfirmationEmail = ({
  customerName = "Valued Customer",
  bookingReference = "EXOTIC-12345",
  carName = "Luxury Vehicle",
  pickupDate = "Jan 01, 2024",
  dropoffDate = "Jan 03, 2024",
  pickupLocation = "Tivat Airport",
  dropoffLocation = "Tivat Airport",
  totalAmount = "$0.00",
  depositPaid = "$0.00",
}: BookingConfirmationEmailProps) => (
  <BaseLayout previewText={`Booking Confirmed - ${bookingReference}`}>
    <Heading style={h1}>Booking Confirmed!</Heading>
    <Text style={text}>
      Hi {customerName},
    </Text>
    <Text style={text}>
      Thank you for choosing Adriatic Bay Exotics. Your booking for the <strong>{carName}</strong> is now confirmed.
    </Text>

    <Section style={detailsContainer}>
      <Row>
        <Column>
          <Text style={label}>Booking Reference</Text>
          <Text style={value}>{bookingReference}</Text>
        </Column>
      </Row>
      <Row style={detailRow}>
        <Column>
          <Text style={label}>Pickup</Text>
          <Text style={value}>{pickupDate}</Text>
          <Text style={subValue}>{pickupLocation}</Text>
        </Column>
        <Column>
          <Text style={label}>Dropoff</Text>
          <Text style={value}>{dropoffDate}</Text>
          <Text style={subValue}>{dropoffLocation}</Text>
        </Column>
      </Row>
    </Section>

    <Section style={pricingContainer}>
      <Row>
        <Column>
          <Text style={pricingLabel}>Security Deposit Paid</Text>
        </Column>
        <Column align="right">
          <Text style={pricingValue}>{depositPaid}</Text>
        </Column>
      </Row>
      <Row>
        <Column>
          <Text style={pricingLabel}>Total Rental Balance</Text>
        </Column>
        <Column align="right">
          <Text style={pricingValue}>{totalAmount}</Text>
        </Column>
      </Row>
    </Section>

    <Section style={buttonContainer}>
      <Button style={button} href="#">
        View Booking Details
      </Button>
    </Section>

    <Heading style={h2}>Important Instructions</Heading>
    <ul style={list}>
      <li style={listItem}>Please bring your original Driver&apos;s License.</li>
      <li style={listItem}>The credit card used for the deposit must be present.</li>
      <li style={listItem}>Minimum age requirement is 21 years.</li>
    </ul>

    <Text style={text}>
      If you have any questions, please reply to this email or call our support line.
    </Text>
  </BaseLayout>
);

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
};

const h2 = {
  color: "#333",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "20px 0 10px",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
};

const detailsContainer = {
  backgroundColor: "#f9f9f9",
  padding: "20px",
  borderRadius: "8px",
  margin: "20px 0",
};

const detailRow = {
  marginTop: "15px",
};

const label = {
  color: "#666",
  fontSize: "12px",
  textTransform: "uppercase" as const,
  marginBottom: "4px",
};

const value = {
  color: "#333",
  fontSize: "16px",
  fontWeight: "bold",
};

const subValue = {
  color: "#666",
  fontSize: "14px",
};

const pricingContainer = {
  borderTop: "1px solid #eee",
  padding: "20px 0",
};

const pricingLabel = {
  color: "#333",
  fontSize: "16px",
};

const pricingValue = {
  color: "#333",
  fontSize: "16px",
  fontWeight: "bold",
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

const list = {
  paddingLeft: "20px",
};

const listItem = {
  color: "#333",
  fontSize: "14px",
  lineHeight: "24px",
  marginBottom: "8px",
};

export default BookingConfirmationEmail;
