import React, { Component } from 'react'
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

class TooltipButton extends Component {
  render() {
    const {children, onClick, tipTitle, btnClassName, tipClassName} = this.props;
    return (
      <Tooltip title={tipTitle} className={tipClassName}>
        <IconButton onClick={onClick} className={btnClassName}>
          {children}
        </IconButton>
      </Tooltip>
    )
  }
}

export default TooltipButton;
