import {
  Heading,
  Text,
  Section,
} from "@react-email/components";
import * as React from "react";
import { BaseLayout } from "./BaseLayout";

interface CancellationEmailProps {
  customerName: string;
  bookingReference: string;
  carName: string;
  refundAmount: string;
  reason: string;
}

export const CancellationEmail = ({
  customerName = "Valued Customer",
  bookingReference = "EXOTIC-123",
  carName = "Luxury Car",
  refundAmount = "$1,000.00",
  reason = "Customer request",
}: CancellationEmailProps) => (
  <BaseLayout previewText={`Cancellation Confirmed - ${bookingReference}`}>
    <Heading style={h1}>Booking Cancelled</Heading>
    <Text style={text}>
      Hi {customerName},
    </Text>
    <Text style={text}>
      This email confirms that your booking <strong>{bookingReference}</strong> for the <strong>{carName}</strong> has been cancelled.
    </Text>

    <Section style={detailsContainer}>
      <Text style={text}>
        <strong>Cancellation Reason:</strong> {reason}
      </Text>
      <Text style={text}>
        <strong>Refund Processed:</strong> {refundAmount}
      </Text>
    </Section>

    <Text style={text}>
      Refunds typically take 5-7 business days to appear in your account depending on your bank.
    </Text>
    
    <Text style={text}>
      We hope to see you again soon! If you have any feedback on why you decided to cancel, please let us know.
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

export default CancellationEmail;
