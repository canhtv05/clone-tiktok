import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import TippyHeadless from '@tippyjs/react/headless';
import styles from './Message.module.scss';
import ModalSuccess from '~/components/ModalSuccess';
import Button from '~/components/Button';
import {
    BinIcon,
    BlockIcon,
    CloseIcon,
    DirectionArrowIcon,
    EllipsisIcon,
    FlagIcon,
    MuteIcon,
    NextVideoIcon,
    PinToTopIcon,
    Setting2Icon,
    TickIcon,
    TopArrowIcon,
    UnMuteIcon,
} from '~/components/Icons';
import { Link, useNavigate } from 'react-router-dom';
import Image from '~/components/Image';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import ModalDelete from '~/components/ModalDelete';
import BottomAction from '../Video/Comment/BottomAction';
import useLocalStorage from '~/hooks/useLocalStorage';
import ModalReport from '~/components/Modals/ModalReport';
import ModalReportSuccess from '~/components/Modals/ModalReport/ModalReportSuccess';

const cx = classNames.bind(styles);

function Message() {
    const navigate = useNavigate();
    const [isShowModal, setIsShowModal] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedTooltip, setSelectedToolTip] = useState(null);
    const [listShowTooltip, setListShowTooltip] = useState([]);
    const [listShowIconEllipsis, setListShowIconEllipsis] = useState([]);
    const [listChat, setListChat] = useLocalStorage('list-message', []);
    const [listMute, setListMute] = useState([]);
    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [listPostMessage, setListPostMessage] = useState([]);
    const [isShowModalMessage, setIsShowModalMessage] = useState(false);
    const [isShowModalReport, setIsShowModalReport] = useState(false);
    const [isNext, setIsNext] = useState(false);
    const [contentReport, setContentReport] = useState('');
    const [selectedCheckbox, setSelectedCheckbox] = useState([]);
    const [isShowModalReportSuccess, setIsShowModalReportSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    document.title = 'Messages | TikTok';

    const inputRef = useRef(null);
    const chatContainerRef = useRef(null);

    const menuItem = [
        {
            title: listMute[selectedTooltip] ? 'Unmute' : 'Mute',
            icon: listMute[selectedTooltip] ? <UnMuteIcon /> : <MuteIcon />,
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

    const action = (isMe) => {
        const actions = [
            {
                title: 'Like',
            },
            {
                title: 'Delete',
            },
        ];

        if (!isMe) {
            actions.push({ title: 'Report' });
        }

        return actions;
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsShowModal(false);
            if (isShowModalMessage) {
                setIsShowModalMessage(false);
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [isShowModalMessage]);

    useEffect(() => {
        if (listChat.length > 0) {
            if (selectedIndex !== null) {
                setSelectedIndex(selectedIndex);
            } else {
                setSelectedIndex(0);
            }

            setListPostMessage(listChat);

            const muteStatus = listChat.map((item) => item?.user?.is_muted || false);
            setListMute(muteStatus);
            setListShowTooltip(new Array(listChat.length).fill(false));
            setListShowIconEllipsis(new Array(listChat.length).fill(false));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listChat]);

    useEffect(() => {
        const newListEllipsis = [...listShowIconEllipsis];
        listMute.forEach((item, index) => {
            if (item) {
                newListEllipsis[index] = true;
            }
        });
        setListShowIconEllipsis(newListEllipsis);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listMute]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [listPostMessage]);

    useEffect(() => {
        if (listChat.length > 0 && selectedIndex !== null) {
            setSelectedCheckbox(new Array(listChat[selectedIndex].me.content_me.length + 1).fill(false));
        }
    }, [listChat, selectedIndex]);

    const handleClose = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const handleShowChatBox = (index) => {
        setSelectedIndex(index);
    };

    const handleMute = useCallback(
        (index) => {
            const newListChat = [...listChat];
            const newMute = [...listMute];
            const newShowIconEllipsis = [...listShowIconEllipsis];

            if (newListChat[index]?.user?.is_muted) {
                newListChat[index].user.is_muted = false;
                newMute[index] = false;
                newShowIconEllipsis[index] = false;
            } else {
                newListChat[index].user.is_muted = true;
                newMute[index] = true;
            }
            setListChat(newListChat);
            setListMute(newMute);
            setListShowIconEllipsis(newShowIconEllipsis);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [listMute, listShowIconEllipsis],
    );

    const handleShowTooltip = useCallback(
        (index) => {
            const newIsShowTooltip = [...listShowTooltip];
            newIsShowTooltip[index] = !newIsShowTooltip[index];
            setSelectedToolTip(index);
            setListShowTooltip(newIsShowTooltip);
        },
        [listShowTooltip],
    );

    const handleDelete = useCallback(
        (index) => {
            const newListChat = [...listChat];
            newListChat.splice(index, 1);
            setSelectedIndex(selectedIndex);
            setListChat(newListChat);
        },
        [listChat, selectedIndex, setListChat],
    );

    const openModalDelete = (index) => {
        setSelectedToolTip(index);
        setIsShowModalDelete(true);
    };

    const handleCloseModalDelete = useCallback(
        (index) => {
            setIsShowModalDelete(false);
            const newShowIconEllipsis = [...listShowIconEllipsis];
            newShowIconEllipsis[index] = true;
            setListShowIconEllipsis(newShowIconEllipsis);
        },
        [listShowIconEllipsis],
    );

    const handlePinToTop = useCallback(
        (index) => {
            const newListChat = [...listChat];
            const getItemPinToTop = newListChat.splice(index, 1)[0];
            newListChat.unshift(getItemPinToTop);
            setListChat(newListChat);
        },
        [listChat, setListChat],
    );

    const handleAction = (index) => {
        switch (menuItem[index].title) {
            case 'Mute': {
                handleMute(selectedTooltip);
                break;
            }
            case 'Unmute': {
                handleMute(selectedTooltip);
                break;
            }
            case 'Delete': {
                openModalDelete(selectedTooltip);
                break;
            }
            case 'Pin to top': {
                handlePinToTop(selectedTooltip);
                break;
            }
            default: {
            }
        }
    };

    const handleShowIconEllipsis = useCallback(
        (index) => {
            const newShowIconEllipsis = [...listShowIconEllipsis];
            newShowIconEllipsis[index] = false;
            setListShowIconEllipsis(newShowIconEllipsis);
        },
        [listShowIconEllipsis],
    );

    const handleHideIconEllipsis = useCallback(
        (index) => {
            const newListMute = [...listMute];
            const newShowIconEllipsis = [...listShowIconEllipsis];
            if (listMute[index]) {
                newShowIconEllipsis[index] = true;
                newListMute[index] = true;
            }

            const newShowToolTip = [...listShowTooltip];
            if (listMute[index] && listShowIconEllipsis[index]) {
                newShowToolTip[index] = false;
            }

            if (listShowTooltip[index] && !listShowIconEllipsis[index]) {
                newShowToolTip[index] = true;
            }

            setListShowTooltip(newShowToolTip);
            setListShowIconEllipsis(newShowIconEllipsis);
            setListMute(newListMute);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [listMute],
    );

    const handleDeleteItemChat = useCallback(
        (index, isMe) => {
            if (selectedIndex !== null && isMe) {
                const newListChat = [...listChat];
                newListChat[selectedIndex].me.content_me.splice(index, 1);
                setListChat(newListChat);
            }
            if (!isMe) {
                setIsShowModalMessage(true);
            }
        },
        [listChat, selectedIndex, setListChat],
    );

    const handleShowModalModalReport = () => {
        const newListCheckbox = [...selectedCheckbox];
        newListCheckbox[0] = true;
        setSelectedCheckbox(newListCheckbox);
        setIsShowModalReport(true);
    };

    const handleActionMenuTippy = (title, index, isMe) => {
        switch (title) {
            case 'Like': {
                break;
            }
            case 'UnLike': {
                break;
            }
            case 'Delete': {
                handleDeleteItemChat(index, isMe);
                break;
            }
            case 'Report': {
                handleShowModalModalReport();
                break;
            }

            default: {
            }
        }
    };

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

    const renderTippyMessage = (isMe, indexItemChat) => {
        return (
            <div className={cx('action-menu')}>
                {action(isMe).map((item, index) => (
                    <span
                        className={cx('item-action')}
                        key={index}
                        onClick={() => handleActionMenuTippy(item.title, indexItemChat, isMe)}
                    >
                        {item.title}
                    </span>
                ))}

                <TopArrowIcon className={cx('top-arrow')} />
            </div>
        );
    };

    const handleCheckbox = (index) => {
        const newCheckbox = [...selectedCheckbox];
        newCheckbox[index] = !newCheckbox[index];
        setSelectedCheckbox(newCheckbox);
    };

    const MessageContainer = memo(({ item, src, alt, right = false, isMe, indexItemChat, index }) => {
        return (
            <div
                className={cx('message-container', {
                    right,
                    'report-right': isNext && right,
                    'report-left': isNext && !right,
                })}
            >
                {isNext && !right && (
                    <div
                        className={cx('wrap-checkbox', { selected: selectedCheckbox[index] })}
                        onClick={() => handleCheckbox(index)}
                    >
                        <input
                            type="checkbox"
                            name={item}
                            className={cx('checkbox', { selected: selectedCheckbox[index] })}
                        />
                        {selectedCheckbox[index] && (
                            <div className={cx('div-checkbox-icon')}>
                                <TickIcon width="1.8rem" height="1.8rem" />
                            </div>
                        )}
                    </div>
                )}
                {!isNext && (
                    <Link>
                        <span className={cx('span-avatar-container')}>
                            <Image className={cx('avatar-message')} src={src} alt={alt} />
                        </span>
                    </Link>
                )}
                <div className={cx('text-container', { right, report: isNext })}>
                    <p className={cx('text')}>{item}</p>
                </div>
                {!isNext && (
                    <span className={cx('ellipsis-icon-2', { right })}>
                        <TippyHeadless
                            render={() => renderTippyMessage(isMe, indexItemChat)}
                            interactive
                            placement="top"
                        >
                            <span style={{ display: 'flex' }}>
                                <EllipsisIcon />
                            </span>
                        </TippyHeadless>
                    </span>
                )}
                {isNext && right && (
                    <div
                        className={cx('wrap-checkbox', { selected: selectedCheckbox[index], right })}
                        onClick={() => handleCheckbox(index)}
                    >
                        <input
                            type="checkbox"
                            name={item}
                            className={cx('checkbox', { selected: selectedCheckbox[index] })}
                        />
                        {selectedCheckbox[index] && (
                            <div className={cx('div-checkbox-icon')}>
                                <TickIcon width="1.8rem" height="1.8rem" />
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    });

    const MessageMe = useCallback(
        ({ itemListChat, isMe }) => {
            return (
                itemListChat?.me?.content_me.length !== 0 &&
                itemListChat?.me?.content_me.map((item, index) => (
                    <MessageContainer
                        key={index}
                        item={item}
                        src={itemListChat?.me?.avatar}
                        alt={itemListChat?.me?.nickname}
                        right
                        isMe={isMe}
                        indexItemChat={index}
                        index={index + 1}
                    />
                ))
            );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedIndex, isNext, selectedCheckbox],
    );

    const handlePostMessage = useCallback(
        (index) => {
            const newListChat = [...listChat];
            newListChat[index].me.content_me.push(inputRef.current.value);
            setListPostMessage((prev) => [...prev, ...inputRef.current.value]);
            setListChat(newListChat);
            inputRef.current.value = '';
        },
        [listChat, setListChat],
    );

    const handleShowModalReport = () => {
        setIsNext(false);
        setIsShowModalReport(true);
    };

    const handleHiddenModalReport = () => {
        setIsNext(false);
        setIsShowModalReport(false);
    };

    const handleSubmitReport = () => {
        setIsShowModalReport(false);
        setIsNext(false);
        setIsShowModalReportSuccess(true);
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
                                {isShowModalDelete && selectedTooltip === index && (
                                    <ModalDelete
                                        title={`Are you sure you want to delete chat box with ${item?.user?.full_name}?`}
                                        onDelete={() => handleDelete(selectedTooltip)}
                                        onClose={() => handleCloseModalDelete(index)}
                                    />
                                )}
                                <div className={cx('img-wrapper', { online: item?.user?.is_online === 1 })}>
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
                                    tooltip: listShowTooltip[index],
                                    mute: listShowIconEllipsis[index],
                                })}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleShowTooltip(index);
                                }}
                            >
                                <TippyHeadless
                                    render={renderTippy}
                                    interactive
                                    placement="bottom"
                                    offset={[-70, 0]}
                                    visible={listShowTooltip[index]}
                                    onClickOutside={() => setListShowTooltip(new Array(listChat.length).fill(false))}
                                >
                                    <span className={cx('ellipsis-icon')}>
                                        {listMute[index] && listShowIconEllipsis[index] && <MuteIcon />}
                                        {!listShowIconEllipsis[index] && <EllipsisIcon />}
                                    </span>
                                </TippyHeadless>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className={cx('chat-box', { report: isNext })}>
                {listChat.length !== 0 && (
                    <>
                        <div className={cx('chat-header', { report: isNext })}>
                            {!isNext && (
                                <div className={cx('wrapper-info')}>
                                    <Link>
                                        <span
                                            className={cx('span-avatar-user', {
                                                online: listChat[selectedIndex]?.user?.is_online === 1,
                                            })}
                                        >
                                            <Image
                                                className={cx('avatar-user')}
                                                src={listChat[selectedIndex]?.user?.avatar}
                                                alt={listChat[selectedIndex]?.user?.full_name}
                                            />
                                        </span>
                                    </Link>
                                    <Link>
                                        <div className={cx('container-name')}>
                                            <p className={cx('chat-full-name')}>
                                                {listChat[selectedIndex]?.user?.full_name}
                                                {listChat[selectedIndex]?.user?.tick && (
                                                    <FontAwesomeIcon className={cx('check')} icon={faCheckCircle} />
                                                )}
                                            </p>
                                            <p
                                                className={cx('chat-nickname')}
                                            >{`@${listChat[selectedIndex]?.user?.nickname}`}</p>
                                        </div>
                                    </Link>
                                </div>
                            )}
                            {isNext && (
                                <div className={cx('wrapper-report')}>
                                    <span className={cx('btn-prev')} onClick={handleShowModalReport}>
                                        <NextVideoIcon width="1.8rem" height="1.8rem" />
                                    </span>
                                    <div className={cx('report-text')}>
                                        <span className={cx('report-title')}>{'Report reason: '}</span>
                                        <span className={cx('report-reason')}>{contentReport}</span>
                                    </div>
                                    <span className={cx('close-report')} onClick={handleHiddenModalReport}>
                                        <CloseIcon width="1.6rem" height="1.6rem" />
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className={cx('content-message')} ref={chatContainerRef}>
                            <div className={cx('div-chat-item-wrapper')}>
                                {listChat[selectedIndex]?.user?.content_user.length !== 0 && (
                                    <MessageContainer
                                        key={-1}
                                        item={listChat[selectedIndex]?.user?.content_user}
                                        alt={listChat[selectedIndex]?.user?.nickname}
                                        src={listChat[selectedIndex]?.user?.avatar}
                                        isMe={listChat[selectedIndex]?.user?.isMe}
                                        index={0}
                                    />
                                )}
                                <span className={cx('verify-message')}>
                                    This is a conversation with an unknown person.
                                </span>
                                {listChat[selectedIndex]?.me?.content_me.length !== 0 && (
                                    <MessageMe
                                        itemListChat={listChat[selectedIndex]}
                                        isMe={listChat[selectedIndex]?.me?.isMe}
                                    />
                                )}
                            </div>
                        </div>
                        <div className={cx('wrapper-send')}>
                            {isNext ? (
                                <div className={cx('report-bottom-container')}>
                                    <p className={cx('message-selected')}>
                                        <span>
                                            {selectedCheckbox.filter((item) => item === true).length}
                                            {'/50 '}
                                        </span>
                                        message selected
                                    </p>
                                    <Button
                                        primary
                                        className={cx('submit-report', {
                                            disable: selectedCheckbox.filter((item) => item === true).length === 0,
                                        })}
                                        disable={selectedCheckbox.filter((item) => item === true).length === 0}
                                        onClick={handleSubmitReport}
                                    >
                                        Submit
                                    </Button>
                                </div>
                            ) : (
                                <BottomAction
                                    inputRef={inputRef}
                                    noPadding
                                    classname={cx('bottom-action')}
                                    typeMessage
                                    onClick={() => handlePostMessage(selectedIndex)}
                                />
                            )}
                        </div>
                    </>
                )}
            </div>
            {isShowModal && <ModalSuccess title="Coming Soon!" />}
            {isShowModalMessage && <ModalSuccess title="Cái này xóa làm gì bro :v" />}
            <ModalReport
                isShowModalReport={isShowModalReport}
                onClose={() => setIsShowModalReport(false)}
                isNext={isNext}
                setIsNext={setIsNext}
                setContentReport={setContentReport}
            />
            <ModalReportSuccess
                isShowModalReportSuccess={isShowModalReportSuccess}
                setIsShowModalReportSuccess={() => setIsShowModalReportSuccess(false)}
            />
            {isNext && <div className={cx('overlay')}></div>}
        </div>
    );
}

export default Message;
