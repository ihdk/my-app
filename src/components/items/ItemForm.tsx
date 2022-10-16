import React, { useState } from 'react';
import { useDispatch } from 'react-redux'
import { Field, FieldProps, Form, Formik, getIn, useFormikContext } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';

import useTheme from '@mui/material/styles/useTheme';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import TextField from '@mui/material/TextField';
import { TextFieldProps } from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { setAddingNewItemReducer } from '../../store/todosSlice';

import type { ItemType } from '../../assets/types';

/** Component props type */
type ItemFormProps = {
  data: ItemType;
  saveItem: (itemData: ItemType) => void;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  newItem?: boolean;
}

/** Item add/edit form data type */
type FormData = {
  title: string;
  description: string;
  date: string;
}

/**
 * Renders form to add new or edit existing todo item
 */
const ItemForm: React.FC<ItemFormProps> = ({ data, saveItem, setEditing, newItem = false }) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const [opened, setOpened] = useState(true);

  const minDateThreshold = new Date("2000-01-01T00:00:00.000Z");
  const maxDateThreshold = new Date("3000-01-01T00:00:00.000Z");
  const dateFormat = "DD.MM.YYYY HH:mm";
  

  /**
   * Handle add/edit item form submit and prepare data for save
   * 
   * @param values values submitted by the form
   */
  const handleSubmit = (values: FormData) => {
    const itemData = {
      ...data,
      title: values.title,
      description: values.description,
      date: dayjs(values.date).toISOString() // convert date to our format
    }
    saveItem(itemData);
  }


  /**
   * Handle close of edit form
   */
  const handleCancel = () => {
    if (newItem) {
      // disable add new item form
      dispatch(setAddingNewItemReducer(false));
    } else {
      // disable edit item form and show item itself
      setEditing(false);
    }
  }

  /**
   * Custom text field component with formik notifications
   */
  const EditItemTextField: React.FC<FieldProps & TextFieldProps> = (props) => {
    const touched = getIn(props.form.touched, props.field.name)
    const errorMessage = getIn(props.form.errors, props.field.name)
    const { error, helperText, field, form, ...rest } = props

    return (
      <TextField
        size="small"
        error={error ?? Boolean(touched && errorMessage)}
        helperText={helperText ?? ((touched && errorMessage) ? errorMessage : undefined)}
        {...rest} // mui props
        {...field} // formik props
      />
    )
  }

  /**
   * Custom datepicker component with formik notifications
   */
  const EditItemDatepicker: React.FC = () => {
    const { values, errors, touched, setFieldValue } = useFormikContext<FormData>();

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs} >
        <DateTimePicker
          inputFormat={dateFormat}
          value={values.date}
          onChange={(value) => setFieldValue('date', value)}
          ampm={false}
          minDate={minDateThreshold}
          renderInput={(params) => <TextField
            label="Deadline"
            name="date"
            size="small"
            error={touched && Boolean(errors.date)}
            helperText={touched && errors.date}
            {...params}
          />
          }
        />
      </LocalizationProvider>
    )
  }

  const initialFormData: FormData = {
    title: data.title,
    description: data.description,
    date: data.date
  }

  const validationSchema = yup.object({
    title: yup
      .string()
      .required("Title is required"),
    date: yup
      .date().nullable()
      .min(minDateThreshold, `Select date after ${dayjs(minDateThreshold).format(dateFormat)}`)
      .max(maxDateThreshold, `Select date before ${dayjs(maxDateThreshold).format(dateFormat)}`)
      .required("Deadline date is required")
      .typeError("Wrong date format")
  });

  return (
    <Fade onExited={handleCancel} in={opened}>
      <Box sx={{ mb: theme.spacing(2) }}>
        <Formik
          initialValues={initialFormData}
          validationSchema={validationSchema}
          validateOnBlur={false}
          onSubmit={handleSubmit}
        >
          <Form>
            <Card>
              <CardContent>
                <Grid container spacing={0}>
                  <Grid item xs={12} >
                    <Stack direction="column" width="100%" spacing={1}>
                      <Typography gutterBottom color="primary" component="div" variant="h6" >{newItem ? "New Item" : "Edit Item"}</Typography>
                      <Stack direction="column" width="100%" spacing={3}>
                        <Field name="title" label="Title" component={EditItemTextField} autoFocus={newItem} />
                        <Field name="description" label="Description" component={EditItemTextField} rows={4} multiline />
                        <EditItemDatepicker />
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
              <Divider />
              <CardActions>
                <Button type="submit" size="small" variant="outlined" >Save</Button>
                <Button size="small" sx={{ color: theme.palette.grey[500] }} onClick={() => setOpened(false)} >Cancel</Button>
              </CardActions>
            </Card>
          </Form>
        </Formik>
      </Box>
    </Fade>
  );
}

export default ItemForm;