import React, { KeyboardEvent, MouseEvent, useState } from 'react';

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import type { SetupInfo } from "../../setups"
import * as setups from "../../setups"

import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel'


const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});


type SetupDrawerProps = { onSetupsChanged: (setups: SetupInfo[]) => void }

const SetupDrawer = ({ onSetupsChanged }: SetupDrawerProps) => {
  const classes = useStyles();
  const [isOpen, setOpen] = useState(false)

  const setupInfos = Object.entries(setups)
    .filter(([key]) => key !== "__esModule")
    .map(([key, value]) => ({ key, ...value }))

  const setupStates = setupInfos.reduce((accu, value) => {
    accu[value.key] = false;
    return accu;
  }, {})

  const notifySetupUpdate = (key: string, state: boolean): void => {
    setupStates[key] = state;

    const newSetups = Object.entries(setupStates)
      .filter(([, state]) => state)
      .map((([setupName]) => setups[setupName]))

    onSetupsChanged(newSetups)
  }

  const toggleDrawer = (open: boolean) => (
    event: KeyboardEvent | MouseEvent,
  ) => {
    if (
      event.type === 'keydown' && [
        "Tab",
        "Shift",
      ].includes((event as KeyboardEvent).key)
    ) {
      return;
    }

    setOpen(open);
  };

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
        <div
          className={clsx(classes.list)}
          role="presentation"
        >
          <List>
            {setupInfos.map(({ title, key }) => (
              <FormControlLabel
                key={key}
                control={
                  <Checkbox
                    onChange={(_event, checked) => notifySetupUpdate(key, checked)}
                    color="primary"
                  />
                }
                label={title}
              />
            ))}
          </List>
        </div>
      </Drawer>
    </div>
  );
}

export default SetupDrawer
