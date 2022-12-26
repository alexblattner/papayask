import React, { useRef } from "react";
import styled from "styled-components";
import { PayPalButtons } from "@paypal/react-paypal-js";

import { UserProps } from "../models/User";
import { Text } from "../shared/Text";
import { TextArea } from "../shared/TextArea";
import { Input } from "../shared/Input";
import Alert from "../shared/Alert";
import formatCurrency from "../utils/formatCurrency";
import { AuthContext } from "../Auth/ContextProvider";
import useQuestionsService from "./questionsService";
import api from "../utils/api";
import { Container } from "../shared/Container";
import Modal from "../shared/Modal";

const BoldSpan = styled.span`
  font-weight: bold;
  font-size: 18px;
`;

const ItalicText = styled(Text)`
  font-style: italic;
`;

interface Props {
  setShowQuestionModal: React.Dispatch<React.SetStateAction<boolean>>;
  user: UserProps;
}

const Creator = (props: Props) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>("");
  const [title, setTitle] = React.useState<string>("");
  const [alertType, setAlertType] = React.useState<
    "success" | "error" | "info"
  >("info");
  const [alertMessage, setAlertMessage] = React.useState<string>("");
  const [showAlert, setShowAlert] = React.useState<boolean>(false);

  const { token } = React.useContext(AuthContext);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const { sendQuestion } = useQuestionsService();

  const responseTime = (days: number, hours: number) => {
    let responseTime = "";
    if (days > 0) {
      responseTime = `${days} day${days > 1 ? "s" : ""}`;
    }
    if (hours > 0) {
      if (days > 0) {
        responseTime += " and ";
      }
      responseTime = `${responseTime} ${hours} hour${hours > 1 ? "s" : ""}`;
    }
    return responseTime;
  };

  const sendRequest = async () => {
    if (!token) {
      return;
    }

    try {
      setAlertType("info");
      setAlertMessage("Sending Your Question...");
      setShowAlert(true);
      const res = await sendQuestion(
        props.user._id,
        messageRef.current?.value as string,
        title
      );
      if (res.status === 200) {
        setTimeout(() => {
          setLoading(false);
          setAlertType("success");
          setAlertMessage("Request sent successfully");
        }, 1000);
        setTimeout(() => {
          props.setShowQuestionModal(false);
        }, 2000);
      }
    } catch (error) {
      setLoading(false);
      setAlertType("error");
      setAlertMessage("Something went wrong");
      console.log(error);
    }
  };

  const createOrder = async () => {
    setLoading(true);
    if (!token) {
      return;
    }
    let finalInfo = {
      cost: props.user.request_settings ? props.user.request_settings.cost : 1,
    };
    try {
      const res = await api.post("/pay", finalInfo, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.result.id;
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const onApprove = async (data: any, actions: any) => {
    let info = {
      cost: props.user.request_settings ? props.user.request_settings.cost : 1,
      capture: data.orderID,
    };
    try {
      const res = await api.post("/pay", info);
      if (res.status === 200) {
        sendRequest();
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <Modal setShowModal={props.setShowQuestionModal}>
      <>
        <Text fontSize={32} fontWeight="bold" align="center">
          Ask {props.user.name.split(" ")[0]} a Question
        </Text>
        <Text fontSize={18} align="center">
          This will cost you{" "}
          <BoldSpan>
            {formatCurrency(
              props.user.request_settings ? props.user.request_settings.cost : 1
            )}
          </BoldSpan>
        </Text>
        <Text
          fontSize={18}
          mb={props.user.questionsInstructions ? 0 : 32}
          align="center"
        >
          {props.user.name.split(" ")[0]} will respond within{" "}
          {responseTime(
            props.user.request_settings
              ? props.user.request_settings.time_limit.days
              : 1,
            props.user.request_settings
              ? props.user.request_settings.time_limit.hours
              : 1
          )}
        </Text>
        {props.user.questionsInstructions && (
          <Container width="100%">
            <Text fontSize={18} fontWeight={700}>
              {props.user.name.split(" ")[0]}'s instruction for questions:
            </Text>
          </Container>
        )}
        {props.user.questionsInstructions && (
          <ItalicText fontSize={18} mb={32} align="center">
            "{props.user.questionsInstructions}"
          </ItalicText>
        )}
        <Alert
          show={showAlert}
          message={alertMessage}
          type={alertType}
          loading={loading}
        />
        <Input
          value={title}
          onChange={(e) => {
            if (e.target.value.length <= 100) {
              setTitle(e.target.value);
            }
          }}
          placeholder="Subject"
          name="title"
          type="text"
        ></Input>
        <TextArea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          ref={messageRef}
        />
        <PayPalButtons
          disabled={loading || message === "" || title === ""}
          fundingSource={undefined}
          createOrder={createOrder}
          onApprove={onApprove}
        />
      </>
    </Modal>
  );
};

export default Creator;
