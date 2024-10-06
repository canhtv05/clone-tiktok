import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import { useCallback, useEffect, useState } from 'react';
import TippyHeadless from '@tippyjs/react/headless';
import styles from './Message.module.scss';
import ModalSuccess from '~/components/ModalSuccess';
import Button from '~/components/Button';
import {
    BinIcon,
    BlockIcon,
    DirectionArrowIcon,
    EllipsisIcon,
    FlagIcon,
    MuteIcon,
    PinToTopIcon,
    Setting2Icon,
    UnMuteIcon,
} from '~/components/Icons';
import { useNavigate } from 'react-router-dom';
import Image from '~/components/Image';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import ModalDelete from '~/components/ModalDelete';

const cx = classNames.bind(styles);

function Message() {
    document.title = 'Messages | TikTok';
    const [isShowModal, setIsShowModal] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [isShowTooltip, setIsShowTooltip] = useState([]);
    const [showIconEllipsis, setShowIconEllipsis] = useState([]);
    const [listChat, setListChat] = useState(JSON.parse(localStorage.getItem('list-message')) || []);
    const [listMute, setListMute] = useState([]);
    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const menuItem = [
        {
            title: listMute[selectedIndex] ? 'Unmute' : 'Mute',
            icon: listMute[selectedIndex] ? <UnMuteIcon /> : <MuteIcon />,
            separate: false,
        },
        {
            title: 'Delete',
            icon: <BinIcon width="1.6rem" height="1.6rem" />,
            separate: true,
        },
        {
            title: 'Pin to top',
            icon: <PinToTopIcon />,
            separate: true,
        },
        {
            title: 'Report',
            icon: <FlagIcon width="1.6rem" height="1.6rem" />,
            separate: true,
        },
        {
            title: 'Block',
            icon: <BlockIcon />,
            separate: true,
        },
    ];

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsShowModal(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (listChat.length > 0) {
            setSelectedIndex(0);

            const muteStatus = listChat.map((item) => item?.user?.is_muted || false);
            setListMute(muteStatus);
            setIsShowTooltip(new Array(listChat.length).fill(false));
            setShowIconEllipsis(new Array(listChat.length).fill(false));
        }
    }, [listChat]);

    useEffect(() => {
        const newListEllipsis = [...showIconEllipsis];
        listMute.forEach((item, index) => {
            if (item) {
                newListEllipsis[index] = true;
            }
        });
        setShowIconEllipsis(newListEllipsis);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listMute]);

    const handleClose = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const handleShowChatBox = (index) => {
        setSelectedIndex(index);
    };

    const handleShowTooltip = (index) => {
        const newIsShowTooltip = [...isShowTooltip];
        newIsShowTooltip[index] = !newIsShowTooltip[index];
        setIsShowTooltip(newIsShowTooltip);
    };

    const handleMute = useCallback(
        (index) => {
            const newListChat = [...listChat];
            const newMute = [...listMute];
            const newShowIconEllipsis = [...showIconEllipsis];

            if (newListChat[index]?.user?.is_muted) {
                newListChat[index].user.is_muted = false;
                newMute[index] = false;
                newShowIconEllipsis[index] = false;
            } else {
                newListChat[index].user.is_muted = true;
                newMute[index] = true;
            }
            localStorage.setItem('list-message', JSON.stringify(newListChat));
            setListChat(newListChat);
            setListMute(newMute);
            setShowIconEllipsis(newShowIconEllipsis);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [listMute, showIconEllipsis],
    );

    const handleDelete = useCallback(
        (index) => {
            const newListChat = [...listChat];
            newListChat.splice(index, 1);
            localStorage.setItem('list-message', JSON.stringify(newListChat));
            setListChat(newListChat);
        },
        [listChat],
    );

    const openModalDelete = (index) => {
        setSelectedIndex(index);
        setIsShowModalDelete(true);
    };

    const handleAction = (index) => {
        switch (menuItem[index].title) {
            case 'Mute': {
                handleMute(selectedIndex);
                break;
            }
            case 'Unmute': {
                handleMute(selectedIndex);
                break;
            }
            case 'Delete': {
                openModalDelete(selectedIndex);
                break;
            }
            default: {
            }
        }
    };

    const handleShowIconEllipsis = useCallback(
        (index) => {
            const newShowIconEllipsis = [...showIconEllipsis];
            newShowIconEllipsis[index] = false;
            setShowIconEllipsis(newShowIconEllipsis);
        },
        [showIconEllipsis],
    );

    const handleHideIconEllipsis = useCallback(
        (index) => {
            const newListMute = [...listMute];
            const newShowIconEllipsis = [...showIconEllipsis];
            if (listMute[index]) {
                newShowIconEllipsis[index] = true;
                newListMute[index] = true;
            }

            const newShowToolTip = [...isShowTooltip];
            if (listMute[index] && showIconEllipsis[index]) {
                newShowToolTip[index] = false;
            }

            if (isShowTooltip[index] && !showIconEllipsis[index]) {
                newShowToolTip[index] = true;
            }
            setIsShowTooltip(newShowToolTip);
            setShowIconEllipsis(newShowIconEllipsis);
            setListMute(newListMute);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [listMute],
    );

    const handleCloseModalDelete = useCallback(
        (index) => {
            setIsShowModalDelete(false);
            const newShowIconEllipsis = [...showIconEllipsis];
            newShowIconEllipsis[index] = true;
            setShowIconEllipsis(newShowIconEllipsis);
        },
        [showIconEllipsis],
    );

    const renderTippy = () => {
        return (
            <PopperWrapper className={cx('menu-list')} arrow offsetX={18} offsetY={-8}>
                {menuItem.map((item, index) => (
                    <div className={cx('wrapper-action')} key={index} onClick={() => handleAction(index)}>
                        <div className={cx('action-detail', { separate: item.separate })}>
                            <span className={cx('icon')}>{item.icon}</span>
                            <p className={cx('action-title')}>{item.title}</p>
                        </div>
                    </div>
                ))}
            </PopperWrapper>
        );
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('list-account')}>
                <Button onClick={handleClose} className={cx('btn-close')} circle midIcon={<DirectionArrowIcon />} />
                <div className={cx('menu-header')}>
                    <h1 className={cx('title')}>Messages</h1>
                    <span>
                        <Setting2Icon className={cx('btn-setting')} />
                    </span>
                </div>
                {listChat.length === 0 ? (
                    <div className={cx('empty-chat')}>
                        <span>No messages yet</span>
                    </div>
                ) : (
                    listChat.map((item, index) => (
                        <div
                            className={cx('has-chat', { selected: selectedIndex === index })}
                            key={index}
                            onClick={() => handleShowChatBox(index)}
                            onMouseOver={() => handleShowIconEllipsis(index)}
                            onMouseLeave={() => handleHideIconEllipsis(index)}
                        >
                            <div className={cx('item-info')}>
                                {isShowModalDelete && selectedIndex === index && (
                                    <ModalDelete
                                        title={`Are you sure you want to delete chat box with ${item?.user?.full_name}?`}
                                        onDelete={() => handleDelete(selectedIndex)}
                                        onClose={() => handleCloseModalDelete(index)}
                                    />
                                )}
                                <div className={cx('img-wrapper')}>
                                    <Image
                                        className={cx('avatar')}
                                        src={item?.user?.avatar}
                                        alt={item?.user?.nickname}
                                    />
                                </div>
                                <div className={cx('text-wrapper')}>
                                    <p className={cx('info-nickname')}>
                                        {item?.user?.full_name}
                                        {item?.user?.tick && (
                                            <FontAwesomeIcon className={cx('check')} icon={faCheckCircle} />
                                        )}
                                    </p>
                                    <p className={cx('info-extract-time')}>{item?.user?.time}</p>
                                </div>
                            </div>
                            <div
                                className={cx('wrapper-icon', {
                                    tooltip: isShowTooltip[index],
                                    mute: showIconEllipsis[index],
                                })}
                                onClick={() => handleShowTooltip(index)}
                            >
                                <TippyHeadless
                                    render={renderTippy}
                                    interactive
                                    placement="bottom"
                                    offset={[-70, 0]}
                                    visible={isShowTooltip[index]}
                                    onClickOutside={() => setIsShowTooltip(new Array(listChat.length).fill(false))}
                                >
                                    <span className={cx('ellipsis-icon')}>
                                        {listMute[index] && showIconEllipsis[index] && <MuteIcon />}
                                        {!showIconEllipsis[index] && <EllipsisIcon />}
                                    </span>
                                </TippyHeadless>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className={cx('chat-box')}></div>
            {isShowModal && <ModalSuccess title="Coming Soon!" />}
        </div>
    );
}

export default Message;
