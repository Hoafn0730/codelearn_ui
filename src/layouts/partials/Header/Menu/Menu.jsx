import PropTypes from 'prop-types';
import HeadlessTippy from '@tippyjs/react/headless';
import classnames from 'classnames/bind';
import { useState } from 'react';

import styles from './Menu.module.scss';
import Header from './Header';
import MenuItem from './MenuItem';
import PopperWrapper from '~/components/Popper';
import { changeTheme } from '~/store/action/themeAction';
import { useTheme } from '~/contexts/themeContext';
import Image from '~/components/Image';

const cx = classnames.bind(styles);

function Menu({ children, isShow, isLogin, items = [], onHide }) {
    const [history, setHistory] = useState([{ data: items }]);
    const current = history[history.length - 1];
    const {
        state: { isDarkMode },
        dispatch,
    } = useTheme();

    const renderItems = () => {
        return current.data.map((item, index) => {
            const isParent = !!item.children;
            if (item.toggle) {
                item.isDarkMode = isDarkMode;
            }

            return (
                <MenuItem
                    key={index}
                    data={item}
                    toggle={item.toggle}
                    onClick={() => {
                        if (isParent) {
                            setHistory((prev) => [...prev, item.children]);
                        } else {
                            onChange(item);
                        }
                    }}
                />
            );
        });
    };

    const onChange = (menuItem) => {
        switch (menuItem.type) {
            case 'theme': {
                return dispatch(changeTheme(!isDarkMode));
            }
            case 'language': {
                return console.log(menuItem);
            }
            default:
        }
    };

    const handleBack = () => {
        setHistory((prev) => prev.slice(0, history.length - 1));
    };

    return (
        <HeadlessTippy
            visible={isShow}
            delay={[0, 200]}
            offset={[13, 4]}
            interactive
            placement="bottom-end"
            render={(attrs) => (
                <PopperWrapper
                    className={cx('wrapper')}
                    position={{ top: '-16px', right: '28px' }}
                    tabIndex={-1}
                    {...attrs}
                >
                    <div className={cx('list')}>
                        {history.length > 1 && <Header title={current.title} onBack={handleBack} />}
                        {isLogin && !(history.length > 1) && (
                            <div className={cx('user')}>
                                <Image
                                    src="http://localhost:3000/static/media/avatar.629fae61566dbce528a0.jpg"
                                    alt=""
                                    className={cx('avatar')}
                                />
                                <div className={cx('info')}>
                                    <span className={cx('name')}>Hoàn Trần</span>
                                    <div className={cx('username')}>
                                        @<span>hoafn.t</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className={cx('body')}>{renderItems()}</div>
                    </div>
                </PopperWrapper>
            )}
            onClickOutside={onHide}
        >
            {children}
        </HeadlessTippy>
    );
}

Menu.propTypes = {
    children: PropTypes.node.isRequired,
    items: PropTypes.array.isRequired,
};

export default Menu;
