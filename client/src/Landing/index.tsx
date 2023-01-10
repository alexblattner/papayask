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
  InfoSection,
  FlexItemImage,
  Footer,
} from './landing.styles';
import arrow from './assets/arrow_down.svg';
import lock from './assets/Lock.svg';
import search_img from './assets/search_img.svg';
import money_img from './assets/money_img.svg';
import question_img from './assets/question_img.svg';
import question from './assets/Question.svg';
import search from './assets/Search.svg';
import money from './assets/money.svg';
import info from './assets/info.svg';
import cogs from './assets/cogs.svg';
import light from './assets/light.svg';
import pin from './assets/pin.svg';
import letter from './assets/letter.svg';
import phone from './assets/phone.svg';
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
        <InfoSection>
          <img src={light} alt="light-bolb" />
          <p>
            <span>Papayask </span>is a marketplace where the product is
            knowledge and wisdom. The way it works is the following:
          </p>
        </InfoSection>
        <FlexContainer>
          <FlexItem reverse={true}>
            <img src={search} alt="search" />
            <FlexItemImage>
              <h3> 1. Search for the perfect expert. </h3>
              <img src={search_img} alt="search_img" />
            </FlexItemImage>
          </FlexItem>
          <FlexItem>
            <img src={money} alt="money" />
            <FlexItemImage>
              <h3>2. Ask, pay and wait for an answer</h3>
              <img src={money_img} alt="money_img" />
            </FlexItemImage>
          </FlexItem>
          <FlexItem reverse={true}>
            <img src={question} alt="question" />
            <FlexItemImage>
              <h3>3. Get answer and confirm</h3>
              <img src={question_img} alt="question_img" />
            </FlexItemImage>
          </FlexItem>
        </FlexContainer>
        <Strip>
          <FlexItem>
            <img src={cogs} alt="cogs" />
            <div>
              <h2>Why we chose this process</h2>
              <p>
                We wanted to increase the variety of experts available on the
                platform by minimizing the time commitment and increasing the
                flexibility using the current format. That way, knowledge
                seekers can access even higher quality individuals than before
                who usually have limited time during the day. Another advantage
                of the format is that it is less expensive than a regular
                consultation making the process cheaper and more
                straightforward.
              </p>
            </div>
          </FlexItem>
          <FlexItem reverse={true}>
            <img src={lock} alt="lock" />
            <div>
              <h2>Security</h2>
              <p>
                Papayask ensures that all profiles are truthful by verifying all
                of them before they can receive questions. It is a one time
                process that we deem necessary. We also ensure that all payments
                are safe by using https and the PayPal APIs.
              </p>
            </div>
          </FlexItem>
          <FlexItem>
            <img src={info} alt="info" />
            <div>
              <h2>The current situation</h2>
              <p>
                Before making the services available, we need to have a starting
                amount of verified experts to show. For this reason, we are
                showing a temporary bare bones version of the platform. Once we
                are ready, we will notify all experts.
              </p>
            </div>
          </FlexItem>
        </Strip>
       
        <Footer>
          <div>
            <img src={pin} alt="pin" />
            <p>Hachashmonaim 105, Tel Aviv, Israel</p>
          </div>
          <div>
            <img src={phone} alt="phone" />
            <p>+972 53-340-1522</p>
          </div>
          <div>
            <img src={letter} alt="letter" />
            <p>Papayask@info.com</p>
          </div>
        </Footer>
        <p
          style={{ textAlign: 'center', fontWeight: 'bold', padding: '1em 0' }}
        >
          All rights resserved to Papayask ©
        </p>
      </MainPage>
    </LandingPage>
  );
};

export default Landing;
