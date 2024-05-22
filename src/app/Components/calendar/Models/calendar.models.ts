import { Languages } from './languages.models';

export enum CalendarPanel {
  Days,
  Months,
  Years,
}

export enum DateType {
  Before,
  Current,
  After,
}

export enum FormFieldKeys {
  Id = 'id',
  Title = 'title',
  DiasHabiles = 'diasHabiles',
  StartDate = 'startDate',
  StartTime = 'startTime',
  EndDate = 'endDate',
  EndTime = 'endTime',
  Color = 'color',
  IsAllDay = 'isAllDay',
  TimeModalTitle = 'timeModalTitle',
  distritos = 'distritos',
  selectedDate = "selectedDate",

}

export interface CalendarDay {
  number: number;
  dateType: DateType;
  events: CalendarEvent[];
  isSelected: boolean;
  isToday: boolean;
  dayOfWeek: number;
  selectedDate: Date;
}

export interface CalendarEvent {
  id: number;
  title: string | null;
  diasHabiles: number;
  startDate: Date;
  endDate?: Date;
  color: string;
  isAllDay: boolean;
  distritos: string ;
  selectedDate:Date;


}

export interface CalendarEventForm extends CalendarEvent {
  isEdit: boolean;
  language: Languages;
}

export interface CalendarMonth {
  name: string;
  number: number;
  isSelected: boolean;
  isCurrentMonth: boolean;
}

export interface CalendarYear {
  number: number;
  isSelected: boolean;
  isCurrentYear: boolean;
  yearType: DateType;
}

export interface TimeDateModal {
  date: Date;
  time: string;
  language: Languages;
}

export function getDefaultCalendarEvent(): CalendarEventForm {
  return {
    id: 0,
    title: '',
    diasHabiles: 0,
    startDate: new Date(),
    endDate: undefined,
    color: '#AD0000',
    isAllDay: false,
    isEdit: false,
    language: Languages.SPANISH,
    distritos:'',
    selectedDate: new Date()
  };
}
