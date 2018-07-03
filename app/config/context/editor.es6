import { Menu, MenuItem } from 'electron';
import alias from '../alias.es6';

let menus = new Menu;

[
  'undo', 'redo', 'separator', 'cut',
  'copy', 'paste', 'delete', 'selectall'
].forEach(function (name) {
  let menu = {
    role: name,
    label: alias[ name ]
  };

  if (name === 'separator') {
    menu = { type: name };
  }

  menus.append(new MenuItem( menu ));
});

module.exports = menus;
