import * as React from 'react';
import { observer } from 'mobx-react';
import store from '../../store';
import { icons } from '../../constants';
import { ContextMenu, ContextMenuItem } from '../ContextMenu';
import { DropArrow, Title } from '../Overlay/style';
import { BookmarksDial } from '../BookmarksDial';
import { TopSites } from '../TopSites';

const changeDialType = (type: 'top-sites' | 'bookmarks') => () => {
  store.settings.dialType = type;
  store.saveSettings();
};

const onDialTitleClick = (e: any) => {
  e.stopPropagation();
  store.overlay.dialTypeMenuVisible = !store.overlay.dialTypeMenuVisible;
};

const logout = async (e: any) => {
  e.stopPropagation();
  store.user.loggedin = false;
  store.user.username = "Guest";
  store.user.avatar = icons.user
  store.user.email = null;
  localStorage.removeItem("dot_footprint")
  store.user.menuVisible = false;
}

const settings = async (e: any) => {
  e.stopPropagation();
  store.overlay.currentContent = 'settings'
  store.user.menuVisible = false;
};

export const Dial = observer(() => {
  const { dialType } = store.settings;

  return (
    <>
      {(store.history.topSites.length > 0 ||
        store.bookmarks.list.length > 0) && (
        <>
          <Title
            onClick={onDialTitleClick}
            style={{ marginBottom: 24, cursor: 'pointer' }}
          >
            {dialType === 'bookmarks' ? 'Bookmarks' : 'Top Sites'}
            <DropArrow />
            <ContextMenu
              style={{ top: 42 }}
              visible={store.overlay.dialTypeMenuVisible}
            >
              <ContextMenuItem
                icon={icons.fire}
                selected={dialType === 'top-sites'}
                onClick={changeDialType('top-sites')}
              >
                Top Sites
              </ContextMenuItem>
              <ContextMenuItem
                icon={icons.bookmarks}
                selected={dialType === 'bookmarks'}
                onClick={changeDialType('bookmarks')}
              >
                Bookmarks
              </ContextMenuItem>
            </ContextMenu>
            <ContextMenu visible={store.user.menuVisible == true} style={{ top: '-20px', right: 0 }}>
              <ContextMenuItem icon={icons.user} onClick={settings}>
                  My Profile
              </ContextMenuItem>
              <ContextMenuItem icon={icons.close} onClick={logout}>
                  Sign out
              </ContextMenuItem>
            </ContextMenu>
          </Title>
          {dialType === 'bookmarks' ? <BookmarksDial /> : <TopSites />}
        </>
      )}
    </>
  );
});
