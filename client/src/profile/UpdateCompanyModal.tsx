import axios, { AxiosProgressEvent } from 'axios';
import React, { useState, useRef, useEffect, useContext } from 'react';
import styled from 'styled-components';

import { Company } from '../models/User';
import Modal from '../shared/Modal';
import { Text } from '../shared/Text';
import api from '../utils/api';
import compressImage from '../utils/compressImage';
import SvgIcon from '../shared/SvgIcon';
import CloudinaryPicture from '../shared/CloudinaryImage';
import { Container } from '../shared/Container';
import { Input } from '../shared/Input';
import { TextArea } from '../shared/TextArea';
import { Button } from '../shared/Button';
import { AuthContext } from '../Auth/ContextProvider';

const HiddenInput = styled.input`
  display: none;
`;

const ImageContainer = styled('div')<{ image: string; progress: number }>`
  align-self: flex-start;
  position: relative;
  display: grid;
  place-content: center;
  width: 200px;
  height: 200px;
  border-radius: 30px;
  overflow: hidden;
  border: 2px solid ${({ theme }) => theme.colors.secondary_L2};
  margin-bottom: 32px;

  img {
    object-fit: fill;
    width: 150px;
    height: 150px;
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
  z-index: 999;
`;

const EditPictureButton = styled('div')`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 40px;
  height: 40px;
  display: grid;
  place-content: center;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    opacity: 1;
    background-color: ${({ theme }) => theme.colors.primary_L2};
  }
`;

interface Props {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  company: Company;
}

const UpdateCompanyModal = (props: Props) => {
  const [progress, setProgress] = useState<number>(0);
  const [image, setImage] = useState<string>('');
  const [website, setWebsite] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [cloudinaryImageId, setCloudinaryImageId] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const uploadRef = useRef<HTMLDivElement>(null);

  const { getUser } = useContext(AuthContext);

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
      setImage(image);
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

        setCloudinaryImageId(imgId);
      })
      .catch((err) => {
        console.log(err.response.data.error);
      });
  };

  const deleteImage = () => {
    setImage('');
    setCloudinaryImageId('');
  };

  const updateCompany = async () => {
    setLoading(true);

    const data = {
      _id: props.company._id,
      website,
      description,
      logo: cloudinaryImageId,
    };

    try {
      await api.patch(`/companies/${props.company._id}`, data);
      await getUser();
      props.setShowModal(false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (props.company.logo) {
      setCloudinaryImageId(props.company.logo);
    }

    if (props.company.website) {
      setWebsite(props.company.website);
    }

    if (props.company.description) {
      setDescription(props.company.description);
    }
  }, [props.company]);

  return (
    <Modal setShowModal={props.setShowModal}>
      <Text fontSize={32} fontWeight="bold" mb={32}>
        {props.company.name}
      </Text>
      <Container width="100%">
        <HiddenInput
          type="file"
          ref={fileInputRef}
          onChange={(e) => onFileChosen(e)}
        />

        <ImageContainer ref={imageRef} image={image} progress={progress}>
          <EditPictureButton>
            {!image && !cloudinaryImageId ? (
              <Container onClick={() => fileInputRef.current?.click()}>
                <SvgIcon src="pencil_fill" color="primary" />
              </Container>
            ) : (
              <Container onClick={deleteImage}>
                <SvgIcon src="delete" color="primary" />
              </Container>
            )}
          </EditPictureButton>

          {cloudinaryImageId ? (
            <CloudinaryPicture size={150} publicId={cloudinaryImageId} />
          ) : image ? (
            <img src={image} alt="logo" />
          ) : (
            <SvgIcon src="work" size={150} />
          )}
          <Uploader ref={uploadRef} progress={progress}></Uploader>
        </ImageContainer>
        <Text fontWeight={'bold'} color="#8e8e8e" mb={6}>
          Company description
        </Text>
        <TextArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          label="Website"
          value={website}
          onChange={(e) => {
            setWebsite(e.target.value);
          }}
          name="website"
          type="text"
        />
      </Container>
      <Container flex justify="flex-end" gap={12} mt={16} width="100%">
        <Button variant="outline" onClick={() => props.setShowModal(false)}>
          Cancel
        </Button>
        <Button variant="primary" onClick={updateCompany} disabled={loading}>
          {loading ? 'Please Wait...' : 'Save'}
        </Button>
      </Container>
    </Modal>
  );
};

export default UpdateCompanyModal;
