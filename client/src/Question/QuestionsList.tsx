import React, { useEffect } from 'react';
import styled from 'styled-components';

import { Container } from '../shared/Container';
import { AuthContext } from '../Auth/ContextProvider';
import { Text } from '../shared/Text';
import { QuestionProps } from '../models/Question';
import Image from '../shared/Image';
import { Link } from 'react-router-dom';

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

const QuestionItem = styled(Link)`
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

const QuestionsList = () => {
  const [currentTab, setCurrentTab] = React.useState<TabType>('recieved');
  const [questions, setQuestions] = React.useState<QuestionProps[]>([]);
  const { user } = React.useContext(AuthContext);

  useEffect(() => {
    if (user) {
      const questions =
        currentTab === 'recieved'
          ? user.questions?.received
          : user.questions?.sent;
      setQuestions(questions || []);
    }
  }, [user, currentTab]);

  return (
    <Container width="60%" mx={'auto'} flex dir="column" align="center">
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
          <QuestionItem key={question._id} to={question._id}>
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
          </QuestionItem>
        ))}
      </AnimatedContainer>
    </Container>
  );
};

export default QuestionsList;
