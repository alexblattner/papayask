import React, { useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { Container } from "../shared/Container";
import { AuthContext } from "../Auth/ContextProvider";
import { Text } from "../shared/Text";
import { QuestionProps } from "../models/Question";
import ProfilePicture from "../shared/ProfilePicture";
import { Button } from "../shared/Button";
import RejectModal from "./RejectModal";
import SvgIcon from "../shared/SvgIcon";
import { Col } from "react-bootstrap";
import Checkbox from "../shared/Checkbox";

type TabType = "sent" | "recieved";

const TabSwithcer = styled.div`
  display: flex;
  flex-direction: column;
  /* position: relative; */
  transition: all 0.3s ease-in-out;
  /* border-radius: 5px; */
  overflow: hidden;
  margin: 8px;
  margin-bottom: 16px;
`;

const TabIndicator = styled.div<{ currentTab: boolean }>`
  position: absolute;
  height: 1.2px;
  width: 100%;
  background-color: ${(props) => props.theme.colors.primary};
  transition: all 0.3s ease-in-out;
  left: 0;
  bottom: 0;
  transform: translateX(${(props) => (props.currentTab ? "0" : "100%")});
`;

const Tab = styled.div<{ currentTab: boolean }>`
  width: 120px;
  padding-block: 6px;
  /* margin-block: 4px; */
  cursor: pointer;
  position: relative;
  background-color: ${(props) =>
    props.currentTab ? props.theme.colors.primary_L2 : ""};
  &:hover {
    background-color: ${(props) => props.theme.colors.primary_L1};
    transition: all 0.3s ease-in-out;
  }
`;

const AnimatedContainer = styled("div")<{ currentTab: TabType }>`
  width: 80%;
  @media (max-width: 890px) {
    width: 100%;
  }
`;

const StyledDiv = styled("div")`
  display: flex;
  gap: 16px;
`;

const QuestionItem = styled("div")`
  width: 100%;
  max-height: 80px;
  display: flex;
  /* border-radius: 8px; */
  overflow: hidden;
  margin-bottom: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  color: #000;
  gap: 16px;
  text-decoration: none;
  padding: 8px 16px;
  border-bottom: ${(props) => props.theme.colors.primary} 1.4px solid;
  justify-content: space-between;

  &:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease-in-out;
    color: #000;
  }
`;

const TruncatedText = styled("p")`
  overflow: hidden;
  /* text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical; */
  margin: 0;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  gap: 12px;
`;

const QuestionsList = () => {
  const [currentTab, setCurrentTab] = React.useState<TabType>("sent");
  const [questions, setQuestions] = React.useState<QuestionProps[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] =
    React.useState<string>("");
  const [showRejectionModal, setShowRejectionModal] =
    React.useState<boolean>(false);
  const { user } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const onClick = (question: QuestionProps) => {
    if (currentTab === "sent" || question.status.action !== "pending") {
      navigate(`/question/${question._id}`);
    }
  };

  useEffect(() => {
    if (user) {
      const questions =
        currentTab === "recieved"
          ? user.questions?.received
          : user.questions?.sent;
      setQuestions(questions?.reverse() || []);
    }
  }, [user, currentTab]);

  return (
    <Container width="100%" mx={"auto"} flex dir="row" align="center">
      <TabSwithcer>
        <Text
          fontSize={30}
          fontWeight="bold"
          margin-left="4px"
          align="start"
          color="#7F8E25"
        >
          Requests
        </Text>
        <Tab
          currentTab={currentTab === "recieved"}
          onClick={() => setCurrentTab("recieved")}
        >
          <Text
            color="primary"
            align="center"
            fontWeight={currentTab === "recieved" ? "bold" : 500}
          >
            <img
              style={{ marginLeft: "4px" }}
              height={"16px"}
              src="/assets/images/inbox.svg"
            />{" "}
            Recieved
          </Text>
          <TabIndicator currentTab={currentTab === "recieved"} />
        </Tab>

        <Tab
          currentTab={currentTab === "sent"}
          onClick={() => setCurrentTab("sent")}
        >
          <Text
            color="primary"
            align="center"
            fontWeight={currentTab === "sent" ? "bold" : 500}
          >
            <img
              style={{ marginLeft: "4px" }}
              height={"16px"}
              src="/assets/images/send_arrow.svg"
            />{" "}
            Sent
          </Text>
          <TabIndicator currentTab={currentTab === "sent"} />
        </Tab>
      </TabSwithcer>

      <Col>
        {showRejectionModal && (
          <RejectModal
            setShowRejectModal={setShowRejectionModal}
            questionId={selectedQuestionId}
          />
        )}
        {currentTab === "recieved" ? (
          <div style={{ height: "80px" }}></div>
        ) : (
          <div style={{ height: "100px" }}></div>
        )}
        <AnimatedContainer currentTab={currentTab}>
          {questions.map((question, i) => (
            <QuestionItem
              key={question._id}
              //  onClick={() => onClick(question)}
            >
              <StyledDiv>
                <Checkbox checked={false} />

                <SvgIcon src="heart" size={18} />

                {/* <input type="checkbox" /> */}
                {/* <ProfilePicture
                src={
                  currentTab === "recieved"
                    ? question.sender.picture
                    : question.receiver.picture
                }
                size={80}
              /> */}
              </StyledDiv>
              <StyledDiv>
                <Text fontWeight={"bold"}>
                  {currentTab === "recieved"
                    ? `from: @${question.sender.name}`
                    : `to: @${question.receiver.name}`}
                </Text>
                {/* <Text>{question.}</Text> */}

                <Text>{question.description}</Text>
              </StyledDiv>
              <StyledDiv>
                {currentTab === "recieved" &&
                  question.status.action === "pending" && (
                    <Actions>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          navigate(`/question/${question._id}`);
                        }}
                      >
                        <SvgIcon src="check" size={15} />
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setSelectedQuestionId(question._id);
                          setShowRejectionModal(true);
                        }}
                      >
                        <SvgIcon src="close" size={15} />
                      </Button>
                    </Actions>
                  )}
                {currentTab === "recieved" &&
                  question.status.action === "rejected" && (
                    <Actions>
                      <Container flex gap={12}>
                        <Text color="red">Declined</Text>
                      </Container>
                    </Actions>
                  )}
                {currentTab === "recieved" &&
                  question.status.action === "accepted" &&
                  question.status.done && (
                    <Actions>
                      <Container flex gap={12}>
                        <Text color="green">Done</Text>
                      </Container>
                    </Actions>
                  )}
              </StyledDiv>
              <StyledDiv>
                <Text align="end">{moment(question.createdAt).calendar()}</Text>
              </StyledDiv>
            </QuestionItem>
          ))}
        </AnimatedContainer>
      </Col>
    </Container>
  );
};

export default QuestionsList;
