import classNames from 'classnames/bind';
import styles from './Article.module.scss';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '~/components/Button';
import { HeartFillIcon, MessageFillIcon, FavoritesFillIcon, ShareFillIcon } from '~/components/Icons';
import { memo } from 'react';
import { useDispatch } from 'react-redux';
import { setPreviousLocation } from '~/redux/slices/previousLocationSlice';

const cx = classNames.bind(styles);

function ButtonContainerArticle({ data }) {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleToCommentPage = () => {
        dispatch(setPreviousLocation(location.pathname));
        navigate(`/video/${data?.uuid}`);
    };

    return (
        <>
            <div className={cx('button-container')}>
                <Button
                    circle
                    midIcon={<HeartFillIcon width="2.4rem" height="2.4rem" />}
                    className={cx('btn-heart')}
                ></Button>
                <strong className={cx('strong-text')}>{data?.likes_count}</strong>
            </div>
            <div className={cx('button-container')}>
                <Button
                    circle
                    midIcon={<MessageFillIcon width="2.4rem" height="2.4rem" />}
                    className={cx('btn-comment')}
                    onClick={handleToCommentPage}
                ></Button>
                <strong className={cx('strong-text')}>{data?.comments_count}</strong>
            </div>
            <div className={cx('button-container')}>
                <Button
                    circle
                    midIcon={<FavoritesFillIcon width="2.4rem" height="2.4rem" />}
                    className={cx('btn-favorite')}
                ></Button>
                <strong className={cx('strong-text')}>0</strong>
            </div>
            <div className={cx('button-container')}>
                <Button
                    circle
                    midIcon={<ShareFillIcon width="2.4rem" height="2.4rem" />}
                    className={cx('btn-share')}
                ></Button>
                <strong className={cx('strong-text')}>{data?.shares_count}</strong>
            </div>
        </>
    );
}

ButtonContainerArticle.propTypes = {
    data: PropTypes.shape({
        likes_count: PropTypes.number.isRequired,
        comments_count: PropTypes.number.isRequired,
        shares_count: PropTypes.number.isRequired,
        uuid: PropTypes.string.isRequired,
    }).isRequired,
};

export default memo(ButtonContainerArticle);
