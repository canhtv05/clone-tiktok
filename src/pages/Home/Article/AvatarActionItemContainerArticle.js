import classNames from 'classnames/bind';
import TippyHeadless from '@tippyjs/react/headless';
import PropTypes from 'prop-types';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import styles from './Article.module.scss';
import { PlusIcon } from '~/components/Icons';
import Image from '~/components/Image';
import { useDispatch } from 'react-redux';
import { setProfile } from '~/redux/slices/profileSlice';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import AccountPreview from '~/layouts/components/Sidebar/SuggestAccounts/AccountPreview';

const cx = classNames.bind(styles);

function AvatarActionItemContainerArticle({ data }) {
    const dispatch = useDispatch();

    const renderPreview = (props) => {
        return (
            <div tabIndex="-1" {...props}>
                <PopperWrapper>
                    <AccountPreview data={data?.user} isFollowing={false} showBio />
                </PopperWrapper>
            </div>
        );
    };

    return (
        <div className={cx('avatar-action-item-container')}>
            <TippyHeadless
                appendTo={document.body}
                interactive
                delay={[800, 500]}
                offset={[0, 25]}
                placement="bottom-start"
                render={renderPreview}
            >
                <Link to={`/profile/@${data?.user?.nickname}`} onClick={() => dispatch(setProfile({}))}>
                    <div className={cx('div-container')} style={{ width: 48, height: 48 }}>
                        <div className={cx('avatar-wrapper')}>
                            <span
                                className={cx('span-avatar-container-style-avatar')}
                                style={{ width: 48, height: 48 }}
                            >
                                <Image className={cx('avatar')} src={data?.user?.avatar} alt={data?.user?.nickname} />
                            </span>
                        </div>
                    </div>
                </Link>
            </TippyHeadless>
            <button className={cx('avatar-follow-button')}>
                <div className={cx('button-content')}>
                    <PlusIcon />
                </div>
            </button>
        </div>
    );
}

AvatarActionItemContainerArticle.propTypes = {
    data: PropTypes.shape({
        user: PropTypes.shape({
            nickname: PropTypes.string.isRequired,
            avatar: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
};

export default memo(AvatarActionItemContainerArticle);
