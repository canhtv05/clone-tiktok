import { memo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ProfileSection.module.scss';
import Image from '~/components/Image';
import { EllipsisIcon } from '~/components/Icons';
import TippyHeadless from '@tippyjs/react/headless';
import { renderTippy } from '../TippyRenders';
import ContentSection from '../ContentSection/ContentSection';
import ActionButtons from '../ActionButtons/ActionButtons';

const cx = classNames.bind(styles);

const ProfileSection = ({ data, isLoading }) => {
    if (isLoading) {
        return (
            <div className={cx('profile-wrapper')}>
                <div className={cx('desc-content-wrapper')}>
                    <div className={cx('info-container')}>
                        <div className={cx('styled-link')}>
                            <div style={{ width: 40, height: 40 }} className={cx('image-container')}>
                                <span style={{ width: 40, height: 40 }} className={cx('span-avatar-container')}>
                                    <div className={cx('image-avatar-loading')}></div>
                                </span>
                            </div>
                        </div>
                        <div className={cx('styled-link-styled-link', { loading: isLoading })}></div>
                    </div>
                    <div className={cx('desc-main-content')}></div>
                </div>
                <div className={cx('main-content')}>
                    <div className={cx('main-content-wrapper')}>
                        <div className={cx('flex-center-row', { loading: isLoading })}></div>
                    </div>
                    <div className={cx('copy-link-container')}></div>
                </div>
            </div>
        );
    }

    return (
        <div className={cx('profile-wrapper')}>
            <div className={cx('desc-content-wrapper')}>
                <div className={cx('info-container')}>
                    <Link className={cx('styled-link')}>
                        <div style={{ width: 40, height: 40 }} className={cx('image-container')}>
                            <span style={{ width: 40, height: 40 }} className={cx('span-avatar-container')}>
                                <Image src={data?.user?.avatar} className={cx('image-avatar')} />
                            </span>
                        </div>
                    </Link>
                    <Link className={cx('styled-link-styled-link')}>
                        <div className={cx('span-unique-id')}>
                            <span className={cx('span-ellipsis')}>
                                {`${data?.user?.first_name || ''} ${data?.user?.last_name || ''}`}
                            </span>
                        </div>
                        <div className={cx('span-other-infos')}>
                            <span className={cx('ellipsis')}>{`${data?.user?.nickname || ''}`}</span>
                            <span style={{ marginLeft: 8 }}>{`${data?.published_at?.split(' ')[0] || ''}`}</span>
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
                <ContentSection data={data} />
            </div>
            <ActionButtons data={data} />
        </div>
    );
};

ProfileSection.propTypes = {
    data: PropTypes.object,
    isLoading: PropTypes.bool,
};

export default memo(ProfileSection);
