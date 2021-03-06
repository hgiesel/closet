import React, { useState, useEffect } from "react"

import TextField from "@material-ui/core/TextField"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Switch from "@material-ui/core/Switch"


interface ContextControlsProps {
  onContextChange?: (cardNumber: number, isBack: boolean) => void
  defaultCardNumber?: number
  defaultIsBack?: boolean
}

const ContextControls = ({
  onContextChange = () => {},
  defaultCardNumber = 1,
  defaultIsBack = false,
}: ContextControlsProps) => {
  const [cardNumber, setCardNumber] = useState(defaultCardNumber)
  const [isBack, setSide] = useState(defaultIsBack)

  useEffect(() => {
    onContextChange(cardNumber, isBack)
  }, [isBack, cardNumber])

  return (
    <>
      <TextField
        type="number"
        label="Card Number"
        defaultValue={defaultCardNumber}
        size="small"

        variant="outlined"
        InputProps={{
          inputProps: {
            min: 1,
              max: 100,
          }
        }}
        onInput={(event) => setCardNumber(Number((event.target as any).value))}
      />

      <FormControlLabel
        control={
          <Switch
            onChange={(_event, checked) => setSide(checked)}
            defaultChecked={defaultIsBack}
            color="primary"
          />
        }
        label={isBack ? "Backside" : "Frontside"}
      />
    </>
  )
}

export default ContextControls
