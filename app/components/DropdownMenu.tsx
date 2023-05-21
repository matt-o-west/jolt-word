import { useState, useRef, useEffect, useContext } from 'react'
import { Context } from '~/root'
import { Form, Link } from '@remix-run/react'
import Button from '@mui/material/Button'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Grow from '@mui/material/Grow'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import Stack from '@mui/material/Stack'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout'

export default function DropdownMenu() {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)
  const { theme } = useContext(Context)

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return
    }

    setOpen(false)
  }

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault()
      setOpen(false)
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open)
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus()
    }

    prevOpen.current = open
  }, [open])

  return (
    <Stack direction='row' spacing={2}>
      <div>
        <Button
          ref={anchorRef}
          id='composition-button'
          aria-controls={open ? 'composition-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup='true'
          sx={{
            color: theme === 'light' ? 'gray' : 'white',
            marginX: '0.5rem',
            '&:hover': {
              background:
                theme === 'light'
                  ? 'linear-gradient(180deg, rgba(128, 128, 128, 0.1) 0%, rgba(128, 128, 128, 0.05) 100%)'
                  : 'linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
              backgroundSize: 'auto',
              backgroundPosition: 'center',
              paddingX: '0.5rem',
            },
          }}
          onClick={handleToggle}
        >
          <AccountCircleIcon name='user' radius='50%' />
        </Button>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement='bottom-end'
          className='z-40'
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom-end' ? 'left top' : 'left bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <div className='overflow-hidden'>
                    <MenuList
                      autoFocusItem={open}
                      id='composition-menu'
                      aria-labelledby='composition-button'
                      onKeyDown={handleListKeyDown}
                      className={`rounded-sm ${
                        theme === 'light'
                          ? 'bg-white text-black'
                          : 'bg-secondary.black text-white'
                      }`}
                    >
                      <MenuItem onClick={handleClose}>
                        <Link to='/user/profile'>Profile</Link>
                      </MenuItem>
                      <MenuItem onClick={handleClose}>
                        <Link to='/user/mywords'>My Words</Link>
                      </MenuItem>
                      <MenuItem onClick={handleClose}>
                        <Form action='/logout' method='post'>
                          <button type='submit' className='mr-4'>
                            Logout
                          </button>
                          <LogoutIcon
                            sx={{
                              fontSize: 'medium',
                            }}
                          />
                        </Form>
                      </MenuItem>
                    </MenuList>
                  </div>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </Stack>
  )
}
