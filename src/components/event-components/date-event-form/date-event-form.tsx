import * as React from 'react';
import { UserContext } from '../../route-user/route-user';
import { EventApi } from '../../../api/eventApi';
import { ErrorMessage } from '../../error/error';
import { dateAndTimeToString } from '../../../utilities';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import './date-event-form.scss';
import { APIStatus } from '../../../types';


interface DateEventFormProps {
  startDate: Date;
  endDate: Date;
}

export const UpdateEventTime: React.FC<DateEventFormProps> = ({ startDate, endDate }) => {
  const userContext = React.useContext(UserContext);

  const [currStartDate, setCurrStartDate] = React.useState<Date | null>(startDate);
  const [currEndDate, setCurrEndDate] = React.useState<Date | null>(endDate);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  const onUpdateEvent = async () => {
    if (errorMessage === '') 
    {
      setIsLoading(true);
      try {
        const res = await EventApi.updateEventDate(userContext?.userEvent!._id!, currStartDate!, currEndDate!);
        if (res === APIStatus.Success) {
          let newEvent = userContext?.userEvent!;
          newEvent!.start_date = dateAndTimeToString(currStartDate!);
          newEvent!.end_date = dateAndTimeToString(currEndDate!);
          userContext?.setUserEvent(newEvent);
        }
      } catch (e) {
        console.error(e);
        //TODO: handle error
      } finally {
        setIsLoading(false);
      }
    }
    //call eventApi to update event date
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'DateTimePicker',
        ]}
      >
        <DemoItem label="Select new start date & time">
          <DateTimePicker
            minDateTime={dayjs(startDate)}
            value={dayjs(startDate)}
            onChange={(newValue) => setCurrStartDate(newValue?.toDate()!)}
            onAccept={(newValue) => setCurrStartDate(newValue?.toDate()!)} />
        </DemoItem>
        <DemoItem label="Select new end date & time">
          <DateTimePicker
            minDateTime={dayjs(currStartDate).add(1, 'minute')}
            value={dayjs(currEndDate)}
            onError={(newValue) => { if (newValue) setErrorMessage("End date must be later that Start date"); else setErrorMessage(''); }}
            onChange={(newValue) => setCurrEndDate(newValue?.toDate()!)} />
        </DemoItem>
      </DemoContainer>
      {errorMessage && <ErrorMessage message={errorMessage} />}
      <LoadingButton
        className="saveChangesButton"
        size="small"
        onClick={() => onUpdateEvent()}
        loading={isLoading}
        disabled={errorMessage !== ''}
        loadingPosition="start"
        startIcon={<SaveIcon />}
        variant="contained"
      >
        <span>Save Changes</span>
      </LoadingButton>
    </LocalizationProvider>
  );
}