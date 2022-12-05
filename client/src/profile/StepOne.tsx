import React, { useRef } from 'react';
import styled from 'styled-components';
import axios, { AxiosProgressEvent } from 'axios';

import api from '../utils/api';
import compressImage from '../utils/compressImage';
import { Button } from '../shared/Button';
import { Container } from '../shared/Container';
import { Input } from '../shared/Input';
import { Text } from '../shared/Text';
import { TextArea } from '../shared/TextArea';

const HiddenInput = styled.input`
  display: none;
`;

const ImageContainer = styled('div')<{ image: string; progress: number }>`
  position: relative;
  width: 300px;
  height: 300px;
  background-color: ${(props) =>
    props.image ? `` : props.theme.colors.secondary};
  border-radius: 30px;
  overflow: hidden;
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
    opacity: ${(props) =>
      props.progress >= 100 || props.progress === 0 ? 1 : 0.5};
  }
`;

const Uploader = styled('div')<{ progress: number }>`
  display: ${(props) => (props.progress >= 100 ? 'none' : 'block')};
  position: absolute;
  top: 50%;
  left: 5%;
  width: 90%;
  border-radius: 20px;
  transform: translateY(-50%);
  text-align: center;
  background-color: green;
  color: white;
  font-weight: bold;
  z-index: 99;
`;

interface Props {
  title: string;
  bio: string;
  image: string;
  setImage: React.Dispatch<React.SetStateAction<string>>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setBio: React.Dispatch<React.SetStateAction<string>>;
  setCloudinaryImageId: React.Dispatch<React.SetStateAction<string>>;
}

const StepOne = (props: Props) => {
  const [progress, setProgress] = React.useState<number>(0);
  const { title, bio, setTitle, setBio } = props;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const uploadRef = useRef<HTMLDivElement>(null);

  const getCloudinarySignature = async () => {
    const res = await api.post('cloudinary-signature');
    const { signature, timestamp } = res.data;
    return { signature, timestamp };
  };

  const readFile = async (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const image = reader.result as string;
      props.setImage(image);
    };
  };

  const onFileChosen = async (event: React.ChangeEvent<HTMLInputElement>) => {
    let file = event.target.files?.[0];

    if (!file) {
      return;
    }
    const sizeCheck = file.size < 17825792;

    if (sizeCheck && imageRef) {
      file = await compressImage(file, 17, imageRef);

      if (!file) {
        return;
      }
      readFile(file);
    }

    setProgress(0);

    const { signature, timestamp } = await getCloudinarySignature();

    const config = {
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        let percentCompleted = sizeCheck
          ? Math.round((progressEvent.loaded * 50) / progressEvent.total!) + 50
          : Math.round((progressEvent.loaded * 100) / progressEvent.total!);

        if (uploadRef.current) {
          uploadRef.current.textContent = `${percentCompleted}% completed`;
          uploadRef.current.style.background = `linear-gradient(to right, var(--primary) ${percentCompleted}% , #aaa ${percentCompleted}%)`;
        }
        setProgress(percentCompleted);
      },
    };
    const preset =
      process.env.REACT_APP_ENV === 'production' ? 'production' : 'development';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', preset);

    axios
      .post(
        `https://api.cloudinary.com/v1_1/snipcritics/image/upload?api_key=${process.env.REACT_APP_CLOUDINARY_KEY}&signature=${signature}&timestamp=${timestamp}`,
        formData,
        config
      )
      .then((res) => {
        const imgId = res.data.public_id.replace(`${preset}/`, '');
        props.setCloudinaryImageId(imgId);
      })
      .catch((err) => {
        console.log(err.response.data.error);
      });
  };

  return (
    <>
      <Text fontSize={32} fontWeight={600} mb={16}>
        Headline
      </Text>
      <Input
        type="text"
        value={title}
        placeholder="Enter a link and press enter"
        onChange={(e) => setTitle(e.target.value)}
        name="headline"
        width='300px'
      />
      <Text fontSize={32} fontWeight={600} mb={16}>
        Tell your clients about yourself
      </Text>
      <TextArea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />
      <HiddenInput
        type="file"
        ref={fileInputRef}
        onChange={(e) => onFileChosen(e)}
      />
      <Container flex align="flex-start" gap={48}>
        <Button variant="primary" onClick={() => fileInputRef.current?.click()}>
          Upload profile picture
        </Button>
        <ImageContainer ref={imageRef} image={props.image} progress={progress}>
          {props.image && <img src={props.image} alt="profile" />}
          <Uploader ref={uploadRef} progress={progress}></Uploader>
        </ImageContainer>
      </Container>
    </>
  );
};

export default StepOne;
