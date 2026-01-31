import {
  Column,
  Heading,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { BaseLayout } from "./BaseLayout";

interface PaymentReceiptEmailProps {
  customerName: string;
  transactionId: string;
  amount: string;
  paymentMethod: string;
  date: string;
  description: string;
}

export const PaymentReceiptEmail = ({
  customerName = "Valued Customer",
  transactionId = "square_txn_123",
  amount = "$500.00",
  paymentMethod = "Visa ending in 4242",
  date = "Jan 01, 2024",
  description = "Security Deposit for Porsche 911",
}: PaymentReceiptEmailProps) => (
  <BaseLayout previewText={`Receipt from Adriatic Bay Exotics - ${amount}`}>
    <Heading style={h1}>Payment Receipt</Heading>
    <Text style={text}>
      Hi {customerName},
    </Text>
    <Text style={text}>
      Your payment has been successfully processed. Here are the details of your transaction.
    </Text>

    <Section style={receiptContainer}>
      <Row style={receiptRow}>
        <Column>
          <Text style={label}>Description</Text>
          <Text style={value}>{description}</Text>
        </Column>
      </Row>
      <Row style={receiptRow}>
        <Column>
          <Text style={label}>Transaction ID</Text>
          <Text style={value}>{transactionId}</Text>
        </Column>
        <Column>
          <Text style={label}>Date</Text>
          <Text style={value}>{date}</Text>
        </Column>
      </Row>
      <Row style={receiptRow}>
        <Column>
          <Text style={label}>Payment Method</Text>
          <Text style={value}>{paymentMethod}</Text>
        </Column>
        <Column>
          <Text style={label}>Amount Paid</Text>
          <Text style={amountValue}>{amount}</Text>
        </Column>
      </Row>
    </Section>

    <Text style={text}>
      You can download a PDF version of this receipt from your customer portal.
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

const receiptContainer = {
  border: "1px solid #eee",
  borderRadius: "8px",
  padding: "20px",
  margin: "20px 0",
};

const receiptRow = {
  marginBottom: "15px",
};

const label = {
  color: "#666",
  fontSize: "12px",
  textTransform: "uppercase" as const,
  marginBottom: "4px",
};

const value = {
  color: "#333",
  fontSize: "14px",
  fontWeight: "500",
};

const amountValue = {
  color: "#000",
  fontSize: "18px",
  fontWeight: "bold",
};

export default PaymentReceiptEmail;
