import useWidth from '../Hooks/useWidth';
import './landing.css';
import {
  Arrow,
  BackgroundImage,
  FirstSection,
  FirstSectionContent,
  FlexContainer,
  FlexItem,
  LandingPage,
  MainPage,
  Strip,
  Grid,
  Title,
  Subtitle,
  Text,
} from './landing.styles';
import arrow from './assets/arrow_down.svg';
import lock from './assets/lock.svg';
import expert from './assets/expert.svg';
import globe from './assets/globe.svg';
import glass from './assets/glass.svg';
import chat from './assets/chat.svg';
import money from './assets/money.svg';
import info from './assets/info.svg';
import first from './assets/section_1_bg.jpg';
import firstMobile from './assets/section_1_bg_mobile.jpg';
const Landing = () => {
  const { width } = useWidth();
  return (
    <LandingPage>
      <FirstSection>
        <BackgroundImage src={width < 600 ? firstMobile : first} />
        <FirstSectionContent>
          <p>
            Access knowledge
            {width > 600 && <br />} and wisdom of top professionals
          </p>
          <a href="#main">
            {' '}
            <Arrow src={arrow} />
          </a>
        </FirstSectionContent>
      </FirstSection>
      <MainPage id="main">
        <FlexItem>
          <img src={expert} alt="Search" />
          <div>
            <Title>What is papayask?</Title>
            <Text>
              Papayask is a platform that connects you to a relevant expert for
              your needs so you can ask them your burning questions.
            </Text>
          </div>
        </FlexItem>
        <FlexItem>
          <img src={globe} alt="Question" />
          <div>
            <Title>Why we made the platform</Title>
            <Text>
              We believe that everyone should have access to the best experts in
              the world. We want to make it easy for people to connect with each
              other and share knowledge. We found that reaching out to experts
              is a very time consuming process and often unreliable.
            </Text>
          </div>
        </FlexItem>
        <Strip>
          <h2>How it works?</h2>
          <Grid>
            <div>
              <img src={glass} alt="Pro" />
              <Title>Find the right expert for you </Title>
              <Text>
                Papayask gives you the ability to search the skill you’re
                looking for in a person including a variety of other options.
                This gives you the ability to search for the right advisor for
                you.
              </Text>
            </div>
            <div>
              <img src={chat} alt="chat" />
              <Title>Ask your question</Title>
              <p>
                After finding the best professional for your needs, you can pay
                to ask them a question privately. Just write down your question,
                pay and wait for an answer
              </p>
            </div>
            <div>
              <img src={money} alt="money" />
              <Title>Payment protection</Title>
              <p>
                The payment process is done through Paypal to ensure the
                security of the payment. Should there happen to be a legitimate
                issue, we will refund you in full.
              </p>
            </div>
            <div>
              <img src={lock} alt="lock" />
              <Title>Security</Title>
              <p>
                Detailed and verified profiles Papayask gives its advisors the
                ability to specify relevant details to prove their competences.
                To ensure authenticity, we verify all profiles before they can
                offer their services.
              </p>
            </div>
          </Grid>
        </Strip>
        <FlexItem>
          <img src={info} alt="Search" />
          <div>
            <Title>The current situation</Title>
            <FlexContainer>
              <div>
                <Subtitle>Services</Subtitle>
                <p>
                  Papayask is a platform that connects you to a relevant expert
                  for your needs so you can ask them your burning questions.
                </p>
              </div>
              <div>
                <Subtitle>About us</Subtitle>
                <p>
                  We are a team of tech professionals and seasoned entrepreneurs
                  that aims to provide the best services to our customers. We
                  are passionate about our work and welcome your feedback.
                </p>
              </div>
            </FlexContainer>
          </div>
        </FlexItem>
      </MainPage>
    </LandingPage>
  );
};

export default Landing;
