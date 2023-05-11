import {Event} from './event';
export interface Placement {
  currencyName: string;
  events: Event[];
  hasHotSurvey: boolean;
  isEventAvailable: number;
  isSurveyWallAvailable: boolean;
  maxPayoutInCurrency: number;
  maxSurveyLength: number;
  minPayoutInCurrency: number;
  minSurveyLength: number;
  placementCode: number;
  placementErrorMessage: string;
  placementIdentifier: string;
}
