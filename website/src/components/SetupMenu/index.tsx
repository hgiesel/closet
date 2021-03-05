import React, { useState, MouseEvent } from 'react';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import "./styles.css"
import styles from "./styles.module.css"

const exampleSetups = [
  "Clozes",
  "Multiple Choice Questions",
  "Clicking with Color",
  "Foobar meh",
]


const SimpleMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleClick}
      >
        Open Menu
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {exampleSetups.map((name: string) => (
          <MenuItem
            className={styles["menu-item"]}
            onKeyDown={(event) => event.preventDefault()}
          >
            <FormControlLabel
              control={
                <Checkbox
                  onChange={console.log}
                  color="secondary"
                />
              }
              label={name}
            />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default SimpleMenu;
