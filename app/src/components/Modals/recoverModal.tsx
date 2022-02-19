import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { init, receive_message, recover_profile } from "rln-client-lib";
import styled from "styled-components";
import * as Colors from "../../constants/colors";
import { serverUrl, socketUrl } from "../../constants/constants";
import { addMessageToRoomAction, getChatHistoryAction, getRoomsAction } from "../../redux/actions/actionCreator";

const StyledButton = styled.button`
  background: ${Colors.ANATRACITE};
  border-radius: 8px;
  border: none;
  outline: none;
  padding: 8px 12px;
  margin: 8px;
  color: white;
  &:hover {
    transition: 0.15s;
    box-shadow: 0px 0px 15px 0px ${Colors.ANATRACITE};
  }
  width: 200px;
`;

const StyledInput = styled.input`
  border: 1px solid #f0f2f5;
  border-radius: 20px;
  width: 100%;
  position: relative;
  margin-bottom: 10px;
  padding: 8px 12px;
  min-height: 40px;
  &:focus,
  &:active {
    outline: none;
  }
`;

type RecoverModalProps = {
  setToggleRecoverModal: (shouldRecover: boolean) => void;
  toggleRecoverModal: boolean;
};
const RecoverModal = ({
  setToggleRecoverModal,
  toggleRecoverModal
}: RecoverModalProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userData, setUserData] = useState("");

  const initializeApp = async () => {
    try {
      await init({
        serverUrl: serverUrl,
        socketUrl: socketUrl
      })
        .then(() => {
          navigate("/dashboard");
          dispatch(getRoomsAction());
          dispatch(getChatHistoryAction());
        })
        .then(async () => {
          await receive_message(receiveMessageCallback);
        });
    } catch (error) {
      navigate("/r-procedure");
    }
  };

  const receiveMessageCallback = (message: any, roomId: string) => {
    dispatch(addMessageToRoomAction(message, roomId));
  };

  const onReaderLoad = (e: any) => {
    const userObj = e.target.result;
    setUserData(userObj);
  };

  const handleFileUpload = (e: any) => {
    const reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(e.target.files[0]);
  };

  const handleRecoverClick = () => {
    recoverProfile();
    setToggleRecoverModal(false);
  };

  const recoverProfile = async () => {
    try {
      await recover_profile(userData).then(() => initializeApp());
    } catch (error) {
      console.log(error);
      navigate("/r-procedure");
    }
  };
  return (
    <Modal centered isOpen={toggleRecoverModal}>
      <ModalHeader toggle={() => setToggleRecoverModal(false)}>
        Recover profile
      </ModalHeader>
      <ModalBody>
        {" "}
        <StyledInput type="file" accept="json/*" onChange={handleFileUpload} />
      </ModalBody>

      <ModalFooter>
        {" "}
        <StyledButton onClick={handleRecoverClick}>Recover</StyledButton>
      </ModalFooter>
    </Modal>
  );
};

export default RecoverModal;
