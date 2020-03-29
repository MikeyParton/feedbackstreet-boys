import React from 'react';
import { Formik } from 'formik';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Slide from '@material-ui/core/Slide';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { Preview } from './styled';
import { useScreenshot } from '../ScreenshotContext';

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

function IssueModal({
  show,
  handleSave,
  handleClose,
}) {
  const { currentImage } = useScreenshot();

  return (
    <Formik
      onSubmit={handleSave}
      initialValues={{
        user: '@michael',
        comment: '',
      }}
    >
      {({
        values, handleChange, submitForm, isSubmitting,
      }) => (
        <Dialog
          open={show}
          onClose={handleClose}
          TransitionComponent={Transition}
          keepMounted
        >
          <DialogTitle>Leave Feedbacks</DialogTitle>
          <DialogContent>
            <Box width="500px">
              <Preview src={currentImage} />
              <Box mt={2}>
                <>
                  <TextField
                    autoFocus
                    id="comment"
                    name="comment"
                    label="Comments"
                    margin="dense"
                    variant="outlined"
                    placeholder="Explain the issue..."
                    multiline
                    rows="4"
                    fullWidth
                    value={values.comment}
                    onChange={handleChange}
                  />
                </>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            {isSubmitting ? (
              <CircularProgress size={24} />
            ) : (
              <>
                <Button
                  onClick={handleClose}
                  variant="contained"
                  color="secondary"
                >
                  Cancel
                </Button>
                <Button
                  onClick={submitForm}
                  variant="contained"
                  color="primary"
                >
                  Create
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>
      )}
    </Formik>
  );
}

export default IssueModal;
