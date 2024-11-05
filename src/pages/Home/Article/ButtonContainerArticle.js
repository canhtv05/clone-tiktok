import classNames from 'classnames/bind';
import styles from './Article.module.scss';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '~/components/Button';
import { HeartFillIcon, MessageFillIcon, FavoritesFillIcon, ShareFillIcon } from '~/components/Icons';
import { memo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setPreviousLocation } from '~/redux/slices/previousLocationSlice';
import { setIndexVideoHome } from '~/redux/slices/indexVideoHomeSlice';
import { setReloadPage } from '~/redux/slices/pageSlice';

const cx = classNames.bind(styles);

function ButtonContainerArticle({ data, dataIndex }) {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleToCommentPage = useCallback(() => {
        dispatch(setPreviousLocation(location.pathname));
        dispatch(setIndexVideoHome(dataIndex));
        dispatch(setReloadPage(true));
        navigate(`/video/${data?.uuid}`);
    }, [data, dataIndex, dispatch, location, navigate]);

    return (
        <>
            <div className={cx('button-container')}>
                <Button
                    circle
                    midIcon={
                        <HeartFillIcon
                            width="2.4rem"
                            height="2.4rem"
                            style={{ color: data?.is_liked ? 'var(--primary)' : 'var(--white)' }}
                        />
                    }
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
    dataIndex: PropTypes.number,
    setIsClickComment: PropTypes.func,
};

export default memo(ButtonContainerArticle);
