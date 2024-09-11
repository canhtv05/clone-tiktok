import classNames from 'classnames/bind';
import { useState } from 'react';
import TippyHeadless from '@tippyjs/react/headless';
import Tippy from '@tippyjs/react';
import { Link } from 'react-router-dom';
import styles from './Comment.module.scss';
import Image from '~/components/Image';
import images from '~/assets/images';
import {
    EllipsisIcon,
    FavoritesFillIcon,
    HeartFillIcon,
    LikeIcon,
    MessageFillIcon,
    MusicNoticeIcon,
    ShareFillIcon,
} from '~/components/Icons';
import Button from '~/components/Button';
import { centerRowItems } from './MenuItem';
import { renderTippy, renderShareTippy, renderEllipsisTippy } from './TippyRenders';

const cx = classNames.bind(styles);

function Comment() {
    const [typeMenu, setTypeMenu] = useState('comments');

    const handleSelectedMenu = (type) => {
        setTypeMenu(type);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('search-comment-container')}>
                <div className={cx('comment-list-container')}>
                    <div className={cx('profile-wrapper')}>
                        <div className={cx('desc-content-wrapper')}>
                            <div className={cx('info-container')}>
                                <Link className={cx('styled-link')}>
                                    <div style={{ width: 40, height: 40 }} className={cx('image-container')}>
                                        <span style={{ width: 40, height: 40 }} className={cx('span-avatar-container')}>
                                            <Image src={images.avatar} className={cx('image-avatar')} />
                                        </span>
                                    </div>
                                </Link>
                                <Link className={cx('styled-link-styled-link')}>
                                    <div className={cx('span-unique-id')}>
                                        <span className={cx('span-ellipsis')}>mr.canh2639n</span>
                                    </div>{' '}
                                    <div className={cx('span-other-infos')}>
                                        <span className={cx('ellipsis')}>nhin gi</span>
                                        <span style={{ margin: '0 4px' }}>{' . '}</span>
                                        <span>2024-12-12</span>
                                    </div>
                                </Link>
                                <div>
                                    <TippyHeadless
                                        delay={[0, 200]}
                                        offset={[-80, 8]}
                                        placement="bottom"
                                        render={renderTippy}
                                        interactive
                                    >
                                        <span>
                                            <EllipsisIcon style={{ width: 24, height: 24, cursor: 'pointer' }} />
                                        </span>
                                    </TippyHeadless>
                                </div>
                            </div>
                            <div className={cx('desc-main-content')}>
                                <div className={cx('wrapper-main-content')}>
                                    <div style={{ maxHeight: 44 }} className={cx('div-text')}>
                                        <div className={cx('overflow-container')}>
                                            <div className={cx('wrapper-overflow')}>
                                                <span className={cx('div-text-span')}>
                                                    nhìu lựa chọn để làm việc nè🥰🥰 kiếm tiền cùng mình nha
                                                </span>
                                                <Link className={cx('styled-common-link')}>
                                                    <strong className={cx('strong-text')}>#hustmedia</strong>
                                                </Link>
                                                <span> </span>
                                                <Link className={cx('styled-common-link')}>
                                                    <strong className={cx('strong-text')}>
                                                        #xhhhhhhhhhhhhhhhhhhhhhhh
                                                    </strong>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <h4 className={cx('h4-link')}>
                                    <Link className={cx('styled-h4-link')}>
                                        <MusicNoticeIcon className={cx('music-notice-icon')} />
                                        <div className={cx('div-music-text')}>
                                            "想念"Emo Type Beat - 纯音乐 - 写在风中的信
                                        </div>
                                    </Link>
                                </h4>
                            </div>
                        </div>
                        <div className={cx('main-content')}>
                            <div className={cx('main-content-wrapper')}>
                                <div className={cx('flex-center-row')}>
                                    <div className={cx('center-row')}>
                                        <div className={cx('wrapper-button-center-row')}>
                                            <Button circle midIcon={<HeartFillIcon />} className={cx('button-icon')} />
                                            <strong className={cx('strong-center-row')}>1</strong>
                                        </div>
                                        <div className={cx('wrapper-button-center-row')}>
                                            <Button
                                                circle
                                                midIcon={<MessageFillIcon />}
                                                className={cx('button-icon')}
                                            />
                                            <strong className={cx('strong-center-row')}>1</strong>
                                        </div>
                                        <div className={cx('wrapper-button-center-row')}>
                                            <Button
                                                circle
                                                midIcon={<FavoritesFillIcon />}
                                                className={cx('button-icon')}
                                            />
                                            <strong className={cx('strong-center-row')}>1</strong>
                                        </div>
                                    </div>
                                    <div className={cx('center-row')}>
                                        {centerRowItems.map((item, index) => (
                                            <div key={index} className={cx('share-link')}>
                                                <Tippy
                                                    interactive
                                                    content={item.title}
                                                    offset={[0, 10]}
                                                    placement="top"
                                                >
                                                    <div>
                                                        <span className={cx('center-icon')}>{item.icon}</span>
                                                    </div>
                                                </Tippy>
                                            </div>
                                        ))}
                                        <button className={cx('button-share')}>
                                            <TippyHeadless
                                                offset={[-120, 15]}
                                                placement="bottom"
                                                interactive
                                                render={renderShareTippy}
                                            >
                                                <span>
                                                    <ShareFillIcon />
                                                </span>
                                            </TippyHeadless>
                                        </button>
                                    </div>
                                </div>
                                <div className={cx('copy-link-container')}>
                                    <p className={cx('p-copy-link-text')}>
                                        https://www.tiktok.com/@rainrain9982/video/7296850149144300818?is_from_webapp=1&sender_device=pc&web_id=7380842088713455112
                                    </p>
                                    <button className={cx('button-copy-link')}>Copy link</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={cx('tab-menu-container')}>
                        <div className={cx('nav-menu')}>
                            <Button
                                onClick={() => handleSelectedMenu('comments')}
                                className={cx('nav-button', { active: typeMenu === 'comments' })}
                            >
                                <span className={cx('title')}>Comments{` (2)`}</span>
                            </Button>
                            <Button
                                onClick={() => handleSelectedMenu('creator')}
                                className={cx('nav-button', { active: typeMenu === 'creator' })}
                            >
                                <span className={cx('title')}>Creator videos</span>
                            </Button>
                            <div className={cx('tab-line')}></div>
                        </div>
                    </div>
                    <div className={cx('comment-item-container')}>
                        <div className={cx('comment-content-container')}>
                            <Link className={cx('styled-link-avatar')}>
                                <span style={{ width: 40, height: 40 }} className={cx('span-avatar-container')}>
                                    <Image src={images.avatar} className={cx('image-avatar')} />
                                </span>
                            </Link>
                            <div className={cx('content-container')}>
                                <Link className={cx('styled-user-link-name')}>
                                    <span className={cx('user-name-text')}>Ốc🐌(lilykim)</span>
                                </Link>
                                <p className={cx('comment-text')}>
                                    <span>Ib m kéo</span>
                                </p>
                                <p className={cx('comment-sub-content')}>
                                    <span className={cx('span-created-time')}>2023-11-17</span>
                                    <span className={cx('span-reply-button')}>Reply</span>
                                </p>
                            </div>
                            <div className={cx('action-container-comment')}>
                                <div className={cx('like-wrapper')}>
                                    <div className={cx('ellipsis-icon')}>
                                        <TippyHeadless
                                            render={renderEllipsisTippy}
                                            placement="bottom"
                                            interactive
                                            offset={[-80, 10]}
                                            visible
                                        >
                                            <span>
                                                <EllipsisIcon />
                                            </span>
                                        </TippyHeadless>
                                    </div>
                                    <div className={cx('like-icon')}>
                                        <LikeIcon />
                                    </div>
                                    <div className={cx('span-count')}>0</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('bottom-comment-container')}>
                <div className={cx('div-comment-container')}>
                    <div className={cx('div-layout-container')}></div>
                </div>
            </div>
        </div>
    );
}

export default Comment;
