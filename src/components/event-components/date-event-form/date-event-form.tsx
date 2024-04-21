import * as React from 'react';
import { EventApi } from '../../../api/eventApi';
import { ErrorMessage } from '../../error/error';
import { dateAndTimeToString } from '../../../utilities';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { InvalidActionMsg } from '../../invalid-action-msg/invalid-action-msg';
import { BOContext } from '../../route-backoffice/route-backoffice';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import './date-event-form.scss';
import { APIStatus } from '../../../types';


interface DateEventFormProps {
  startDate: Date;
  endDate: Date;
}

export const UpdateEventTime: React.FC<DateEventFormProps> = ({ startDate, endDate }) => {
  const boContext = React.useContext(BOContext);

  const [currStartDate, setCurrStartDate] = React.useState<Date | null>(startDate);
  const [currEndDate, setCurrEndDate] = React.useState<Date | null>(endDate);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [invalidActionMsg, setInvalidActionMsg] = React.useState<string | null>(null);

  const moveToUserCatalog = () => {
    boContext?.setBackofficePage('catalog');
  }

  const onUpdateEvent = async () => {
    if (errorMessage === '') {
      setIsLoading(true);
      try {
        const res = await EventApi.updateEventDate(boContext?.backofficeEvent!._id!, currStartDate!, currEndDate!);
        if (res === APIStatus.Success) {
          let newEvent = boContext?.backofficeEvent!;
          newEvent!.startDate = dateAndTimeToString(currStartDate!);
          newEvent!.endDate = dateAndTimeToString(currEndDate!);
          boContext?.setBackofficeEvent(newEvent);
        }
      } catch (e) {
        console.error(e);
        const error = await e;
        if (error as APIStatus === APIStatus.Unauthorized) {
          setInvalidActionMsg('You are not authorized to perform this action');
        }
        //TODO: handle error
      } finally {
        setIsLoading(false);
      }
    }
    //call eventApi to update event date
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {invalidActionMsg && <InvalidActionMsg msg={invalidActionMsg} goToCatalog={moveToUserCatalog} />}
      <DemoContainer
        components={[
          'DateTimePicker',
        ]}
      >
        <DemoItem label="Select new start date & time">
          <DateTimePicker
            sx={{ backgroundColor: 'white' }}
            minDateTime={dayjs(startDate)}
            value={dayjs(startDate)}
            onChange={(newValue) => setCurrStartDate(newValue?.toDate()!)}
            onAccept={(newValue) => setCurrStartDate(newValue?.toDate()!)} />
        </DemoItem>
        <DemoItem label="Select new end date & time">
          <DateTimePicker
            sx={{ backgroundColor: 'white' }}
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