import React, { Fragment, useState } from 'react';

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

type Anchor = 'top' | 'left' | 'bottom' | 'right';

const SetupDrawer = () => {
  const classes = useStyles();
  const [isOpen, setOpen] = useState(false)

  const setups = [
    "Inbox",
    "Starred",
    "Send",
  ]

  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setOpen(open);
  };

  const list = () => (
    <div
      className={clsx(classes.list)}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {setups.map((text) => (
          <ListItem button key={text}>
            <ListItemText primary={text} />
            <Checkbox />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {setups.map((text, index) => (
          <ListItem button key={text}>
            <ListItemText primary={text} />
            <Checkbox />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div>
      <Button
        variant="contained"
        color="secondary"
        onClick={toggleDrawer(true)}
      >
        Setups
      </Button>

      <Drawer anchor="right" open={isOpen} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </div>
  );
}

export default SetupDrawer
