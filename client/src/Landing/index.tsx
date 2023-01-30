import React,{useState} from 'react';
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
  SignUpButton,
  LearnMore
} from './landing.styles';
import arrow from './assets/arrow_down.svg';
import arrow_side from './assets/arrow.svg';
import lock from './assets/lock.svg';
import lightbulb from './assets/lightbulb.svg';
import experience from './assets/experience.png';
import search_img from './assets/search_img.svg';
import money_img from './assets/money_img.svg';
import question_img from './assets/question_img.svg';
import getpaid from './assets/getpaid.png';
import percent from './assets/65percent.png';
import question from './assets/Question.svg';
import search from './assets/Search.svg';
import creditcard from './assets/creditcard.svg';
import money from './assets/money.svg';
import info from './assets/info.svg';
import cogs from './assets/cogs.svg';
import light from './assets/light.svg';
import pin from './assets/pin.svg';
import letter from './assets/letter.svg';
import phone from './assets/phone.svg';
import first from './assets/section_1_bg.jpg';
import firstMobile from './assets/section_1_bg_mobile.jpg';
import moneysetup from './assets/moneysetup.png';
import { Button } from '../shared/Button';
import SignUp from '../Auth/SignUp';
import { Modal } from 'react-bootstrap';
const Landing = () => {
  const { width } = useWidth();
  const [modal, setModal] = useState(false);
  const url=window.location.href.split('/')[window.location.href.split('/').length-1]
  const openSignUp = () => {
    setModal(true);
  }
  return (
    <LandingPage>
      <FirstSection>
        <BackgroundImage src={width < 600 ? firstMobile : first} />
        <FirstSectionContent>
          <p>
            {url[0]=="1"?<>Share your knowledge
            {width > 600 && <br />} and wisdom to get paid</>:(url[0]=="2"?<>Share your expertise
            {width > 600 && <br />} and get paid</>:<>Answer written
            {width > 600 && <br />} questions to get paid</>)}
          </p>
          <a href="#main">
            {' '}
            <LearnMore>Learn More</LearnMore>
          </a>
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
            your knowledge and wisdom. This is how it works:
          </p>
        </InfoSection>
        <Modal
          show={modal}
          onHide={() => setModal(false)}
          dialogClassName="register-modal"
        >
          <SignUp />
        </Modal>
        <FlexContainer>
          {url[1]=="1"?<>
          <FlexItem reverse={true}>
            <img src={lightbulb} alt="Light bulb" />
            <FlexItemImage>
              <h3> 1. Add your Experience and other important information to your profile</h3>
              <img src={experience} alt="Experience" />
            </FlexItemImage>
          </FlexItem>
          <FlexItem>
            <img src={info} alt="Info" />
            <FlexItemImage>
              <h3>2. Get approved as an advisor</h3>
              <img src={percent} alt="Percent finished" />
            </FlexItemImage>
          </FlexItem>
          <FlexItem reverse={true}>
            <img src={creditcard} alt="Credit" />
            <FlexItemImage>
              <h3>3. Choose how much you get paid to answer and more</h3>
              <img src={moneysetup} alt="Fee setup" />
            </FlexItemImage>
          </FlexItem>
          <FlexItem>
            <img src={question} alt="question" />
            <FlexItemImage>
              <h3>4. Answer questions</h3>
              <img src={money_img} alt="question_img" />
            </FlexItemImage>
          </FlexItem>
          <FlexItem reverse={true}>
            <img src={money} alt="question" />
            <FlexItemImage>
              <h3>5. Get compensation to your service</h3>
              <img style={width>600?{width:"38vw"}:{width:'50vw',marginLeft: '50%',transform: 'translateX(-50%)'}} src={getpaid} alt="Get paid" />
            </FlexItemImage>
          </FlexItem>
          </>:<>
          <FlexItem reverse={true}>
            <img src={search} alt="search" />
            <FlexItemImage>
              <h3> 1. A customer searches for the perfect expert for their needs </h3>
              <img src={search_img} alt="search_img" />
            </FlexItemImage>
          </FlexItem>
          <FlexItem>
            <img src={creditcard} alt="Credit Card" />
            <FlexItemImage>
              <h3>2. The customer asks you a written question</h3>
              <img src={money_img} alt="money_img" />
            </FlexItemImage>
          </FlexItem>
          <FlexItem reverse={true}>
            <img src={question} alt="question" />
            <FlexItemImage>
              <h3>3. Answer the question and wait for confirmation</h3>
              <img src={question_img} alt="question_img" />
            </FlexItemImage>
          </FlexItem>
          <FlexItem >
            <img src={money} alt="Money" />
            <FlexItemImage>
              <h3>4. Get paid</h3>
              <img style={width>600?{width:"38vw"}:{width:'50vw'}} src={getpaid} alt="Get paid" />
            </FlexItemImage>
          </FlexItem>
          </>}
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
            <SignUpButton onClick={openSignUp}>
              SIGN UP NOW <img src={arrow_side} />
            </SignUpButton>
        </Strip>
       
        <Footer>
          <div>
            <img src={pin} alt="pin" />
            <p>Hachashmonaim 105, Tel Aviv, Israel</p>
          </div>
          <div>
            <img src={phone} alt="phone" />
            <p>+972 54-343-6359</p>
          </div>
          <div>
            <img src={letter} alt="letter" />
            <p>Papayask@info.com</p>
          </div>
        </Footer>
        <p
          style={{ textAlign: 'center', fontWeight: 'bold', padding: '1em 0' }}
        >
          All rights reserved to Papayask ©
        </p>
      </MainPage>
    </LandingPage>
  );
};

export default Landing;
