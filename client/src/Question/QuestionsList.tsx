import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import { Container } from '../shared/Container';
import { AuthContext } from '../Auth/ContextProvider';
import { Text } from '../shared/Text';
import { QuestionProps } from '../models/Question';
import Image from '../shared/Image';
import { Button } from '../shared/Button';
import RejectModal from './RejectModal';
import SvgIcon from '../shared/SvgIcon';

type TabType = 'sent' | 'recieved';

const TabSwithcer = styled.div`
  display: flex;
  background-color: ${(props) => props.theme.colors.secondary_L2};
  position: relative;
  transition: all 0.3s ease-in-out;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 16px;
`;

const TabIndicator = styled.div<{ currentTab: TabType }>`
  position: absolute;
  height: 3px;
  width: 50%;
  background-color: ${(props) => props.theme.colors.primary};
  transition: all 0.3s ease-in-out;
  left: 0;
  bottom: 0;
  transform: translateX(
    ${(props) => (props.currentTab === 'recieved' ? '0' : '100%')}
  );
`;

const Tab = styled.div`
  width: 120px;
  padding-block: 6px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.colors.primary_L2};
    transition: all 0.3s ease-in-out;
  }
`;

const AnimatedContainer = styled('div')<{ currentTab: TabType }>`
  width: 50%;
`;

const QuestionItem = styled('div')`
  width: 100%;
  max-height: 80px;
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  color: #000;
  text-decoration: none;
  padding-right: 10px;

  &:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease-in-out;
    color: #000;
  }
`;

const TruncatedText = styled('p')`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  margin: 0;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  gap: 12px;
`;

const QuestionsList = () => {
  const [currentTab, setCurrentTab] = React.useState<TabType>('recieved');
  const [questions, setQuestions] = React.useState<QuestionProps[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] =
    React.useState<string>('');
  const [showRejectionModal, setShowRejectionModal] =
    React.useState<boolean>(false);
  const { user } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const onClick = (question: QuestionProps) => {
    if (currentTab === 'sent' || question.status.action !== 'pending') {
      navigate(`/questions/${question._id}`);
    }
  };

  useEffect(() => {
    if (user) {
      const questions =
        currentTab === 'recieved'
          ? user.questions?.received
          : user.questions?.sent;
      setQuestions(questions?.reverse() || []);
    }
  }, [user, currentTab]);

  return (
    <Container width="60%" mx={'auto'} flex dir="column" align="center">
      {showRejectionModal && (
        <RejectModal
          setShowRejectModal={setShowRejectionModal}
          questionId={selectedQuestionId}
        />
      )}
      <TabSwithcer>
        <Tab onClick={() => setCurrentTab('recieved')}>
          <Text
            align="center"
            fontWeight={currentTab === 'recieved' ? 'bold' : 400}
          >
            Recieved
          </Text>
        </Tab>
        <Tab onClick={() => setCurrentTab('sent')}>
          <Text
            align="center"
            fontWeight={currentTab === 'sent' ? 'bold' : 400}
          >
            Sent
          </Text>
        </Tab>
        <TabIndicator currentTab={currentTab} />
      </TabSwithcer>
      <AnimatedContainer currentTab={currentTab}>
        {questions.map((question, i) => (
          <QuestionItem key={question._id} onClick={() => onClick(question)}>
            <Image
              src={
                currentTab === 'recieved'
                  ? question.sender.picture
                  : question.receiver.picture
              }
              size={80}
            />
            <Container px={12} py={16}>
              <Text fontWeight={'bold'}>
                {currentTab === 'recieved'
                  ? question.sender.name
                  : question.receiver.name}
              </Text>
              <TruncatedText>{question.description}</TruncatedText>
            </Container>
            {currentTab === 'recieved' && question.status.action === 'pending' && (
              <Actions>
                <Button
                  variant="secondary"
                  onClick={() => {
                    navigate(`/questions/${question._id}`);
                  }}
                >
                  <SvgIcon src="check" width={15} height={15} />
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSelectedQuestionId(question._id);
                    setShowRejectionModal(true);
                  }}
                >
                  <SvgIcon src="close" width={15} height={15} />
                </Button>
              </Actions>
            )}
            {currentTab === 'recieved' &&
              question.status.action === 'rejected' && (
                <Actions>
                  <Container flex gap={12}>
                    <Text color="red">Declined</Text>
                  </Container>
                </Actions>
              )}
            {currentTab === 'recieved' &&
              question.status.action === 'accepted' &&
              question.status.done && (
                <Actions>
                  <Container flex gap={12}>
                    <Text color="green">Done</Text>
                  </Container>
                </Actions>
              )}
          </QuestionItem>
        ))}
      </AnimatedContainer>
    </Container>
  );
};

export default QuestionsList;
