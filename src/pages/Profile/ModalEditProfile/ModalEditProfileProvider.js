import { createContext } from 'react';
import { useSelector } from 'react-redux';

export const ModalEditProfileContext = createContext();

function ModalEditProfileProvider({ children, setIsShowModal }) {
    const nickname = useSelector((state) => state.getNickname.nickname);
    const fullName = useSelector((state) => state.fullNameCurrentUser.fullNameCurrentUser);
    const { bio, likes, followers } = useSelector((state) => state.infoCurrentUser.infoCurrentUser);
    const imgCurrentUser = useSelector((state) => state.currentUserImage.currentUserImage);

    const data = { nickname, fullName, bio, likes, followers, setIsShowModal, imgCurrentUser };
    return <ModalEditProfileContext.Provider value={data}>{children}</ModalEditProfileContext.Provider>;
}

export default ModalEditProfileProvider;
